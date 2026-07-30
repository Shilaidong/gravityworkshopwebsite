#!/usr/bin/env python3
"""
引力坊 v4 章节大图后期流水线。

把 art-src/ 里的原始出图统一调色、压暗、导出 WebP，并按需生成
章节切换用的"线描负片"层。

用法：
    python3 tools/grade.py <源文件> <目标名> [--crop-bottom 0.045] [--no-line]

例：
    python3 tools/grade.py art-src/d-essays.jpg essays --crop-bottom 0.04
    python3 tools/grade.py art-src/x-desk.jpg desk --no-line

输出：
    assets/art/<目标名>.webp        1920 宽，章节大图
    assets/art/<目标名>-line.webp   560 宽，线描负片层（--no-line 可跳过）

调色意图：暖高光 + 冷暗部，把所有图压到同一色温，暗部沉到 #0B0E14 附近，
确保白色大标题在任何一张图上都压得住。
"""
import argparse
import os
import sys

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "assets", "art")


def lut(points):
    """由控制点线性插值出 256 级查找表。points=[(in,out),...]，0-255。"""
    table, pts = [], sorted(points)
    for i in range(256):
        for j in range(len(pts) - 1):
            x0, y0 = pts[j]
            x1, y1 = pts[j + 1]
            if x0 <= i <= x1:
                t = 0 if x1 == x0 else (i - x0) / (x1 - x0)
                table.append(int(max(0, min(255, y0 + (y1 - y0) * t))))
                break
        else:
            table.append(i)
    return table


# 全站统一色调：R 抬高光、B 抬暗部压高光 → 暖高光 / 冷暗部
CURVE_R = lut([(0, 0), (40, 30), (128, 132), (210, 224), (255, 255)])
CURVE_G = lut([(0, 0), (40, 30), (128, 126), (210, 212), (255, 250)])
CURVE_B = lut([(0, 8), (40, 40), (128, 118), (210, 196), (255, 240)])


def grade(im):
    im = im.convert("RGB").point(CURVE_R + CURVE_G + CURVE_B)
    im = ImageEnhance.Color(im).enhance(0.93)
    im = ImageEnhance.Contrast(im).enhance(1.06)
    return im


# 最左那条的高光压缩曲线。
# 悬浮嵌板结构下，画面最左 ~20% 同时承担两件事：整章唯一看得见的画面，
# 以及固定左栏那些 9–15px 的浅色小字的背景。出图简介要求那一条留亮，
# 于是高光会把小字吃掉——实测有 6 个滚动位置掉到 2.3–4.3:1。
# 这条曲线只压高光、保留暗部与纹理，把该区间压进参考站实测的
# μ35–45 / p90≤70，两个需求就都满足了。
CURVE_ROLLOFF = lut([(0, 0), (24, 24), (80, 52), (160, 68), (255, 82)])


def left_rolloff(im, edge=0.24, feather=0.09):
    """把最左 edge 比例的高光压下来，并向右羽化过渡到原图。"""
    comp = im.point(CURVE_ROLLOFF * 3)
    # 横向遮罩：左端全用压缩版，到 edge+feather 处完全用原图
    mask = Image.linear_gradient("L").resize((im.width, 1)).resize(im.size)
    x0, x1 = int(im.width * edge), int(im.width * (edge + feather))
    ramp = Image.new("L", (im.width, 1), 0)
    px = ramp.load()
    for x in range(im.width):
        if x <= x0:
            px[x, 0] = 255
        elif x >= x1:
            px[x, 0] = 0
        else:
            px[x, 0] = int(255 * (1 - (x - x0) / (x1 - x0)))
    mask = ramp.resize(im.size, Image.BILINEAR)
    return Image.composite(comp, im, mask)


def lineart(im, width=560):
    """线描负片：去色 → 边缘检测 → 提亮。

    只在章节交界的过渡瞬间以低透明度出现，所以刻意低分辨率 + 重模糊。
    边缘检测会产生大量高频颗粒，不压掉的话 WebP 体积会涨到基础图的 5 倍以上。
    """
    g = im.convert("L").resize(
        (width, round(width * im.height / im.width)), Image.LANCZOS)
    g = g.filter(ImageFilter.GaussianBlur(1.15)).filter(ImageFilter.FIND_EDGES)
    g = ImageOps.autocontrast(g, cutoff=1)
    g = g.point(lut([(0, 0), (30, 6), (90, 96), (160, 208), (255, 255)]))
    blue = g.point(lut([(0, 0), (128, 138), (255, 255)]))
    return Image.merge("RGB", (g, g, blue))


def main():
    ap = argparse.ArgumentParser(description="章节大图后期流水线")
    ap.add_argument("src", help="原始出图路径")
    ap.add_argument("name", help="目标名，不含扩展名")
    ap.add_argument("--crop-bottom", type=float, default=0.0,
                    help="裁掉底部比例，用于去除 AI 伪造的签名字样，如 0.045")
    ap.add_argument("--flip", action="store_true",
                    help="水平镜像。出图时亮部落在右边、左边成了黑洞时用——"
                         "嵌板结构下左侧那 270px 是整章唯一看得见画的地方，"
                         "必须有可辨内容（见 PLAN-v4.md A 批复盘第 2 条）")
    ap.add_argument("--no-line", action="store_true",
                    help="不生成线描层（浅色区配图不参与章节过渡时用）")
    ap.add_argument("--no-left-rolloff", action="store_true",
                    help="不做最左高光压缩。章节大图一律要做（固定左栏的小字压在上面）；"
                         "嵌板配图不在左栏底下，可以关掉")
    ap.add_argument("--out-width", type=int, default=1920,
                    help="输出宽度，默认 1920（章节大图要铺满视口）。"
                         "嵌板配图按显示尺寸的 2 倍给就够了，比如画廊卡片显示 286px "
                         "就给 640——竖图套用 1920 会得到 1920x2400，白涨一百多 KB")
    ap.add_argument("--quality", type=int, default=72)
    args = ap.parse_args()

    if not os.path.exists(args.src):
        sys.exit("找不到源文件: " + args.src)
    os.makedirs(OUT_DIR, exist_ok=True)

    im = Image.open(args.src)
    if args.crop_bottom:
        im = im.crop((0, 0, im.width, int(im.height * (1 - args.crop_bottom))))
    if args.flip:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    im = grade(im)
    if not args.no_left_rolloff:
        im = left_rolloff(im)

    w = args.out_width
    full = im.resize((w, round(w * im.height / im.width)), Image.LANCZOS)
    fp = os.path.join(OUT_DIR, args.name + ".webp")
    full.save(fp, "WEBP", quality=args.quality, method=6)

    line_kb = 0
    if not args.no_line:
        lp = os.path.join(OUT_DIR, args.name + "-line.webp")
        lineart(im).save(lp, "WEBP", quality=45, method=6)
        line_kb = os.path.getsize(lp) // 1024

    print("%-12s %dx%d -> %4dKB   line %4dKB"
          % (args.name, full.width, full.height,
             os.path.getsize(fp) // 1024, line_kb))

    total = sum(os.path.getsize(os.path.join(OUT_DIR, f))
                for f in os.listdir(OUT_DIR) if f.endswith(".webp"))
    print("assets/art 当前合计: %d KB" % (total // 1024))


if __name__ == "__main__":
    main()
