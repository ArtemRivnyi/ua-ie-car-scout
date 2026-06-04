# 🚗 UA → IE Car Scout

Cross-border car price comparator: Ukraine listings vs Irish market, with full import cost calculator.

**Favourites focus:** Toyota 1980–1996 (AE86, Supra A60/A70, MR2 AW11, Celica, Corolla)  
**Supported languages:** English 🇮🇪 / Russian 🇺🇦  
**Stack:** React 18 + Vite, Node.js/Express backend, i18next, Tailwind CSS

---

## Project structure

```
ua-ie-car-scout/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx          # Car search + filter panel
│   │   ├── ListingCard.jsx        # Single listing card (UA source)
│   │   ├── PriceStats.jsx         # Min/avg/median/max display
│   │   ├── IrishMarketPanel.jsx   # Ireland prices (manual + scraped)
│   │   ├── ImportCalculator.jsx   # VRT / VAT / duty / shipping calc
│   │   ├── CompareBar.jsx         # UA vs IE visual price comparison
│   │   ├── FavouritesPanel.jsx    # Saved listings
│   │   ├── LanguageToggle.jsx     # EN / RU switcher
│   │   └── ToyotaQuickFilter.jsx  # Toyota 1980-96 model shortcuts
│   ├── services/
│   │   ├── autoRiaService.js      # AUTO.RIA public API wrapper
│   │   ├── olxService.js          # OLX scraper (Puppeteer via backend)
│   │   ├── irishMarketService.js  # DoneDeal / CarsIreland scraper
│   │   ├── priceService.js        # Stats calculation (min/avg/median/max)
│   │   └── importCalcService.js   # VRT, VAT, customs, NOx logic
│   ├── scrapers/                  # Backend-only Node scrapers
│   │   ├── donedeal.js
│   │   ├── carsireland.js
│   │   └── olxPuppeteer.js
│   ├── hooks/
│   │   ├── useListings.js         # Fetch + cache UA listings
│   │   ├── useIrishPrices.js      # Fetch IE market prices
│   │   └── useImportCalc.js       # Reactive calculator state
│   ├── i18n/
│   │   ├── index.js               # i18next setup
│   │   ├── en.json                # English strings
│   │   └── ru.json                # Russian strings
│   ├── utils/
│   │   ├── formatCurrency.js
│   │   ├── vrtRates.js            # Revenue.ie VRT rate tables
│   │   └── toyotaModels.js        # Toyota 1980-96 model catalogue
│   ├── App.jsx
│   └── main.jsx
├── server/
│   ├── index.js                   # Express API server
│   ├── routes/
│   │   ├── listings.js            # GET /api/listings
│   │   ├── irishPrices.js         # GET /api/irish-prices
│   │   └── calc.js                # POST /api/calc/import
│   └── middleware/
│       └── cache.js               # Simple in-memory cache (node-cache)
├── docs/
│   ├── PROMPTS.md                 # AI prompts for each module
│   ├── VRT_NOTES.md               # Irish VRT rules reference
│   └── UA_SOURCES.md              # Ukraine platform notes
├── public/
├── .env.example
├── package.json
└── vite.config.js
```

---

## Quick start

```bash
npm install
cp .env.example .env
# fill in AUTO.RIA_API_KEY in .env
npm run dev          # frontend on :5173
npm run server       # backend on :3001
```

---

## Phase build plan

| Phase | What | Est. time |
|-------|------|-----------|
| 1 | Scaffold + i18n + Toyota model list + static UI | 2h |
| 2 | AUTO.RIA API integration + price stats | 2h |
| 3 | Import calculator (VRT/VAT/duty) | 1h |
| 4 | Irish market scraper (DoneDeal) | 3h |
| 5 | UA vs IE comparison view | 1h |
| 6 | Favourites + export to PDF | 2h |
| 7 | Polish + deploy to Render | 1h |
