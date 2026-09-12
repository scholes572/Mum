# For You, Mum 🌷

A birthday letter in web form — rebuilt as one continuous, colorful **scene journey** (no segmented sections), powered by GSAP.

## The journey

1. **Mega opening** — giant HAPPY / BIRTHDAY / *Mum* typography with gradient words, floating balloons, name plate
2. **"with love" ribbon** — tilted marquee band sweeping across
3. **Carrying** — flowing serif statements, word by word
4. **"you just kept going."** — words burst into place one by one
5. **Two voices** — honesty note and the China note fly in from opposite sides
6. **Your gifts** — numbered ledger rows sliding in alternately
7. **"your lessons live in me" ribbon** — second marquee, gold
8. **Word garden** — colorful lesson pills popping in like balloons
9. **The cake** 🎂 — a hand-drawn SVG three-tier cake with flickering candle flames. **Tap it to blow the candles out** — flames stretch, smoke rises, confetti bursts, and the birthday wish reveals
10. **The Little Moments** — polaroid piles that fan apart, a pinned horizontal strip, and a masonry grid with lightbox
11. **Unsaid words** — phrases snap into place like magnets
12. **Night sky prayer** — deep plum/teal sky, 90 twinkling stars, drifting moon
13. **The letter** — the thank-you list, the quote, and "I love you, Mum." with a heart burst

Plus: preloader curtain, Lenis smooth scrolling, custom cursor, reading progress bar, floating petals, and tap-anywhere sparkles.

## Stack

- **GSAP 3** + ScrollTrigger + ScrollTo (CDN)
- **Lenis** smooth scroll (CDN)
- Pure HTML/CSS/JS — no build step

Degrades gracefully: without JS the `.no-anim` CSS fallbacks show the full letter; `prefers-reduced-motion` disables animation.

## Run locally

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

## Publish on GitHub Pages

1. Push to GitHub.
2. **Settings → Pages** → *Deploy from a branch* → `main` / `(root)` → Save.
3. Live at `https://<your-username>.github.io/<repo-name>/`.

## Structure

```
├── index.html   # the journey: 13 scenes
├── style.css    # jewel-tone design system
├── script.js    # GSAP choreography + cake + galleries
├── assets/      # the ten photos
└── .nojekyll
```

## Editing

- **Photos** — edit the `PHOTOS` list at the top of `script.js` (caption + group).
- **Words** — each scene lives in `index.html`.
- **Colors** — the whole palette is CSS variables at the top of `style.css`.

— Made with love, by her son.
# happy-birthday
