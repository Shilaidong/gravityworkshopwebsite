#!/bin/zsh
# 引力坊 v4 截图工具
#
# 为什么不用 IDE 内置的浏览器预览：本项目里那个预览面板的截图管道会
# 把 1384px 宽的页面渲染进一个 ~170px 的角落，且不派发 scroll 事件。
# 已验证不可靠，一律走本机 Chrome 无头模式。
#
# 用法：
#   tools/shoot.sh <滚动位置> <输出名> [宽] [高] [--reduced-motion]
#
# 例：
#   tools/shoot.sh 0    开场
#   tools/shoot.sh 1980 章节大标题
#   tools/shoot.sh 0    降级 1384 868 --reduced-motion
#   tools/shoot.sh 3300 手机版 375 812
#
# 前置：
#   1) python3 -m http.server 4321   （在项目根目录起服务）
#   2) cp tools/_shot.html .          （夹具必须与 index.html 同源）

set -u
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/.shots"

Y="${1:-0}"
NAME="${2:-shot}"
W="${3:-1384}"
H="${4:-868}"
EXTRA=""
[[ "${5:-}" == "--reduced-motion" ]] && EXTRA="--force-prefers-reduced-motion"

if [[ ! -f "$ROOT/_shot.html" ]]; then
  echo "缺少夹具，正在从 tools/ 复制…"
  cp "$ROOT/tools/_shot.html" "$ROOT/_shot.html"
fi
if ! curl -sf -o /dev/null "http://localhost:4321/index.html"; then
  echo "错误：4321 端口没有服务。先在项目根目录运行： python3 -m http.server 4321"
  exit 1
fi

mkdir -p "$OUT_DIR"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 $EXTRA \
  --window-size="$W,$H" --virtual-time-budget=12000 \
  --screenshot="$OUT_DIR/$NAME.png" \
  "http://localhost:4321/_shot.html?y=$Y&w=$W&h=$H" >/dev/null 2>&1

if [[ -f "$OUT_DIR/$NAME.png" ]]; then
  echo "已保存 .shots/$NAME.png  (${W}x${H} @ y=$Y)"
else
  echo "截图失败"; exit 1
fi

# 已知坑：--virtual-time-budget 会快进时间，CSS 过渡可能被截在中途，
# 于是元素看着偏灰/偏暗。判断"是不是真的没渲染"要去实时页面查
# getComputedStyle，不要只信截图。
