# Chip In — logo kit

The mark is a receipt slip with a torn top and bottom edge, tilted slightly, with
a part-filled progress bar across it. Paper and progress: the whole product in
one shape. It sits on a near-black tile.

The wordmark is Archivo Black, **converted to outlines** — there is no live text
in these files, so they render identically everywhere with no font to load. That
matters for favicons and for social previews, where web fonts don't exist.

## Colors

```
black   #0F0E12    near-black with a whisper of purple in it
lilac   #C3B1FF    the light purple — the accent, on black
grape   #6D4AF6    same hue, deeper — the accent on light backgrounds
slip    #F7F5FC    the receipt paper, cooled slightly
track   #DCD6EC    the unfilled part of a progress bar
```

Lilac on white is too faint to read, so the accent has two tints of one hue.
Use lilac on anything black, grape on anything light. Never mix them in the
same lockup.

## Files

| File | Use it for |
| --- | --- |
| `logo-lockup.svg` | the main logo, on light backgrounds |
| `logo-lockup-dark.svg` | the main logo, on black backgrounds (no tile — a black tile on black is invisible) |
| `logo-mark.svg` | the square app icon / avatar |
| `logo-mark-512.svg` | same, sized for app icons and stores |
| `favicon.svg` | browser tab. Detail is stripped to the bar — at 16px nothing else survives |
| `logo-wordmark.svg` | text only, light backgrounds |
| `logo-wordmark-dark.svg` | text only, black backgrounds |
| `*.png` | raster copies, for anywhere SVG isn't accepted |

## Pasting it into Lovable

Lovable takes SVG source directly. Open the file, copy everything, and paste it
into the chat with a message like:

```
Use this as the logo. Put the lockup in the top bar at 28px tall, and use the
square mark as the favicon. Add the two brand colors to the theme: black
#0F0E12 and light purple #C3B1FF, with #6D4AF6 as the deeper tint of the same
purple for use on light backgrounds. Don't recolor or redraw the logo — paste
the SVG in as-is.

[paste logo-lockup-dark.svg here]
```

Say **"don't redraw it"** explicitly. Left to itself an AI builder will helpfully
rebuild your logo as an emoji in a circle.

## Rules

- Give it clear space of at least the height of the tile on every side.
- Never stretch it. Scale both dimensions together.
- Never put the light-background version on a photo or a mid-tone color — use
  the dark lockup on a solid black block instead.
- Never re-typeset the wordmark in another font. The outlines are the logo.
- The tilt is -8 degrees. Don't straighten it and don't increase it.
