#!/usr/bin/env python3
"""Wilson 肖像：去冷蓝 + 匹配 Mira/Sarah 中间调统计 → 富色网点图版。

避免偏金黄：色相/饱和对齐另两位，亮部额外去黄。
"""
import os
import sys

from PIL import Image, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
import plate as P  # noqa: E402

SRC = os.path.join(ROOT, "art-src", "team", "wilson.png")
WARM = os.path.join(ROOT, "art-src", "team", "wilson-warm.png")
OUT = os.path.join(ROOT, "assets", "plates", "pl-wilson.png")
MIRA = os.path.join(ROOT, "assets", "plates", "pl-mira.png")
SARAH = os.path.join(ROOT, "assets", "plates", "pl-sarah.png")

PAPER = (251, 250, 247)
WARM_DARK = (36, 32, 30)


def midtone_stats(im: Image.Image):
    px = im.load()
    w, h = im.size
    rs, gs, bs = [], [], []
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            r, g, b = px[x, y]
            if abs(r - PAPER[0]) + abs(g - PAPER[1]) + abs(b - PAPER[2]) < 22:
                continue
            L = 0.2126 * r + 0.7152 * g + 0.0722 * b
            if 50 < L < 210:
                rs.append(r)
                gs.append(g)
                bs.append(b)

    def mean_std(a):
        m = sum(a) / len(a)
        v = (sum((x - m) ** 2 for x in a) / len(a)) ** 0.5
        return m, max(v, 8.0)

    return mean_std(rs), mean_std(gs), mean_std(bs)


def deblue(src: Image.Image) -> Image.Image:
    w, h = src.size
    px = src.load()
    out = Image.new("RGB", (w, h))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if abs(r - PAPER[0]) + abs(g - PAPER[1]) + abs(b - PAPER[2]) < 30:
                op[x, y] = (r, g, b)
                continue
            lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255.0
            cool = max(0.0, (b - r) / 50.0)
            if cool > 0.04 or (b >= r - 8 and lum < 0.42):
                t = min(1.0, cool * 1.1 + (0.4 if lum < 0.35 else 0.18))
                r = int(r + (WARM_DARK[0] - r) * t)
                g = int(g + (WARM_DARK[1] - g) * t)
                b = int(b + (WARM_DARK[2] - b) * t)
            if lum > 0.5 and g > b + 20:
                over = g - b - 15
                g = int(g - over * 0.4)
                b = min(255, int(b + over * 0.25))
            op[x, y] = (
                max(0, min(255, r)),
                max(0, min(255, g)),
                max(0, min(255, b)),
            )
    return out


def match_to_refs(src: Image.Image, mira: Image.Image, sarah: Image.Image) -> Image.Image:
    (mr, sr), (mg, sg), (mb, sb) = midtone_stats(mira)
    (sr_, ssr), (sg_, ssg), (sb_, ssb) = midtone_stats(sarah)
    tr, tsr = (mr + sr_) / 2, (sr + ssr) / 2
    tg, tsg = (mg + sg_) / 2, (sg + ssg) / 2
    tb, tsb = (mb + sb_) / 2, (sb + ssb) / 2
    (or_, osr), (og, osg), (ob, osb) = midtone_stats(src)

    w, h = src.size
    px = src.load()
    out = Image.new("RGB", (w, h))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if abs(r - PAPER[0]) + abs(g - PAPER[1]) + abs(b - PAPER[2]) < 25:
                op[x, y] = (r, g, b)
                continue
            r2 = tr + (r - or_) * (tsr / osr)
            g2 = tg + (g - og) * (tsg / osg)
            b2 = tb + (b - ob) * (tsb / osb)
            L = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255.0
            if L > 0.72:
                t = (L - 0.72) / 0.28 * 0.35
                r2 = r2 * (1 - t) + PAPER[0] * t
                g2 = g2 * (1 - t) + PAPER[1] * t
                b2 = b2 * (1 - t) + PAPER[2] * t
            op[x, y] = (
                int(max(0, min(255, r2))),
                int(max(0, min(255, g2))),
                int(max(0, min(255, b2))),
            )
    return ImageEnhance.Color(out).enhance(0.98)


def to_plate(im: Image.Image, width=560, cell=3, colors=12) -> Image.Image:
    im = im.resize((width, round(width * im.height / im.width)), Image.LANCZOS)
    im = ImageEnhance.Contrast(im).enhance(1.05)
    g0 = im.convert("L")
    gray = g0.point(P.press_lut(g0))
    dots = P.halftone(gray, cell, 15)
    rgb, dp, gp = im.load(), dots.load(), gray.load()
    out = Image.new("RGB", im.size, P.PAPER)
    op = out.load()
    for y in range(im.height):
        for x in range(im.width):
            cov = 1 - dp[x, y] / 255.0
            r0, g0c, b0 = rgb[x, y]
            delta = (
                abs(r0 - P.PAPER[0]) + abs(g0c - P.PAPER[1]) + abs(b0 - P.PAPER[2])
            ) / 765.0
            a = min(1.0, max(cov, min(0.72, delta * 1.55) * 0.62) + cov * 0.28)
            if a < 0.025:
                continue
            t = gp[x, y] / 255.0
            r, g, b = r0, g0c, b0
            ink_w = max(0.0, min(1.0, (0.38 - t) / 0.38)) * 0.20
            r = int(r + (P.INK[0] - r) * ink_w)
            g = int(g + (P.INK[1] - g) * ink_w)
            b = int(b + (P.INK[2] - b) * ink_w)
            brass_w = max(0.0, (1 - abs(t - 0.55) * 2)) * 0.03
            r = int(r + (P.BRASS[0] - r) * brass_w)
            g = int(g + (P.BRASS[1] - g) * brass_w)
            b = int(b + (P.BRASS[2] - b) * brass_w)
            if g > b + 15 and r > b + 10:
                shift = min(12, (g - b - 15) // 2)
                g -= shift
                b = min(255, b + shift)
            op[x, y] = (
                int(P.PAPER[0] + (r - P.PAPER[0]) * a),
                int(P.PAPER[1] + (g - P.PAPER[1]) * a),
                int(P.PAPER[2] + (b - P.PAPER[2]) * a),
            )
    return out.quantize(colors=colors, method=Image.MEDIANCUT).convert("P")


def main():
    mira = Image.open(MIRA).convert("RGB")
    sarah = Image.open(SARAH).convert("RGB")
    aligned = match_to_refs(deblue(Image.open(SRC).convert("RGB")), mira, sarah)
    aligned.save(WARM, optimize=True)
    pl = to_plate(aligned)
    pl.save(OUT, "PNG", optimize=True)
    print("pl-wilson %dx%d  %.0fKB" % (pl.width, pl.height, os.path.getsize(OUT) / 1024))


if __name__ == "__main__":
    main()
