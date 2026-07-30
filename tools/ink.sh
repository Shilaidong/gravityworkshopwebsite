#!/bin/zsh
# 夹层定位量具：报出每章标题墨迹、道具矩形、真实交叠比例与建议 right 值。
#
# 用法：
#   tools/ink.sh [目标覆盖率]      默认 33
#
# 前置：
#   python3 -m http.server 4321   （项目根目录）
#
# 为什么要有这个：遮挡覆盖率必须量字的墨迹，不能量元素盒。
# .chap-display 是块级元素，盒子撑满整列宽，按盒子算会得出虚假的达标读数
# （实测过一次：盒子算 35%，墨迹实际 0%，道具和字中间还空着 79px）。
# 详见 docs/HANDOFF.md 4.13。

set -u
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:-33}"

if ! curl -sf -o /dev/null "http://localhost:4321/index.html"; then
  echo "错误：4321 端口没有服务。先运行： python3 -m http.server 4321"
  exit 1
fi
cp -f "$ROOT/tools/_ink.html" "$ROOT/_ink.html"

mkdir -p "$ROOT/.shots"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1150,760 \
  --virtual-time-budget=12000 \
  --screenshot="$ROOT/.shots/ink.png" \
  "http://localhost:4321/_ink.html?target=$TARGET" >/dev/null 2>&1

rm -f "$ROOT/_ink.html"
[[ -f "$ROOT/.shots/ink.png" ]] && echo "已保存 .shots/ink.png" || { echo "失败"; exit 1; }
