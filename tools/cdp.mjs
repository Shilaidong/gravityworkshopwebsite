#!/usr/bin/env node
/* CDP 实测工具：真实帧率、降级行为、筛选组合。
   帧率必须走真实浏览器 + CDP——headless 的 --virtual-time-budget 会快进时间，
   performance.now() 的间隔是合成的（见 docs/HANDOFF.md 第 5 节）。
   Node ≥22 自带全局 WebSocket，不需要装 websocket-client。

   用法：
     node tools/cdp.mjs frames    真实帧间隔采样（滚动中 240 帧）
     node tools/cdp.mjs reduce    prefers-reduced-motion：规线画完 + 内容零丢失
     node tools/cdp.mjs filters   §5 筛选组合行为（显示数 / 期望数 / 计数器三方一致）
     node tools/cdp.mjs all       依次全跑
*/
import { spawn } from 'node:child_process';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9222;
const URL_ = process.env.CDP_URL || 'http://localhost:4321/';
const W = 1384, H = 868;   // 参考站原生录屏尺寸，见 HANDOFF 第 3 节

const mode = process.argv[2] || 'all';

async function ensureChrome() {
  try {
    await fetch(`http://127.0.0.1:${PORT}/json/version`).then(r => r.json());
    return null;                                   // 已有实例，别动它
  } catch {}
  const proc = spawn(CHROME, [
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/cdp-chrome-profile',
    '--no-first-run', '--no-default-browser-check',
    `--window-size=${W + 16},${H + 88}`, 'about:blank',
  ], { stdio: 'ignore' });
  for (let i = 0; i < 50; i++) {
    await new Promise(r => setTimeout(r, 200));
    try { await fetch(`http://127.0.0.1:${PORT}/json/version`).then(r => r.json()); return proc; }
    catch {}
  }
  throw new Error('Chrome CDP 端口没起来');
}

let id = 0;
const pending = new Map();
const consoleErrors = [];
let ws;
const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
  const i = ++id;
  pending.set(i, m => m.error ? rej(new Error(method + ': ' + JSON.stringify(m.error))) : res(m.result));
  ws.send(JSON.stringify({ id: i, method, params, sessionId }));
});

async function connect() {
  const ver = await fetch(`http://127.0.0.1:${PORT}/json/version`).then(r => r.json());
  ws = new WebSocket(ver.webSocketDebuggerUrl);
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    else if (m.method === 'Runtime.exceptionThrown')
      consoleErrors.push(m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text);
    else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error')
      consoleErrors.push(m.params.args?.map(a => a.value ?? a.description).join(' '));
  };
  await new Promise(r => { ws.onopen = r; });
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  return sessionId;
}

const evaljs = (sid, expression, awaitPromise = false) =>
  send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise }, sid)
    .then(r => { if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails)); return r.result.value; });

async function openPage(sid) {
  await send('Page.enable', {}, sid);
  await send('Runtime.enable', {}, sid);
  await send('Emulation.setDeviceMetricsOverride',
    { width: W, height: H, deviceScaleFactor: 1, mobile: false }, sid);
  await send('Page.navigate', { url: URL_ }, sid);
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 250));
    if (await evaljs(sid, 'document.readyState') === 'complete') break;
  }
  await new Promise(r => setTimeout(r, 800));   // 字体与首帧稳定
}

/* ---------- 1. 真实帧率 ---------- */
async function frames(sid) {
  await send('Emulation.setEmulatedMedia',
    { features: [{ name: 'prefers-reduced-motion', value: '' }] }, sid);
  const deltas = await evaljs(sid, `new Promise(resolve => {
    document.documentElement.style.scrollBehavior = 'auto';
    const max = document.documentElement.scrollHeight - innerHeight;
    const deltas = []; let last = -1, y = 0, n = 0; const N = 240;
    function tick(t) {
      if (last >= 0) deltas.push(t - last);
      last = t;
      y = (y + 47) % Math.max(max, 1); window.scrollTo(0, y);   // 每帧都触发滚动处理
      if (++n < N) requestAnimationFrame(tick); else resolve(deltas);
    }
    requestAnimationFrame(tick);
  })`, true);
  const s = [...deltas].sort((a, b) => a - b);
  const med = s[Math.floor(s.length / 2)];
  const p90 = s[Math.floor(s.length * 0.9)];
  const long34 = deltas.filter(d => d > 34).length;
  const long50 = deltas.filter(d => d > 50).length;
  console.log(`[frames] ${deltas.length} 帧：中位 ${med.toFixed(1)}ms（${(1000 / med).toFixed(1)}fps）`
    + ` · p90 ${p90.toFixed(1)}ms（${(1000 / p90).toFixed(1)}fps）`
    + ` · >34ms ${long34} 帧 · >50ms ${long50} 帧`);
  return med <= 20 && long50 <= deltas.length * 0.05;
}

/* ---------- 2. prefers-reduced-motion ---------- */
const countExpr = `(function(){
  let visible = 0; const hidden = [];
  for (const el of document.querySelectorAll('body *')) {
    if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    if (cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0) visible++;
    else hidden.push(el.tagName.toLowerCase() + (el.id ? '#' + el.id : '')
      + '「' + el.textContent.trim().slice(0, 14) + '」');
  }
  return { visible, hidden };
})()`;

async function reduce(sid) {
  // 两侧都从刚 reload 的干净状态量，否则动态边注会把计数带偏
  await send('Emulation.setEmulatedMedia',
    { features: [{ name: 'prefers-reduced-motion', value: '' }] }, sid);
  await send('Page.reload', {}, sid);
  await new Promise(r => setTimeout(r, 2000));
  const normal = await evaljs(sid, countExpr);
  await send('Emulation.setEmulatedMedia',
    { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }, sid);
  await send('Page.reload', {}, sid);
  await new Promise(r => setTimeout(r, 2000));
  const rm = await evaljs(sid, `(function(){
    const mm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const offsets = [...document.querySelectorAll('.fig .draw')]
      .map(el => getComputedStyle(el).strokeDashoffset);
    const notIn = [...document.querySelectorAll('.fig:not(.in)')].length;   // 尚未进视口的图
    const counts = ${countExpr};
    return { mm, offsets, notIn, counts, draws: offsets.length };
  })()`);
  await send('Emulation.setEmulatedMedia',
    { features: [{ name: 'prefers-reduced-motion', value: '' }] }, sid);
  const zeroed = rm.offsets.filter(o => o === '0px' || o === '0').length;
  const same = normal.visible === rm.counts.visible
    && normal.hidden.length === rm.counts.hidden.length;
  console.log(`[reduce] 规线 ${zeroed}/${rm.draws} 直接画完（其中 ${rm.notIn} 张图尚未进视口）`
    + ` · 可见文字元素 正常 ${normal.visible} / 降级 ${rm.counts.visible}`
    + ` · 不可见 正常 ${normal.hidden.length} / 降级 ${rm.counts.hidden.length} · matchMedia=${rm.mm}`);
  console.log(`  不可见清单（两态应一致）：${rm.counts.hidden.join(' ')}`);
  if (!same) console.log(`  ✗ 降级吞了内容：${normal.visible} → ${rm.counts.visible}`);
  return zeroed === rm.draws && same && rm.mm;
}

/* ---------- 0. 全图加载 + 控制台 ---------- */
async function audit(sid) {
  // loading="lazy" 的图要滚近了才加载：先整页走一遍再查
  await evaljs(sid, `(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    const max = document.documentElement.scrollHeight - innerHeight;
    for (let y = 0; y <= max; y += Math.ceil(max / 8)) {
      window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  })()`, true);
  await new Promise(r => setTimeout(r, 600));
  const imgs = await evaljs(sid, `[...document.images].map(i => ({
    src: i.src.split('/').pop(), ok: i.complete && i.naturalWidth > 0,
    w: i.naturalWidth, h: i.naturalHeight }))`);
  let ok = true;
  for (const i of imgs) {
    console.log(`[audit] ${i.src} ${i.w}×${i.h} ${i.ok ? '✓' : '✗ 未加载'}`);
    if (!i.ok) ok = false;
  }
  if (consoleErrors.length) { console.log(`[audit] 控制台错误 ${consoleErrors.length}：${consoleErrors.join(' | ')}`); ok = false; }
  else console.log('[audit] 控制台无错误');
  return ok;
}

/* ---------- 3. §5 筛选组合 ---------- */
async function filters(sid) {
  const r = await evaljs(sid, `(function(){
    const rows = [...document.querySelectorAll('#rec tbody tr')];
    const cN = document.getElementById('cN');
    const btns = [...document.querySelectorAll('.fbtn')];
    const combos = [
      [['t','UG']], [['r','UK']], [['d','ENG']],
      [['t','UG'],['r','UK']], [['t','UG'],['r','EU']], [['r','APAC'],['d','BIZ']],
      [['t','UG'],['r','EU'],['d','ENG']],
      [['t','PG'],['r','US'],['d','ENG']], [['t','UG'],['r','UK'],['d','ENG']]
    ];
    const click = (f, v) => btns.find(b => b.dataset.f === f && b.dataset.v === v).click();
    const reset = () => ['t','r','d'].forEach(f => click(f, ''));
    const out = [];
    for (const combo of combos) {
      reset(); combo.forEach(([f, v]) => click(f, v));
      const shown = rows.filter(r => !r.hidden).length;
      const expected = rows.filter(r => combo.every(([f, v]) => !v || r.dataset[f] === v)).length;
      const counter = parseInt(cN.textContent, 10);
      const pressedOK = ['t','r','d'].every(f => {
        const sel = (combo.find(([cf]) => cf === f) || [f, ''])[1];
        const p = btns.filter(b => b.dataset.f === f && b.getAttribute('aria-pressed') === 'true');
        return p.length === 1 && p[0].dataset.v === sel;
      });
      out.push({ combo: combo.map(c => c.join('=')).join(' + '), shown, expected, counter,
                 ok: shown === expected && expected === counter && pressedOK });
    }
    reset();
    const reach = { t: new Set(), r: new Set(), d: new Set() };
    btns.forEach(b => { if (b.dataset.v) reach[b.dataset.f].add(b.dataset.v); });
    const unreachable = rows.filter(r => ['t','r','d'].some(f => !reach[f].has(r.dataset[f])))
      .map(r => r.cells[0].textContent + ' (d=' + r.dataset.d + ')');
    return { out, afterReset: rows.filter(r => !r.hidden).length, unreachable };
  })()`);
  let ok = r.afterReset === 21 && r.unreachable.length === 0;
  for (const c of r.out) {
    console.log(`[filters] ${c.combo.padEnd(26)} 显示 ${c.shown} · 期望 ${c.expected} · 计数器 ${c.counter} ${c.ok ? '✓' : '✗'}`);
    if (!c.ok) ok = false;
  }
  console.log(`[filters] 重置后 ${r.afterReset}/21`
    + (r.unreachable.length ? ` · ✗ 任何筛选都到不了的行：${r.unreachable.join('、')}` : ''));
  return ok;
}

/* ---------- 4. 对比度全扫（sRGB 合成后算，阈值 4.5:1 / 大字 3:1） ---------- */
async function contrast(sid) {
  const r = await evaljs(sid, `(function(){
    const parse = s => { const m = /rgba?\\(([^)]+)\\)/.exec(s); if (!m) return null;
      const p = m[1].split(',').map(parseFloat); return { r:p[0], g:p[1], b:p[2], a:p.length>3?p[3]:1 }; };
    const lum = c => { const f = [c.r,c.g,c.b].map(v => { v/=255;
      return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); });
      return 0.2126*f[0] + 0.7152*f[1] + 0.0722*f[2]; };
    const over = (fg,bg) => fg.a>=1 ? fg : ({ r:fg.r*fg.a+bg.r*(1-fg.a),
      g:fg.g*fg.a+bg.g*(1-fg.a), b:fg.b*fg.a+bg.b*(1-fg.a), a:1 });
    const ratio = (f,b) => (Math.max(lum(f),lum(b))+0.05)/(Math.min(lum(f),lum(b))+0.05);
    let checked = 0; const fails = [];
    for (const el of document.querySelectorAll('body *')) {
      const svgText = el.namespaceURI === 'http://www.w3.org/2000/svg'
        && (el.tagName === 'text' || el.tagName === 'tspan');
      if (![...el.childNodes].some(n => n.nodeType===3 && n.textContent.trim()) && !svgText) continue;
      const st = getComputedStyle(el);
      if (st.display==='none' || st.visibility==='hidden') continue;
      if (el.getBoundingClientRect().width === 0) continue;
      const fg = parse(svgText ? st.fill : st.color);
      if (!fg) continue;
      let bg = null, p = el;
      while (p && p !== document.documentElement) {
        const c = parse(getComputedStyle(p).backgroundColor);
        if (c && c.a > 0.95) { bg = c; break; }
        p = p.parentElement;
      }
      if (!bg) continue;
      const size = parseFloat(st.fontSize), wgt = parseInt(st.fontWeight,10)||400;
      const need = (size>=24 || (size>=18.66 && wgt>=700)) ? 3.0 : 4.5;
      const rr = ratio(over(fg,bg), bg);
      checked++;
      if (rr < need) fails.push(((el.className.baseVal ?? el.className) || el.tagName)
        + ' ' + size.toFixed(1) + 'px = ' + rr.toFixed(2) + ':1 需 ' + need);
    }
    return { checked, fails };
  })()`);
  console.log(`[contrast] 已查 ${r.checked} 处，缺陷 ${r.fails.length}`
    + (r.fails.length ? '\n  ' + r.fails.join('\n  ') : ''));
  return r.fails.length === 0;
}

/* ---------- 5. 四档响应式横向溢出 ---------- */
async function widths(sid) {
  let ok = true;
  for (const w of [375, 768, 1280, 1440]) {
    await send('Emulation.setDeviceMetricsOverride',
      { width: w, height: 868, deviceScaleFactor: 1, mobile: w < 500 }, sid);
    await new Promise(r => setTimeout(r, 450));
    const m = await evaljs(sid, `({ sw: document.documentElement.scrollWidth, iw: innerWidth })`);
    const pass = m.sw <= m.iw;
    console.log(`[widths] ${w}px：scrollWidth=${m.sw} vs innerWidth=${m.iw} ${pass ? '✓' : '✗ 溢出'}`);
    if (!pass) ok = false;
  }
  await send('Emulation.setDeviceMetricsOverride',
    { width: W, height: H, deviceScaleFactor: 1, mobile: false }, sid);
  return ok;
}

/* ---------- 驱动 ---------- */
const chromeProc = await ensureChrome();
const sid = await connect();
await openPage(sid);

let ok = true;
try {
  if (mode === 'audit' || mode === 'all') ok = await audit(sid) && ok;
  if (mode === 'filters' || mode === 'all') ok = await filters(sid) && ok;
  if (mode === 'contrast' || mode === 'all') ok = await contrast(sid) && ok;
  if (mode === 'widths' || mode === 'all') ok = await widths(sid) && ok;
  if (mode === 'reduce' || mode === 'all') ok = await reduce(sid) && ok;
  if (mode === 'frames' || mode === 'all') {
    await send('Page.reload', {}, sid);
    await new Promise(r => setTimeout(r, 1500));
    ok = await frames(sid) && ok;
  }
} finally {
  await send('Target.closeTarget', { targetId: (await send('Target.getTargets')).targetInfos.find(t => t.url.startsWith(URL_.replace(/\/$/, '')) || t.url === URL_)?.targetId || '' }, {}).catch(() => {});
  ws.close();
  if (chromeProc) chromeProc.kill();
}
console.log(ok ? 'ALL PASS' : 'FAILURES PRESENT');
process.exit(ok ? 0 : 1);
