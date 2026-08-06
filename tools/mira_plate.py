#!/usr/bin/env python3
"""Mira 肖像：美颜 + 立体明暗 → 富色网点图版。

相对通用 --rich：先磨皮/颧骨高光/右颊阴影，再按原图明暗
（左亮右暗，Δ≈123）打网点，亮部留肤色、暗部沉下去。
"""
import math
import os
import sys

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
import plate as P  # noqa: E402

SRC = os.path.join(ROOT, "art-src", "team", "mira-top.png")
BEAUTY = os.path.join(ROOT, "art-src", "team", "mira-beauty.png")
OUT = os.path.join(ROOT, "assets", "plates", "pl-mira.png")


def beauty_sculpt(src: Image.Image) -> Image.Image:
    w, h = src.size
    blur = src.filter(ImageFilter.GaussianBlur(1.8))
    edges = (
        src.convert("L")
        .filter(ImageFilter.FIND_EDGES)
        .point(lambda v: min(255, v * 3))
        .filter(ImageFilter.GaussianBlur(1.0))
    )
    ep, sp, bp = edges.load(), src.load(), blur.load()
    beauty = Image.new("RGB", (w, h))
    op = beauty.load()
    for y in range(h):
        for x in range(w):
            r, g, b = sp[x, y]
            e = ep[x, y] / 255.0
            skin = r > 90 and g > 60 and r >= g >= b * 0.85 and (r - b) > 15 and r < 245
            t = (0.40 if skin else 0.0) * (1 - min(1.0, e * 1.5))
            br, bg, bb = bp[x, y]
            op[x, y] = (
                int(r + (br - r) * t),
                int(g + (bg - g) * t),
                int(b + (bb - b) * t),
            )
    beauty = ImageChops.blend(
        beauty, beauty.filter(ImageFilter.UnsharpMask(3.2, 100, 4)), 0.35
    )

    face = Image.new("L", (w, h), 0)
    ImageDraw.Draw(face).ellipse(
        [int(w * 0.30), int(h * 0.10), int(w * 0.70), int(h * 0.58)], fill=255
    )
    face = face.filter(ImageFilter.GaussianBlur(30))
    mp, sp2 = face.load(), beauty.load()
    out = Image.new("RGB", (w, h))
    outp = out.load()
    cx, cy = w * 0.48, h * 0.36
    for y in range(h):
        for x in range(w):
            r, g, b = sp2[x, y]
            m = mp[x, y] / 255.0
            if m > 0.02:
                dx = (x - cx) / (w * 0.22)
                lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
                amt = (-dx * 0.11 + (lum - 0.48) * 0.20) * m
                if amt >= 0:
                    amt *= 0.55
                    r = int(r + (240 - r) * amt)
                    g = int(g + (230 - g) * amt)
                    b = int(b + (215 - b) * amt)
                else:
                    r = int(r * (1 + amt))
                    g = int(g * (1 + amt))
                    b = int(b * (1 + amt))
                d1 = math.hypot(x - w * 0.39, y - h * 0.39) / (w * 0.08)
                if d1 < 1.1:
                    gl = (1 - d1 / 1.1) ** 2 * 0.06 * m
                    r = int(r + (235 - r) * gl)
                    g = int(g + (220 - g) * gl)
                    b = int(b + (205 - b) * gl)
                d2 = math.hypot(x - w * 0.60, y - h * 0.43) / (w * 0.10)
                if d2 < 1.05:
                    sh = (1 - d2 / 1.05) ** 2 * 0.15 * m
                    r = int(r * (1 - sh))
                    g = int(g * (1 - sh * 0.95))
                    b = int(b * (1 - sh * 0.9))
                if abs(x - w * 0.485) < w * 0.015 and h * 0.33 < y < h * 0.47:
                    ny = max(0, 1 - abs((y - h * 0.40) / (h * 0.07)))
                    g2 = ny * ny * 0.05 * m
                    r = int(r + (240 - r) * g2)
                    g = int(g + (228 - g) * g2)
                    b = int(b + (212 - b) * g2)
                if h * 0.50 < y < h * 0.60 and w * 0.35 < x < w * 0.68:
                    jaw = ((y - h * 0.50) / (h * 0.10)) * 0.06 * m
                    r = int(r * (1 - jaw))
                    g = int(g * (1 - jaw))
                    b = int(b * (1 - jaw))
            outp[x, y] = (
                max(0, min(255, r)),
                max(0, min(255, g)),
                max(0, min(255, b)),
            )
    out = ImageEnhance.Contrast(out).enhance(1.05)
    out = ImageEnhance.Color(out).enhance(1.05)
    out = ImageEnhance.Sharpness(out).enhance(1.1)
    return out


def to_plate(sculpt: Image.Image, width=560, cell=3, colors=12) -> Image.Image:
    im = sculpt.resize((width, round(width * sculpt.height / sculpt.width)), Image.LANCZOS)
    im = ImageEnhance.Color(im).enhance(1.03)
    im = ImageEnhance.Contrast(im).enhance(1.06)

    def soft(p):
        return 208 + int((p - 225) * 0.25) if p > 225 else p

    im = Image.merge("RGB", [c.point(soft) for c in im.split()])
    g0 = im.convert("L")
    gray = g0.point(P.press_lut(g0))
    dots = P.halftone(gray, cell, 15)
    rgb, dp, gp, graw = im.load(), dots.load(), gray.load(), g0.load()
    out = Image.new("RGB", im.size, P.PAPER)
    op = out.load()
    for y in range(im.height):
        for x in range(im.width):
            cov = 1 - dp[x, y] / 255.0
            r0, g0c, b0 = rgb[x, y]
            raw = graw[x, y] / 255.0
            delta = (
                abs(r0 - P.PAPER[0]) + abs(g0c - P.PAPER[1]) + abs(b0 - P.PAPER[2])
            ) / 765.0
            if raw >= 0.68:
                a = min(0.58, max(cov * 0.75, 0.42 + delta * 0.12))
            elif raw <= 0.40:
                a = min(0.88, max(cov * 1.05, 0.45 + delta * 0.7))
            else:
                a = min(1.0, max(cov, delta * 0.55) + cov * 0.2)
            if a < 0.03:
                continue
            t = gp[x, y] / 255.0
            r, g, b = r0, g0c, b0
            ink_w = max(0.0, min(1.0, (0.36 - t) / 0.36)) * (
                0.18 if raw > 0.45 else 0.22
            )
            r = int(r + (P.INK[0] - r) * ink_w)
            g = int(g + (P.INK[1] - g) * ink_w)
            b = int(b + (P.INK[2] - b) * ink_w)
            brass_w = max(0.0, (1 - abs(t - 0.52) * 2)) * 0.03
            r = int(r + (P.BRASS[0] - r) * brass_w)
            g = int(g + (P.BRASS[1] - g) * brass_w)
            b = int(b + (P.BRASS[2] - b) * brass_w)
            op[x, y] = (
                int(P.PAPER[0] + (r - P.PAPER[0]) * a),
                int(P.PAPER[1] + (g - P.PAPER[1]) * a),
                int(P.PAPER[2] + (b - P.PAPER[2]) * a),
            )
    return out.quantize(colors=colors, method=Image.MEDIANCUT).convert("P")


def main():
    src = Image.open(SRC).convert("RGB")
    sculpt = beauty_sculpt(src)
    sculpt.save(BEAUTY, optimize=True)
    pl = to_plate(sculpt)
    pl.save(OUT, "PNG", optimize=True)
    kb = os.path.getsize(OUT) / 1024
    rgb = pl.convert("RGB")
    def L(fx, fy):
        return rgb.convert("L").getpixel((int(560 * fx), int(560 * fy)))
    print(
        "pl-mira %dx%d  %.0fKB  cheek Δ=%d (目标≈123)"
        % (pl.width, pl.height, kb, L(0.38, 0.42) - L(0.62, 0.42))
    )


if __name__ == "__main__":
    main()
