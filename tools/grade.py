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
    ap.add_argument("--no-line", action="store_true",
                    help="不生成线描层（浅色区配图不参与章节过渡时用）")
    ap.add_argument("--quality", type=int, default=72)
    args = ap.parse_args()

    if not os.path.exists(args.src):
        sys.exit("找不到源文件: " + args.src)
    os.makedirs(OUT_DIR, exist_ok=True)

    im = Image.open(args.src)
    if args.crop_bottom:
        im = im.crop((0, 0, im.width, int(im.height * (1 - args.crop_bottom))))
    im = grade(im)

    full = im.resize((1920, round(1920 * im.height / im.width)), Image.LANCZOS)
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
