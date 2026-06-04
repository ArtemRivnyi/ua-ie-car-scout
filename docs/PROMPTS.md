# PROMPTS.md — AI prompts for each development phase

Paste these into Claude (or Antigravity IDE) when you're ready to build each module.
Each prompt is self-contained — include the relevant file(s) as context when you paste.

---

## PHASE 1 — Toyota quick filter + layout

**Prompt:**
```
I'm building a car price comparator app (UA → IE). 
I have these files:
- src/components/ToyotaQuickFilter.jsx  (stub)
- src/utils/toyotaModels.js             (complete)
- src/i18n/en.json and ru.json          (complete)

Implement ToyotaQuickFilter.jsx fully:
- Display all models from TOYOTA_FAVOURITES as styled pill buttons in a horizontal scrollable row
- Each pill shows emoji + translated model name
- Highlight the selected pill (blue border, light blue bg)
- On click, call onSelect(preset) with the full preset object
- Support mobile wrap layout
- Use Tailwind CSS or inline styles, no external UI libraries
```

---

## PHASE 2 — Search + AUTO.RIA integration

**Prompt:**
```
I'm building a React car search app. I have:
- src/services/autoRiaService.js  (complete — AUTO.RIA API wrapper)
- src/components/SearchBar.jsx    (stub)
- src/components/ListingCard.jsx  (partial)
- src/services/priceService.js    (complete)

Tasks:
1. Complete SearchBar.jsx — styled form with keyword input, year from/to, price from/to, 
   source select (AUTO.RIA / OLX). On submit: call autoRiaService.searchAutoRia(),
   then fetchAutoRiaListings(ids), then calcPriceStats on prices.
   Show loading spinner, error state, result count.

2. Complete ListingCard.jsx — show thumbnail photo, make/model/year, 
   price in EUR (large), mileage, location, source badge.
   Three action buttons: "View listing" (external link), "Calculate import", "Save".

3. Wire everything in App.jsx — ToyotaQuickFilter pre-fills SearchBar,
   results displayed as grid of ListingCards.

AUTO.RIA API key is in import.meta.env.VITE_AUTORIA_API_KEY
```

---

## PHASE 3 — Import calculator

**Prompt:**
```
I have src/services/importCalcService.js with calculateImportCost() and calcMargin() 
already implemented. Now build src/components/ImportCalculator.jsx:

Requirements:
- Inputs: car price (€), year of manufacture (number input or slider 1980-2010),
  shipping cost (default €900), miscellaneous costs (default €500)
- Auto-detect car age and show "Classic 30y+" / "20-30y" / "Under 20y" badge
- Show cost breakdown table: car price, VRT (with rate shown), 
  customs duty (with exemption note for classics), VAT, NOx, shipping, misc, total
- Show profit/loss badge if ieMarketAvg prop is provided
- Link to revenue.ie/vrt with note about OMSP
- All strings from i18n (en.json + ru.json keys under "calc.*")
- Can be opened as a modal/drawer when user clicks "Calculate import" on a ListingCard
  — accept initialPrice and initialYear props to pre-fill
```

---

## PHASE 4 — Irish market prices (DoneDeal scraper)

**Prompt:**
```
I have server/scrapers/donedeal.js (stub) and server/index.js (Express backend).

Implement DoneDeal.ie scraping for Irish car prices:

Option A — try the undocumented DoneDeal API first:
POST https://www.donedeal.ie/ddapi/v1/search
with headers: { "Content-Type": "application/json" }
body: {
  "sections": ["cars"],
  "filters": [{ "name": "adtype", "values": ["forsale"] }],
  "terms": "Toyota AE86",
  "paging": { "from": 0, "pageSize": 20 }
}

Option B — Puppeteer fallback if API returns 403/blocked.
URL: https://www.donedeal.ie/cars?q=toyota+ae86

Return normalized array: [{ priceEur, make, model, year, mileage, county, url }]
Wire into GET /api/irish-prices?model=... in server/index.js with 10-minute cache.
```

---

## PHASE 5 — UA vs IE comparison chart

**Prompt:**
```
I have:
- src/services/priceService.js — calcPriceStats, compareMarkets
- src/components/PriceStats.jsx (stub)

Build these two components:

1. PriceStats.jsx — complete implementation:
   - 4 metric cards: min / avg / median / max  
   - Recharts BarChart below showing all individual prices as bars
   - Color bars: green if below average, amber if above
   - If stats.outliers.length > 0: show warning "X outlier prices excluded from average"

2. CompareBar.jsx — new component:
   - Horizontal dual bar showing UA avg vs IE avg
   - "You save €X (Y%)" callout in green
   - Links to relevant sources
   - Import recharts { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer }
```

---

## PHASE 6 — Favourites + export

**Prompt:**
```
Build src/components/FavouritesPanel.jsx:

- Store saved listings in localStorage key "ua_ie_scout_favourites"
- Show list of saved ListingCards with remove button
- Each card has "Calculate import" button
- "Export to PDF" button — generates a simple PDF summary:
  - App title + date
  - For each saved listing: make/model/year, UA price, calculated import total, 
    potential margin vs entered IE price
  - Use window.print() with @media print CSS, or jsPDF library

Also update App.jsx:
- Global favourites state (useState + useEffect to persist to localStorage)
- Pass onSave / saved props down to all ListingCards
- Badge count on Favourites tab button
```

---

## PHASE 7 — Deploy to Render

**Prompt:**
```
I have a Vite React frontend + Express backend app at ua-ie-car-scout/.
Help me set up deployment to Render.com as two services:

1. Web Service (backend) — server/index.js:
   - Build command: npm install
   - Start command: node server/index.js
   - Environment vars: PORT=3001, AUTORIA_API_KEY=...

2. Static Site (frontend):
   - Build command: npm run build
   - Publish directory: dist
   - Environment: VITE_AUTORIA_API_KEY=..., VITE_API_BASE=https://ua-ie-car-scout-api.onrender.com/api

Generate render.yaml for both services and update vite.config.js with correct 
API proxy settings for production.
```

---

## TESTING prompts

### Test the import calculator
```
I have src/services/importCalcService.js. Write Jest unit tests for:
- calculateImportCost() with a classic Toyota AE86 1985, price €5000
  Expected: customs = 0, vrt ≈ €700, vat ≈ €1150
- calculateImportCost() for a 2005 car — should apply customs duty + higher VRT
- calcMargin() — profitable, breakeven, loss cases
```

### Test AUTO.RIA service
```
Write a manual test script (Node.js, no framework) for autoRiaService:
- search for "AE86" on AUTO.RIA
- log first 3 listing IDs
- fetch details of listing[0]
- log normalized output

Script should run with: node scripts/testAutoRia.mjs
Read API key from .env file using dotenv.
```

---

## Showing to the Irish friend (Patrick)

When the app is deployed, send Patrick this:

> 🚗 **UA → IE Car Scout** — built for your Toyota hunt!
> 
> 🔗 [link to Render deploy]
>
> How to use:
> 1. Click a Toyota model shortcut (AE86, Supra, MR2...)
> 2. See live listings from Ukraine with prices in EUR
> 3. Click "Calculate import" on any listing to see full Irish import cost
> 4. Enter Irish market prices to see potential profit margin
> 5. Save favourites and export to PDF
>
> Switch language: 🇮🇪 EN / 🇺🇦 RU button top right
> ⚠️ Always verify VRT at revenue.ie before committing to a purchase!
