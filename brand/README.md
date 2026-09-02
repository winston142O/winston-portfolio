# Brand assets

Every image here is rendered from the HTML next to it with headless Chrome, so
the source of truth is the markup, not the PNG. Edit the HTML, re-run the
command, commit the result.

## Files

| Source | Output | Used for |
|---|---|---|
| `logo-final.html` | `winston-pichardo-logo-on-{light,dark}.png` | the personal mark; `?v=dark` switches to white ink |
| `linkedin-banner.html` | `linkedin-banner{,@2x}.png` | LinkedIn profile banner, 1584×396 |
| `thumb.html` | `wp-thumb-1024.png` | square mark, 1024×1024 |
| `thumb-wide.html` | `wp-thumb-wide.png` | LinkedIn Featured link card, 1200×627 |


## Rendering

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# logos: transparent background, 3x for print
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=3 \
  --default-background-color=00000000 --window-size=760,520 --virtual-time-budget=8000 \
  --screenshot="winston-pichardo-logo-on-light.png" "file://$PWD/logo-final.html"

# add ?v=dark for the white-ink version
```

Fonts load from Google Fonts, so rendering needs a network connection.
`--virtual-time-budget` must stay generous or the screenshot fires before the
webfont lands and Chrome falls back to Helvetica.

## Specs

- Emerald `#10b981`, ink `#0b0d0c`, sampled from `src/app/icon.png`
- Geist (800 for the mark and name, 500 for the tagline), Geist Mono 700 for the URL
- Logos are named for the background they sit on, not the colour of their ink
- Minimum print width 7 cm; below that the tagline and URL break down
