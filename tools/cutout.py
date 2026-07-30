#!/usr/bin/env python3
"""
引力坊 v4 前景抠图工具：平底出图 → 带 alpha 的 WebP。

为什么不从成品章节大图里抠：明暗对照画整幅都暗（实测 position.webp 各区域
暗于 40 的像素占比 75%–93%），亮度键完全分不开前景与背景，本机也没有分割模型。
所以前景道具单独出图——浅底、无投影——再用亮度阈值键出来。

用法：
    python3 tools/cutout.py <源文件> <目标名> [--thresh 210] [--feather 1.5]
                            [--out-width 1200] [--report]

例：
    python3 tools/cutout.py art-src/fg-position.jpg fg-position --report

输出：
    assets/art/<目标名>.webp        带 alpha 的前景层
    .shots/<目标名>-edge.png        --report 时输出的边缘放大自查图

自查（--report）会给出：
    · 键出后主体占画面比例（太小说明阈值过紧）
    · 半透明过渡带宽度（1–2px 为佳，0 说明没羽化、>3 说明发虚）
    · 边缘残色：贴边一圈像素与背景色的距离（大 = 有白边，需要收 despill）
"""
import argparse
import os
import sys

from PIL import Image, ImageChops, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "assets", "art")
SHOT_DIR = os.path.join(ROOT, ".shots")


def estimate_bg(im):
    """取四角各 24px 方块的中位亮度，作为平底色的估计值。"""
    w, h = im.size
    g = im.convert("L")
    vals = []
    for bx, by in ((0, 0), (w - 24, 0), (0, h - 24), (w - 24, h - 24)):
        for y in range(by, by + 24, 3):
            for x in range(bx, bx + 24, 3):
                vals.append(g.getpixel((x, y)))
    vals.sort()
    return vals[len(vals) // 2]


def build_alpha(im, thresh, feather):
    """浅底 → alpha：从画框边缘泛洪求背景，未被淹到的即主体。

    为什么不用全局阈值：主体同时含极浅（纸张高光 ~200）和极深（轮廓 ~80）部分，
    又落在浅底（~247）上。阈值调紧会在浅色区打洞，调松会把 AI 画的投影
    （~200-235）一起吃进来。实测两种失败都出现过。

    泛洪利用了一个事实：主体轮廓一圈是暗的。从边框放水、只走亮于 gate 的像素，
    水进不到主体内部（被暗轮廓挡住），于是浅色区自动保住；而投影与边框连通
    且比轮廓浅，会被一并淹掉。
    """
    g = im.convert("L")
    W, H = g.size
    # 半分辨率跑 BFS，够用且快得多；边缘反正要羽化
    sw, sh = W // 2, H // 2
    small = g.resize((sw, sh), Image.BILINEAR)
    px = small.load()
    gate = thresh          # 亮于此值才算“可淹的背景”

    reached = bytearray(sw * sh)
    from collections import deque
    q = deque()
    for x in range(sw):
        for y in (0, sh - 1):
            if px[x, y] >= gate and not reached[y * sw + x]:
                reached[y * sw + x] = 1; q.append((x, y))
    for y in range(sh):
        for x in (0, sw - 1):
            if px[x, y] >= gate and not reached[y * sw + x]:
                reached[y * sw + x] = 1; q.append((x, y))
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < sw and 0 <= ny < sh:
                i = ny * sw + nx
                if not reached[i] and px[nx, ny] >= gate:
                    reached[i] = 1; q.append((nx, ny))

    mask = Image.frombytes("L", (sw, sh), bytes(255 if v else 0 for v in reached))
    a = mask.resize((W, H), Image.BILINEAR).point(lambda v: 0 if v > 127 else 255)
    # 中值滤波清掉泛洪留下的孤立小点，再羽化边缘
    a = a.filter(ImageFilter.MedianFilter(3))
    if feather > 0:
        a = a.filter(ImageFilter.GaussianBlur(feather))
        # 羽化会把边缘拉成长长的斜坡，用一次对比拉伸收窄成 1–2px 过渡带
        a = a.point(lambda v: 0 if v < 40 else (255 if v > 215 else int((v - 40) * 255 / 175)))
    return a


def despill(im, alpha, bg_lum):
    """去边缘残色：把半透明带里的像素往主体的暗侧压，消掉浅底渗出的白边。"""
    px = im.convert("RGB").copy()
    ap = alpha.load()
    pp = px.load()
    w, h = px.size
    for y in range(h):
        for x in range(w):
            a = ap[x, y]
            if 0 < a < 255:
                # 越透明说明混入的底色越多，按比例把亮度往下拉
                k = a / 255.0
                r, g, b = pp[x, y]
                pp[x, y] = (int(r * k), int(g * k), int(b * k))
    return px


def trim_transparent(rgb, alpha, keep=2):
    """裁掉四周的透明边距，让元素盒 == 道具本体。

    不裁的话画布上那圈空气也算进 getBoundingClientRect()，
    定位时"交叠 33%"里有一部分其实是透明区，遮挡量会虚高；
    顺带白占体积。keep 留几像素余量，避免削到羽化带。
    """
    bbox = alpha.getbbox()
    if not bbox:
        return rgb, alpha
    l, t, r, b = bbox
    l = max(0, l - keep); t = max(0, t - keep)
    r = min(alpha.width, r + keep); b = min(alpha.height, b + keep)
    return rgb.crop((l, t, r, b)), alpha.crop((l, t, r, b))


def edge_report(alpha, rgb, bg_lum, name):
    """输出边缘自查数据，并存一张放大 200% 的边缘图。"""
    w, h = alpha.size
    ap = alpha.load()
    solid = semi = 0
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            a = ap[x, y]
            if a > 250:
                solid += 1
            elif a > 5:
                semi += 1
    total = (w // 2) * (h // 2)
    print("  主体占比      %.3f" % (solid / total))
    print("  半透明带占比   %.4f  %s" % (
        semi / total,
        "（偏大，边缘发虚）" if semi / total > 0.02 else
        "（为 0，没羽化）" if semi == 0 else "ok"))

    # 沿 alpha 边界取样，看贴边像素是否残留浅底
    pp = rgb.load()
    lum = []
    for y in range(1, h - 1, 3):
        for x in range(1, w - 1, 3):
            if ap[x, y] > 250 and min(ap[x - 1, y], ap[x + 1, y],
                                      ap[x, y - 1], ap[x, y + 1]) < 200:
                r, g, b = pp[x, y]
                lum.append((r * 299 + g * 587 + b * 114) // 1000)
    if lum:
        lum.sort()
        p95 = lum[int(len(lum) * .95)]
        print("  贴边亮度 p95   %3d  (平底 %3d)  %s" % (
            p95, bg_lum,
            "← 有白边，调低 --thresh 或加大 despill" if p95 > bg_lum - 30 else "ok"))

    os.makedirs(SHOT_DIR, exist_ok=True)
    # 取主体最左的边缘一块放大 200%，肉眼复核
    box = (0, h // 3, min(w, 260), h // 3 + 180)
    crop = Image.merge("RGBA", (*rgb.split(), alpha)).crop(box)
    flat = Image.new("RGB", crop.size, (255, 0, 255))   # 洋红衬底，白边一眼可见
    flat.paste(crop, (0, 0), crop)
    flat.resize((crop.width * 2, crop.height * 2), Image.NEAREST) \
        .save(os.path.join(SHOT_DIR, name + "-edge.png"))
    print("  边缘自查图     .shots/%s-edge.png （洋红衬底，白边一眼可见）" % name)


def main():
    ap = argparse.ArgumentParser(description="平底前景抠图 → 带 alpha 的 WebP")
    ap.add_argument("src")
    ap.add_argument("name")
    ap.add_argument("--thresh", type=int, default=None,
                    help="亮于此值判为背景。默认按四角平底色自动取 平底-38")
    ap.add_argument("--feather", type=float, default=1.5)
    ap.add_argument("--inset", type=float, default=0.02,
                    help="键出前先内缩裁掉边框一圈（比例）。出图常带暗角，"
                         "那一圈会暗于阈值而被判成主体，把主体和画框连通，"
                         "透明边距就裁不掉了。默认 0.02，暗角重的图给 0.05")
    ap.add_argument("--no-trim", action="store_true",
                    help="不裁透明边距。默认会裁——否则画布上那圈空气也算进元素盒，"
                         "定位时遮挡量会虚高")
    ap.add_argument("--out-width", type=int, default=1200)
    ap.add_argument("--quality", type=int, default=82)
    ap.add_argument("--report", action="store_true")
    args = ap.parse_args()

    if not os.path.exists(args.src):
        sys.exit("找不到源文件: " + args.src)
    os.makedirs(OUT_DIR, exist_ok=True)

    im = Image.open(args.src).convert("RGB")
    if args.inset > 0:
        ix, iy = int(im.width * args.inset), int(im.height * args.inset)
        im = im.crop((ix, iy, im.width - ix, im.height - iy))
    bg = estimate_bg(im)
    thresh = args.thresh if args.thresh is not None else max(60, bg - 38)
    print("%s  平底亮度 %d  阈值 %d" % (args.name, bg, thresh))

    alpha = build_alpha(im, thresh, args.feather)
    rgb = despill(im, alpha, bg)
    if not args.no_trim:
        before = rgb.size
        rgb, alpha = trim_transparent(rgb, alpha)
        print("  裁透明边距  %dx%d -> %dx%d" % (before + rgb.size))

    out = Image.merge("RGBA", (*rgb.split(), alpha))
    w = args.out_width
    out = out.resize((w, round(w * out.height / out.width)), Image.LANCZOS)
    # 缩放会让 alpha 边缘重新变软，再收一次
    r, g, b, a = out.split()
    a = a.point(lambda v: 0 if v < 30 else (255 if v > 225 else int((v - 30) * 255 / 195)))
    out = Image.merge("RGBA", (r, g, b, a))

    fp = os.path.join(OUT_DIR, args.name + ".webp")
    out.save(fp, "WEBP", quality=args.quality, method=6, exact=True)
    print("  %dx%d -> %dKB" % (out.width, out.height, os.path.getsize(fp) // 1024))

    if args.report:
        edge_report(a, Image.merge("RGB", (r, g, b)), bg, args.name)


if __name__ == "__main__":
    main()
