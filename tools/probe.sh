#!/bin/zsh
# 引力坊 v4 实时状态探针
#
# 截图会被 --virtual-time-budget 截在过渡中途，看着"没渲染"其实只是没过渡完。
# 所以结构判定走这个脚本：它读实时页面的类名、矩形、getComputedStyle，
# 再把结果画成可见文字截图出来（--dump-dom 在 load 时就吐 DOM，拿不到 rAF 之后的状态）。
#
# 用法：
#   tools/probe.sh <滚动位置> [宽] [高]     → .shots/probe-<y>.png
#
# 前置：python3 -m http.server 4321

set -u
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/.shots"

Y="${1:-0}"
W="${2:-1384}"
H="${3:-868}"

[[ -f "$ROOT/_probe.html" ]] || cp "$ROOT/tools/_probe.html" "$ROOT/_probe.html"
if ! curl -sf -o /dev/null "http://localhost:4321/index.html"; then
  echo "错误：4321 端口没有服务。先在项目根目录运行： python3 -m http.server 4321"
  exit 1
fi

mkdir -p "$OUT_DIR"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 \
  --window-size=1384,1160 --virtual-time-budget=16000 \
  --screenshot="$OUT_DIR/probe-$Y.png" \
  "http://localhost:4321/_probe.html?y=$Y&w=$W&h=$H" >/dev/null 2>&1

[[ -f "$OUT_DIR/probe-$Y.png" ]] && echo "已保存 .shots/probe-$Y.png" || { echo "探针失败"; exit 1; }
