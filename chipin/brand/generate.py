"""Generate the Chip In logo set. Wordmark is outlined from real Archivo Black."""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform
import pathlib

FONT = "/home/user/Martoun/chipin/.next/static/media/5e4d537aaa9e154b-s.p.1ewykk74tw0il.woff2"
OUT = pathlib.Path("/home/user/Martoun/chipin/brand")
OUT.mkdir(exist_ok=True)

BLACK = "#0F0E12"   # near-black, a whisper of purple in it
LILAC = "#C3B1FF"   # the light purple — the accent, for use on black
GRAPE = "#6D4AF6"   # deeper tint, for the accent on light backgrounds
SLIP = "#F7F5FC"    # the paper of the receipt, cooled slightly
TRACK = "#DCD6EC"   # unfilled part of the progress bar

f = TTFont(FONT)
upm = f["head"].unitsPerEm
cmap = f.getBestCmap()
gs = f.getGlyphSet()
hmtx = f["hmtx"]
CAPH = f["OS/2"].sCapHeight


def outline(text, cap_px, x0=0.0, tracking=0.0):
    """Outline text at the given cap height. Returns (path_d, end_x). Baseline at y=0."""
    size = cap_px * upm / CAPH
    scale = size / upm
    x = x0
    d = []
    for ch in text:
        gname = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[gname].draw(TransformPen(pen, Transform(scale, 0, 0, -scale, x, 0)))
        d.append(pen.getCommands())
        x += hmtx[gname][0] * scale + tracking
    return " ".join(d), x


def slip(x, y, w, h, notches=5, detail="full", rot=-8, bar=LILAC):
    """A receipt slip: torn top and bottom edges, line items, a progress bar."""
    seg = w / notches
    p = [f"M {x} {y}"]
    for _ in range(notches):                      # top edge, notches bite downward
        p.append(f"a {seg/2} {seg/2} 0 0 0 {seg} 0")
    p.append(f"L {x + w} {y + h}")
    for _ in range(notches):                      # bottom edge, right to left
        p.append(f"a {seg/2} {seg/2} 0 0 0 {-seg} 0")
    p.append("Z")
    body = f'<path d="{" ".join(p)}" fill="{SLIP}"/>'

    pad = w * 0.17
    iw = w - pad * 2
    inner = ""
    if detail == "full":
        inner += (
            f'<rect x="{x+pad}" y="{y+h*0.30}" width="{iw*0.72}" height="{h*0.055}" fill="{TRACK}"/>'
            f'<rect x="{x+pad}" y="{y+h*0.44}" width="{iw*0.46}" height="{h*0.055}" fill="{TRACK}"/>'
        )
    if detail in ("full", "bar"):
        # the progress bar. At favicon sizes this is the only thing that survives,
        # so when it's alone it sits centred and runs heavier.
        by = y + (h * 0.63 if detail == "full" else h * 0.44)
        bh = h * (0.11 if detail == "full" else 0.16)
        inner += (
            f'<rect x="{x+pad}" y="{by}" width="{iw}" height="{bh}" fill="{TRACK}"/>'
            f'<rect x="{x+pad}" y="{by}" width="{iw*0.62}" height="{bh}" fill="{bar}"/>'
        )
    cx, cy = x + w / 2, y + h / 2
    return f'<g transform="rotate({rot} {cx} {cy})">{body}{inner}</g>'


def mark(size=64, tile=BLACK, detail="full", scale=1.14):
    s = size
    w, h = s * 0.50 * scale, s * 0.66 * scale
    x, y = (s - w) / 2, (s - h) / 2
    tile_el = f'<rect width="{s}" height="{s}" rx="{s*0.07}" fill="{tile}"/>' if tile else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {s} {s}" width="{s}" height="{s}">'
        f'{tile_el}{slip(x, y, w, h, notches=5, detail=detail)}</svg>'
    )


def wordmark(cap=40, chip=BLACK, accent=GRAPE):
    tr = -cap * 0.02
    d1, x1 = outline("CHIP", cap, 0, tr)
    d2, x2 = outline("IN", cap, x1, tr)
    w = x2 - tr
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.1f} {cap:.1f}" '
        f'width="{w:.1f}" height="{cap:.1f}"><g transform="translate(0 {cap:.1f})">'
        f'<path d="{d1}" fill="{chip}"/><path d="{d2}" fill="{accent}"/></g></svg>'
    )


def lockup(chip=BLACK, accent=GRAPE, tile=BLACK):
    cap, m, gap = 40, 60, 18
    tr = -cap * 0.02
    d1, x1 = outline("CHIP", cap, 0, tr)
    d2, x2 = outline("IN", cap, x1, tr)
    W, H = m + gap + (x2 - tr), m
    baseline = (H + cap) / 2
    w, h = m * 0.50, m * 0.66
    x, y = (m - w) / 2, (m - h) / 2
    tile_el = f'<rect width="{m}" height="{m}" rx="{m*0.07}" fill="{tile}"/>' if tile else ""
    # With no tile (on a dark page) the slip stands alone and can run larger.
    sw, sh = (w, h) if tile else (m * 0.60, m * 0.80)
    sx, sy = (m - sw) / 2, (m - sh) / 2
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.1f} {H:.1f}" '
        f'width="{W:.1f}" height="{H:.1f}">{tile_el}'
        f'{slip(sx, sy, sw, sh, notches=5)}'
        f'<g transform="translate({m+gap:.1f} {baseline:.1f})">'
        f'<path d="{d1}" fill="{chip}"/><path d="{d2}" fill="{accent}"/></g></svg>'
    )


files = {
    # the mark: black tile, paper slip, light purple progress bar
    "logo-mark.svg": mark(64),
    "logo-mark-512.svg": mark(512),
    # favicon: only the progress bar survives at 16px, so that's all it keeps
    "favicon.svg": mark(32, detail="bar", scale=1.5),
    # wordmarks
    "logo-wordmark.svg": wordmark(),
    "logo-wordmark-dark.svg": wordmark(chip=SLIP, accent=LILAC),
    # lockups: tile on light pages, no tile on dark ones (a black tile would vanish)
    "logo-lockup.svg": lockup(),
    "logo-lockup-dark.svg": lockup(chip=SLIP, accent=LILAC, tile=None),
}
for name, svg in files.items():
    (OUT / name).write_text(svg + "\n")
    print(name, len(svg), "bytes")
