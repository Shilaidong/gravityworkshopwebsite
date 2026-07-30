# 引力坊官网 GRAVITY FANG

单页站点，八个章节。纯静态，无构建步骤。

## 本地预览

```bash
python3 -m http.server 4321
```

## 目录

```
index.html          唯一的站点代码文件（HTML + CSS + JS 全在里面）
assets/art/         章节背景与抠图前景（WebP）
assets/fonts/       自托管 OFL 字体
assets/qr-wechat.jpg 微信二维码
tools/              开发工具，不部署
docs/               开发计划、交接说明、参考帧
COMPANY.md          全部文案的事实源
```

## 部署

把 `index.html` 与 `assets/` 上传到任意静态托管即可（Vercel / Netlify / 对象存储 + CDN）。
`tools/`、`docs/`、`art-src/`、`.shots/` 都不需要上传。

## 怎么改

- **改文案**：直接在 `index.html` 里搜中文原句
- **换图**：新图放 `art-src/`，跑 `tools/grade.py`（背景）或 `tools/cutout.py`（抠图），
  再改 `index.html` 里的路径
- **改电话/微信**：搜 `18519739539` 与 `qr-wechat.jpg`

## 还需要你做的一件事

**表单开箱即用**：提交后会把信息复制到剪贴板并高亮微信二维码，扫码粘贴即可，无需任何配置。
也不会给用户"提交成功"的假象。

接入方式：注册一个第三方表单服务（Formspree 之类），拿到端点地址后，
在 `index.html` 里搜 `FORM_ENDPOINT`，把空字符串换成你的端点即可。

## 开发者

改动前请先读 [`docs/HANDOFF.md`](docs/HANDOFF.md)——里面是十几条实际调试出来的坑，
包括滚动驱动、固定左栏取色、抠图流水线、对比度测量方法等。
