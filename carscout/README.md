# UA → IE Car Scout — Design Archive

**Find cars in Ukraine. Calculate real import cost to Ireland.**

---

## Project Structure

```
carscout/
├── index.html          ← Search page (main)
├── calc.html           ← Import cost calculator
├── favs.html           ← Saved listings / favourites
│
├── css/
│   ├── tokens.css      ← Design tokens: colors, typography, spacing, shadows
│   ├── base.css        ← CSS reset + base typography
│   ├── components.css  ← All UI components (navbar, buttons, cards, inputs…)
│   └── layout.css      ← Page layouts and responsive grid
│
├── js/
│   └── app.js          ← App logic: tabs, checkboxes, calculator, favourites
│
└── assets/
    └── icons/
        ├── logo.svg            ← Square icon (48×48)
        └── logo-horizontal.svg ← Wordmark with tagline (280×44)
```

---

## Design System

### Fonts
- **Display**: DM Serif Display (italic headings)
- **Body / UI**: DM Sans (300/400/500/600)
- Loaded from Google Fonts

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--brand-accent` | `#2563EB` | CTA buttons, links, active states |
| `--brand-midnight` | `#0A0E1A` | Logo background, dark surfaces |
| `--brand-ukraine` | `#3B82F6` | UA source badges |
| `--brand-ireland` | `#16A34A` | IE source badges |
| `--color-bg-page` | `#F8FAFC` | Page background |
| `--color-bg-surface` | `#FFFFFF` | Cards, inputs |

Full token list in `css/tokens.css`.

### Key Components
- **`.navbar`** — sticky, frosted glass (backdrop-filter)
- **`.btn` + variants** — `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-sm`, `.btn-lg`
- **`.card`**, **`.car-card`** — listing cards with hover lift
- **`.checkbox-wrapper`** — source toggle pills with animated checkmark
- **`.search-bar`** — keyword search with focus ring
- **`.calc-form`** — live import cost calculator
- **`.badge`**, **`.pill-btn`** — tags and quick-pick filters
- **`.alert`** — info/success/warning notices
- **`.cost-table`** — breakdown table with semantic row colors

---

## Import Calculator Logic

| Tax | Rate | Notes |
|-----|------|-------|
| VRT | 14% classic / 21.5% old / 25% modern | Applied to OMSP (car price proxy) |
| Customs | 6.5% | **Exempt** for 30+ year classics from Ukraine |
| VAT | 23% | Applied to (price + shipping + customs) |
| NOx | varies | €0 for pre-emissions classics |

**Classic = 30+ years old** from registration year.

---

## Usage

1. Open `index.html` in any modern browser (no build step required)
2. All CSS is modular — import only what you need
3. For a framework project, convert CSS custom properties to your design token system
4. The calculator logic in `js/app.js` is self-contained and framework-agnostic

---

## Inspiration
- **Apple** — clean surfaces, generous whitespace, precise typography
- **Midjourney** — atmospheric minimal tone, dark accents
- **Auto Trader / Mobile.de** — car listing card patterns, filter UX

*Built for Eddie's Toyota hunt ☘️*
