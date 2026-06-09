# 🚗 UA-IE Car Scout

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Puppeteer](https://img.shields.io/badge/puppeteer-%2340B5A4.svg?style=for-the-badge&logo=puppeteer&logoColor=white)

**UA-IE Car Scout** is a powerful, real-time meta-search engine and financial calculator designed to bridge the gap between the Ukrainian and Irish automotive markets. 

Whether you are comparing prices across Europe or planning to import a car from Ukraine to Ireland, this tool instantly aggregates listings from **6 top marketplaces**, normalizes prices into Euros using live exchange rates, and calculates exact Irish customs and VAT duties.

    


---

## 🌟 Why is this project unique and useful?

Importing a vehicle involves complex math: customs clearance, VAT, and shipping costs. Finding the cars themselves means manually browsing half a dozen websites in different languages and currencies. 

**UA-IE Car Scout solves this by:**
1. **Aggregating 6 Marketplaces in 1 Click**: Instead of opening 6 tabs, enter "Toyota Corolla" once and see results from `AUTO.RIA`, `RST.ua`, `CARS.ua`, `OLX.ua`, `DoneDeal`, `CarsIreland`, and `Carzone`.
2. **Real-Time Currency Normalization**: Ukrainian sites use UAH or USD. Irish sites use EUR. Our API fetches live exchange rates from the National Bank of Ukraine and normalizes every single price to EUR for perfect 1-to-1 comparison.
3. **Advanced Import Calculator**: It doesn't just show the price of the car; it calculates the **Total Landed Cost in Ireland** including standard shipping (€1400), 6.5% Customs Duty, and 23% Irish VAT, showing you the true final price before you even click on the listing.
4. **Smart Anti-Bot Evasion**: The backend utilizes both HTTP DOM scraping and `puppeteer-extra-plugin-stealth` to bypass Cloudflare and scrape heavily protected SPAs (Single Page Applications) like DoneDeal and Auto.RIA.
5. **Deduplication Engine**: Cars are often posted on multiple sites (e.g. OLX and Auto.RIA). Our smart dedup engine analyzes prices, years, and models to group duplicate listings together.

---

## 🏗️ Architecture & Project Structure

The project is a monorepo consisting of a modern React/Vite frontend and a robust Node.js/Express backend scraper.

| Directory / File | Description | What is it for? |
| :--- | :--- | :--- |
| **`/src/`** | Frontend Codebase | Contains the Vite + React frontend. Features glassmorphism UI, interactive charts, and real-time state management. |
| **`/src/services/`** | API Services | Frontend services (`autoRiaService.js`, etc.) that orchestrate calls to our backend API endpoints. |
| **`/server/`** | Backend Codebase | The Express.js server that handles the heavy lifting, scraping, and live exchange rate fetching. |
| **`/server/scrapers/`** | Scraper Modules | Individual scrapers for all 6 websites (`olx.js`, `donedeal.js`, `rst.js`, etc.). These handle HTML parsing and Puppeteer logic. |
| **`/server/scrapers/puppeteerSetup.js`** | Puppeteer Config | Manages the hidden headless browser instance, including stealth plugins and timeout recoveries. |
| **`/tests/live_scrapers.test.js`**| Integration Tests | A robust test suite that hits the live websites to ensure the parsers are working against the latest DOM changes. |
| **`importCalcService.js`** | Financial Logic | The core math engine: `Cost + Shipping + Customs (6.5%) + VAT (23%)`. |

---

## 🛠️ Technologies Used

### Frontend
- **React 18** (Vite)
- **Vanilla CSS** (Custom Design System with Glassmorphism, CSS Variables, and Flexbox layouts)
- **Recharts** (For rendering price distribution analytics and medians)
- **Lucide React** (Beautiful SVG icons)

### Backend
- **Node.js & Express**
- **Cheerio / Puppeteer** (Dual-mode scraping: Cheerio for blazing fast HTTP parsing, falling back to Puppeteer Stealth for bypassing Cloudflare on protected SPAs)
- **Node Test Runner** (Native `node --test` for CI/CD integration)

---

## 🚀 How to Run Locally

To get the full experience (and bypass Cloudflare protections on Irish websites, which require Puppeteer and a non-server IP), you should run this locally.

### 1. Install Dependencies
```bash
npm install
```
*(This will automatically download the Chromium binary needed for Puppeteer via our postinstall script)*

### 2. Start the Application
```bash
npm run dev
```

### 3. Open the App
Navigate to `http://localhost:5173` in your browser. The backend API automatically starts on `http://localhost:3000` concurrently.

---

## 🧪 Running Tests

We have a live integration test suite that verifies all 6 scrapers against the real websites to ensure DOM structures haven't changed.

```bash
npm run test:api
```

> **Note on Cloudflare:** If you run the tests on a cloud server (like Render Free Tier), `RST.ua` and the Irish sites may return `0` results due to Datacenter IP blocking. The test suite is smart enough to log a `[WARNING]` and skip strict validation instead of failing your build. To test them properly, run the tests on your local machine.

---

## ⚖️ Disclaimer
*This project is for educational and personal use. Web scraping should be done responsibly and in accordance with the Terms of Service of the respective websites. The import calculator provides estimates; official Revenue guidelines apply to all actual imports.*
