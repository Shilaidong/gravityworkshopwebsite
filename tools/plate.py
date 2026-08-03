#!/usr/bin/env python3
"""
引力坊技术年刊 · 双色调网点图版

把一张照片转成「印在这份文件里的图版」，而不是「贴在上面的照片」。
这个区别是本版能不能加图的关键：v6 之所以把 38 张图全删掉，
就是因为它们以照片的身份出现、与品牌的 Quiet technology 打架。
半色调网屏解决这件事——网点本身就是印刷品的证据。

用法：
    python3 tools/plate.py <源文件> <目标名> [--cell 5] [--out-width 1280]
    python3 tools/plate.py art-src/pl-draft.jpg draft --cell 5 --contact

输出：
    assets/plates/<目标名>.png       量化后的双色调网点图版
    .shots/<目标名>-zoom.png         --contact 时输出的 200% 放大自查图

三色约束：只用文件本来的三种墨色，不引入第四种。
    纸 #FBFAF7 · 墨 #14161A · 黄铜 #6B4B1A

为什么导出 PNG 而不是有损 WebP：网点边缘必须锐利，
有损压缩会把点糊成连续调，图版就退回成照片了。
"""
import argparse
import math
import os
import sys

from PIL import Image, ImageDraw, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "assets", "plates")
SHOT_DIR = os.path.join(ROOT, ".shots")

PAPER = (251, 250, 247)
INK = (20, 22, 26)
BRASS = (107, 75, 26)


def lut(points):
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


def press_lut(gray):
    """按每张图的实际分位做电平映射，而不是 autocontrast。

    实测：这批物证照片是高调的（p5=170 / 中位 184 / p95=240），
    整张挤在亮部三分之一。autocontrast(cutoff=1) 会把 170 拉到 16，
    浅灰台面直接变成近黑实地，中间调整个丢失——网点就没有层次可打了。

    半色调要的恰恰是中间调：点的大小由灰度驱动，输入全挤在两端
    就只剩"全白"和"全黑"两种点。所以这里把源图的 p2–p98 映射到
    30–232（不铺满 0–255，留住纸的呼吸），再加一点 S 形加强对比。
    """
    d = sorted(gray.resize((240, max(1, 240 * gray.height // gray.width))).getdata())
    n = len(d)
    lo, hi = d[int(n * 0.02)], d[int(n * 0.98)]
    if hi - lo < 24:
        lo, hi = max(0, lo - 12), min(255, hi + 12)
    mid = (lo + hi) / 2
    return lut([(0, 30), (lo, 30), (mid, 128), (hi, 232), (255, 232)])


def halftone(gray, cell, angle=15):
    """真半色调网屏：按旋转网格取样，每格画一个半径正比于暗度的点。

    网屏要旋转——正交网格会和像素栅格、以及页面上的水平规线共振，
    出现明显的摩尔纹。15° 是印刷上常用的角度之一。
    """
    w, h = gray.size
    # 旋转后仍要盖满画面，所以画布放大到对角线
    diag = int(math.hypot(w, h)) + cell * 4
    big = Image.new("L", (diag, diag), 255)
    big.paste(gray.rotate(-angle, expand=True, fillcolor=255),
              ((diag - gray.rotate(-angle, expand=True).width) // 2,
               (diag - gray.rotate(-angle, expand=True).height) // 2))

    dots = Image.new("L", (diag, diag), 255)
    d = ImageDraw.Draw(dots)
    px = big.load()
    rmax = cell * 0.72          # 略大于半格，最暗处点会相接成实地
    for gy in range(0, diag, cell):
        for gx in range(0, diag, cell):
            # 用格子中心的亮度定点大小
            v = px[min(gx + cell // 2, diag - 1), min(gy + cell // 2, diag - 1)]
            r = (1 - v / 255.0) ** 0.62 * rmax
            if r < 0.35:
                continue
            cx, cy = gx + cell / 2, gy + cell / 2
            d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=0)

    dots = dots.rotate(angle, resample=Image.BICUBIC, fillcolor=255)
    ox, oy = (diag - w) // 2, (diag - h) // 2
    return dots.crop((ox, oy, ox + w, oy + h))


def duotone(dots, gray):
    """双色调映射：网点覆盖处按原图明暗在墨与黄铜之间取色，其余为纸。

    只用两种墨——暗部走墨，中间调走黄铜。这样图版和正文、编号
    共用同一套颜色，不会像贴上去的第三方素材。
    """
    w, h = dots.size
    out = Image.new("RGB", (w, h), PAPER)
    dp, gp, op = dots.load(), gray.load(), out.load()
    for y in range(h):
        for x in range(w):
            cov = 1 - dp[x, y] / 255.0        # 网点覆盖率
            if cov < 0.04:
                continue
            t = gp[x, y] / 255.0              # 原图亮度：越暗越偏墨
            ink_mix = max(0.0, min(1.0, (0.62 - t) / 0.62))
            col = tuple(int(BRASS[i] + (INK[i] - BRASS[i]) * ink_mix) for i in range(3))
            op[x, y] = tuple(int(PAPER[i] + (col[i] - PAPER[i]) * cov) for i in range(3))
    return out


def main():
    ap = argparse.ArgumentParser(description="双色调网点图版")
    ap.add_argument("src")
    ap.add_argument("name")
    ap.add_argument("--cell", type=int, default=5,
                    help="网格边长（像素）。太细看不出是网点就退回成照片，"
                         "太粗会碎。按显示宽度试出来再定")
    ap.add_argument("--angle", type=float, default=15)
    ap.add_argument("--out-width", type=int, default=1280)
    ap.add_argument("--colors", type=int, default=8, help="量化色数，用于压体积")
    ap.add_argument("--contact", action="store_true", help="额外输出 200%% 放大自查图（argparse 会把 %% 当格式符，必须转义）")
    args = ap.parse_args()

    if not os.path.exists(args.src):
        sys.exit("找不到源文件: " + args.src)
    os.makedirs(OUT_DIR, exist_ok=True)

    im = Image.open(args.src).convert("RGB")
    w = args.out_width
    im = im.resize((w, round(w * im.height / im.width)), Image.LANCZOS)

    g0 = im.convert("L")
    gray = g0.point(press_lut(g0))
    dots = halftone(gray, args.cell, args.angle)
    plate = duotone(dots, gray)

    # 量化到极少的色数：三种墨之间的过渡色不需要 24 位
    plate = plate.quantize(colors=args.colors, method=Image.MEDIANCUT).convert("P")
    fp = os.path.join(OUT_DIR, args.name + ".png")
    plate.save(fp, "PNG", optimize=True)
    kb = os.path.getsize(fp) / 1024
    print("%-12s %dx%d  cell=%d  %.0fKB  %s"
          % (args.name, w, plate.height, args.cell, kb,
             "← 超 60KB，加大 --cell 或降 --out-width" if kb > 60 else "ok"))

    if args.contact:
        os.makedirs(SHOT_DIR, exist_ok=True)
        rgb = plate.convert("RGB")
        box = (w // 3, plate.height // 3, w // 3 + 240, plate.height // 3 + 150)
        rgb.crop(box).resize((480, 300), Image.NEAREST) \
            .save(os.path.join(SHOT_DIR, args.name + "-zoom.png"))
        cols = sorted(rgb.getcolors(1 << 20), reverse=True)[:6]
        print("  用色 %d 种，前几位：%s"
              % (len(rgb.getcolors(1 << 20)),
                 " ".join("#%02X%02X%02X" % c[1] for c in cols)))
        print("  放大自查图 .shots/%s-zoom.png（200%%，网点应清晰可数）" % args.name)


if __name__ == "__main__":
    main()
