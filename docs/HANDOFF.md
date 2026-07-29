# 交接说明 —— 引力坊官网 v4

> 给接手开发的 Agent。**开工前请完整读一遍**，这里全是踩过的坑，
> 每一条都花了实际调试时间才发现。开发计划在 [`PLAN-v4.md`](PLAN-v4.md)。

---

## 1. 现在到哪一步了

| 提交 | 内容 |
|---|---|
| `eeb3db6` | **当前 HEAD**。v4 样板：开场 + 第一章「定位」，已验收 |
| `c9aa264` | v3 纯代码生成版（无图片依赖），回退点，存档在 `docs/v3-generative.html` |
| `985af15` | 清空 v1/v2 |

**已完成**：开场碎裂动效、第一章完整、五个招牌动作、字体自托管、3 张大图。
**下一步**：`PLAN-v4.md` 的 A 批 —— 悬浮嵌板结构改造。

---

## 2. 这个项目的硬约束

**不使用 Shopify Editions 的任何资产。** 参考站的文艺复兴合成画、Shopify Sans 字体、
打包代码都是 Shopify 的版权资产，放到引力坊的商业官网上一眼可辨、风险实打实。

- **可以照搬的**：版式规格、动效编排、缓动曲线、交互逻辑、组件语法（设计词汇）
- **必须自建的**：全部图像（MiniMax 生成）、字体（OFL 开源自托管）

录屏 `参考网站录屏:www.shopify.com:editions:winter2026.mov` 只作测量与研究用途，
已在 `.gitignore` 中。关键帧存档在 `docs/ref-frames/`。

需要重新抽帧时：

```bash
ffmpeg -i "参考网站录屏:www.shopify.com:editions:winter2026.mov" \
  -vf "fps=1/2.5,scale=880:-1" -q:v 5 /tmp/ref/d%03d.jpg
```

---

## 3. 实测版式规格（不要凭感觉改）

全部从录屏逐帧像素实测得来，`index.html` 的 `:root` 里已固化：

```
--rail-w   250px      左栏宽
正文起点    x = 270px   （= 左栏 + 20px 槽）
--edge-r   22px       右边距
章节大标题  13.5vw     （1384 视口下 ≈188px）
--paper    #D8D9CB    灰绿骨色（不是奶油色，别调暖）
--display  #F6F8EB    微冷白
嵌板奶白    #F6F8EB
```

改动前先回看 `docs/ref-frames/` 里的对应帧。

---

## 4. 五个坑（都是真实调试出来的）

### 4.1 不要用 IntersectionObserver 驱动入场

**现象**：用户从锚点直达、或浏览器恢复上次滚动位置时，落点上方已在视口内的元素
会永远卡在 `opacity:0`。

**做法**：`index.html` 里所有滚动驱动逻辑（`onScroll` / `tonePass` / `revealPass`）
都跑在**一个 rAF 轮询循环**里，比较 `scrollY` 是否变化。空闲时每帧只做一次数值比较，
元素显形后即从待办表移除。顺带解决 iOS 惯性滚动时 scroll 事件被节流的问题。

**别改回事件监听**。

### 4.2 固定左栏跨明暗交界时文字会消失

左栏是 `position:fixed` 的，上半截可能在深色图上、下半截已经进了浅色区。
整栏统一跟随 `body` 着色必然有一头看不见。

**做法**：`blockAt(y)` 查某个视口高度背后是哪个区块，左栏各块与顶栏各自
设 `data-lt="dark|light"` 取色。嵌板结构改造后这条**更关键**（左右两侧会一直漏出深色画面）。

### 4.3 `<img>` 必须有 `height:auto`

`<img width="1920" height="1080">`（防跳版用）在没有 `height:auto` 时会压过
CSS 宽度，把图拉变形。全局 img 规则里已加，别删。

### 4.4 降级模式不能吞内容

`prefers-reduced-motion` 下曾把整个开场面板 `opacity:0`，结果副题文案
「名校路径的新标准」彻底消失 —— 那句话只在面板里出现过。

**做法**：降级时给面板加 `.lean`，只收起与左栏重复的目录，**保留副题**。
新增任何"降级时隐藏 X"的规则前，先确认 X 的内容在别处还有。

### 4.5 黄铜色分深浅两个令牌

`--brass: #B8873F` 在深底上没问题，落到 `--paper: #D8D9CB` 上只有 **2.2:1**，不可读。
浅底一律用 `--brass-ink: #6B4B1A`。新增浅底元素时注意别用错。

---

## 5. 怎么验证（每批必跑）

### 截图：用本机 Chrome 无头模式，不要用 IDE 的浏览器预览

IDE 那个预览面板在本项目里**已验证不可靠**：会把 1384px 宽的页面渲染进一个
~170px 的角落，而且不派发 scroll 事件（探针实测触发 0 次）。

```bash
python3 -m http.server 4321        # 终端 1
cp tools/_shot.html .              # 夹具必须与 index.html 同源
tools/shoot.sh 1980 章节大标题       # 终端 2，输出到 .shots/
tools/shoot.sh 0 降级 1384 868 --reduced-motion
```

**已知坑**：`--virtual-time-budget` 会快进时间，CSS 过渡常被截在中途，
元素看着偏灰偏暗。判断"是不是真的没渲染"要去实时页面查 `getComputedStyle`，
**不要只信截图**（样板阶段为此白查过一轮）。

### 对比度

纯色底的文字用脚本扫（阈值 4.5:1，要求 0 缺陷）。
**压在图上的文字扫不出来** —— 脚本拿到的是区块背景色，不是图片像素。
那部分要用截图像素法：取文字区域上下的净空带，算 p90 亮度对前景的比值。

### 其它

- 帧率：连续 120 帧采样 `performance.now()` 间隔，中位 ≥50fps（当前 60fps）
- 响应式：375 / 768 / 1280 / 1440，`documentElement.scrollWidth` 不得超 `innerWidth`
- 首屏关键路径 ≤250KB（当前 160KB）
- 控制台无报错

---

## 6. 出图流水线

MiniMax 已装好并授权（额度充足，用户明确说随便用）：

```bash
mmx image generate --width 2048 --height 1152 --seed 3405 \
  --out art-src/e-interview.jpg --prompt "<见 PLAN-v4.md 第五节>"

python3 tools/grade.py art-src/e-interview.jpg interview --crop-bottom 0.04
```

- **锁定风格后缀**必须每张都带，否则八张图不像一套（见 `PLAN-v4.md` 第五节）
- **每张出图后必须目检**：AI 经常在角落伪造画家签名字样，样板的开场图就中招了，
  用 `--crop-bottom 0.045` 裁掉的
- 原始出图放 `art-src/`（已 gitignore，不部署），成品进 `assets/art/`
- `assets/` 目录 = 上线内容，不要往里放素材

---

## 7. 目录约定

```
index.html            唯一的站点代码文件
assets/art/           成品图 WebP（= 上线内容）
assets/fonts/         自托管 OFL 字体（Inter Tight 600/700, Cormorant Italic 400/600）
tools/                开发工具，不部署
art-src/              出图原始素材，已 gitignore
docs/                 计划、交接、参考帧、v3 存档
COMPANY.md            全部文案的唯一事实源
```

**文案一律取自 `COMPANY.md`**，不要自己编数据或案例。
该文件里已明确标注哪些是"中介套路"不能用（500+/98% 数字墙、
「每日仅限 3 个名额」、95% 成功率、灰度头像 hover 上色）。

---

## 8. 交付节奏

`PLAN-v4.md` 第八节分了 A/B/C/D 四批。**每批做完给用户截图确认再进下一批。**

A 批（嵌板结构）最关键 —— 结构一旦定死，后面三批就是填内容；
反过来，结构错了再复制八遍，返工量就是八倍。
