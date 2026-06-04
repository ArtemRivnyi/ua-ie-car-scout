var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// test-render.jsx
var import_react6 = __toESM(require("react"), 1);
var import_server = require("react-dom/server");

// src/App.jsx
var import_react5 = __toESM(require("react"), 1);
var import_react_i18next9 = require("react-i18next");

// src/components/ToyotaQuickFilter.jsx
var import_react_i18next = require("react-i18next");

// src/utils/toyotaModels.js
var TOYOTA_FAVOURITES = [
  {
    id: "ae86",
    i18nKey: "toyota.ae86",
    make: "Toyota",
    models: ["Corolla AE86", "Sprinter Trueno AE86", "Corolla Levin AE86"],
    yearFrom: 1983,
    yearTo: 1987,
    searchTerms: ["AE86", "\u0445\u0430\u0447\u0438\u0440\u043E\u043A\u04AF", "hachiroku", "4AGE", "Corolla Levin", "Sprinter Trueno"],
    autoRiaModelId: null,
    // TODO: fill from AUTO.RIA API
    emoji: "\u{1F3C1}"
  },
  {
    id: "supra_a60",
    i18nKey: "toyota.supra_a60",
    make: "Toyota",
    models: ["Supra MA61", "Celica Supra"],
    yearFrom: 1981,
    yearTo: 1986,
    searchTerms: ["Supra A60", "MA61", "Celica Supra"],
    emoji: "\u{1F525}"
  },
  {
    id: "supra_a70",
    i18nKey: "toyota.supra_a70",
    make: "Toyota",
    models: ["Supra MA70", "Supra JZA70"],
    yearFrom: 1986,
    yearTo: 1993,
    searchTerms: ["Supra A70", "MA70", "JZA70", "7M-GTE", "1JZ"],
    emoji: "\u{1F525}"
  },
  {
    id: "mr2_aw11",
    i18nKey: "toyota.mr2_aw11",
    make: "Toyota",
    models: ["MR2 AW11"],
    yearFrom: 1984,
    yearTo: 1989,
    searchTerms: ["MR2 AW11", "AW11", "Toyota MR2 1985", "Toyota MR2 1986"],
    emoji: "\u26A1"
  },
  {
    id: "mr2_sw20",
    i18nKey: "toyota.mr2_sw20",
    make: "Toyota",
    models: ["MR2 SW20", "MR2 Turbo"],
    yearFrom: 1989,
    yearTo: 1999,
    searchTerms: ["MR2 SW20", "SW20", "3S-GTE", "MR2 Turbo"],
    emoji: "\u26A1"
  },
  {
    id: "celica",
    i18nKey: "toyota.celica",
    make: "Toyota",
    models: ["Celica T160", "Celica T180", "Celica GT-Four"],
    yearFrom: 1985,
    yearTo: 1993,
    searchTerms: ["Celica T160", "Celica T180", "Celica ST165", "Celica GT-Four", "ST185"],
    emoji: "\u{1F3CE}\uFE0F"
  },
  {
    id: "corolla",
    i18nKey: "toyota.corolla",
    make: "Toyota",
    models: ["Corolla E80", "Corolla E90", "Corolla E100"],
    yearFrom: 1983,
    yearTo: 1997,
    searchTerms: ["Corolla 1983", "Corolla 1987", "Corolla 1991", "Corolla E80", "Corolla E90"],
    emoji: "\u{1F697}"
  },
  {
    id: "hilux",
    i18nKey: "toyota.hilux",
    make: "Toyota",
    models: ["Hilux N50", "Hilux N60", "Hilux Surf", "4Runner"],
    yearFrom: 1979,
    yearTo: 1996,
    searchTerms: ["Hilux 1980", "Hilux Surf", "Toyota 4Runner", "Land Cruiser 80"],
    emoji: "\u{1F6FB}"
  }
];
var AUTORIA_TOYOTA_MARK_ID = 79;

// src/components/ToyotaQuickFilter.jsx
function ToyotaQuickFilter({ onSelect, selected }) {
  const { t: t2 } = (0, import_react_i18next.useTranslation)();
  return /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "1rem" } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: "#999", marginBottom: 6 } }, t2("toyota.quickFilter")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } }, TOYOTA_FAVOURITES.map((preset) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: preset.id,
      onClick: () => onSelect?.(preset),
      style: {
        padding: "5px 12px",
        borderRadius: 20,
        border: "1px solid",
        borderColor: selected === preset.id ? "#378ADD" : "#ddd",
        background: selected === preset.id ? "#E6F1FB" : "#fff",
        fontSize: 13,
        cursor: "pointer"
      }
    },
    preset.emoji,
    " ",
    t2(preset.i18nKey)
  ))));
}

// src/components/SearchBar.jsx
var import_react = require("react");
var import_react_i18next2 = require("react-i18next");

// src/services/autoRiaService.js
var import_meta = {};
var BASE_URL = "https://developers.auto.ria.com";
var API_KEY = import_meta.env.VITE_AUTORIA_API_KEY;
async function searchAutoRia({
  query = "",
  markId,
  modelId,
  yearFrom,
  yearTo,
  priceFrom,
  priceTo,
  page = 0,
  count = 20
} = {}) {
  const params = new URLSearchParams({
    api_key: API_KEY,
    category_id: 1,
    // passenger cars
    currency: 1,
    // USD (AUTO.RIA prices in USD — convert to EUR)
    page,
    countpage: count
  });
  if (markId) params.set("marka_id[0]", markId);
  if (modelId) params.set("model_id[0]", modelId);
  if (yearFrom) params.set("s_yers[0]", yearFrom);
  if (yearTo) params.set("po_yers[0]", yearTo);
  if (priceFrom) params.set("price_ot", priceFrom);
  if (priceTo) params.set("price_do", priceTo);
  if (query) params.set("q", query);
  const url = `${BASE_URL}/auto/search?${params}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`AUTO.RIA error: ${res.status}`);
    const data = await res.json();
    return {
      ids: data?.result?.search_result?.ids || [],
      total: data?.result?.search_result?.count || 0,
      rawData: data
    };
  } catch (err) {
    console.error("[autoRiaService] searchAutoRia failed:", err);
    return { ids: [], total: 0, error: err.message };
  }
}
async function getAutoRiaListing(autoId) {
  const url = `${BASE_URL}/auto/info?api_key=${API_KEY}&auto_id=${autoId}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`AUTO.RIA listing error: ${res.status}`);
    const data = await res.json();
    return normalizeAutoRiaListing(data);
  } catch (err) {
    console.error(`[autoRiaService] getAutoRiaListing(${autoId}) failed:`, err);
    return null;
  }
}
function normalizeAutoRiaListing(raw) {
  const USD_TO_EUR = 0.92;
  const priceUsd = raw.USD || raw.price?.USD || 0;
  let photos = [];
  if (raw.photoData?.seoLinkF?.length) {
    photos = raw.photoData.seoLinkF;
  } else if (raw.photoData?.seoLinkSX?.length) {
    photos = raw.photoData.seoLinkSX;
  } else if (raw.photo_links?.length) {
    photos = raw.photo_links;
  } else if (raw.mainPhoto) {
    photos = [raw.mainPhoto];
  }
  return {
    id: `autoria_${raw.autoId}`,
    source: "AUTO.RIA",
    sourceUrl: raw.linkToView || `https://auto.ria.com/auto_${raw.autoId}.html`,
    make: raw.markName || "",
    model: raw.modelName || "",
    year: raw.year || null,
    priceEur: Math.round(priceUsd * USD_TO_EUR),
    priceOriginal: priceUsd,
    priceOriginalCurrency: "USD",
    engineCc: raw.engineVolume ? raw.engineVolume * 1e3 : null,
    mileageKm: raw.raceInt || null,
    location: raw.cityName || raw.regionName || "Ukraine",
    photos,
    description: raw.description || "",
    rawData: raw
  };
}
async function fetchAutoRiaListings(ids) {
  const results = await Promise.allSettled(
    ids.slice(0, 20).map((id) => getAutoRiaListing(id))
  );
  return results.filter((r) => r.status === "fulfilled" && r.value).map((r) => r.value);
}

// src/services/priceService.js
function calcPriceStats(prices) {
  if (!prices || prices.length === 0) return null;
  const valid = prices.filter((p) => typeof p === "number" && p > 0);
  if (valid.length === 0) return null;
  const sorted = [...valid].sort((a, b) => a - b);
  const n = sorted.length;
  const min = sorted[0];
  const max = sorted[n - 1];
  const sum = sorted.reduce((a, b) => a + b, 0);
  const avg = Math.round(sum / n);
  const median = n % 2 === 0 ? Math.round((sorted[n / 2 - 1] + sorted[n / 2]) / 2) : sorted[Math.floor(n / 2)];
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;
  const outliers = sorted.filter((p) => p < lowerFence || p > upperFence);
  const filtered = sorted.filter((p) => p >= lowerFence && p <= upperFence);
  const avgFiltered = filtered.length > 0 ? Math.round(filtered.reduce((a, b) => a + b, 0) / filtered.length) : avg;
  return {
    count: n,
    min,
    max,
    avg,
    median,
    q1,
    q3,
    avgFiltered,
    outliers,
    prices: sorted
  };
}

// src/services/externalSearchService.js
var import_meta2 = {};
function buildAutoRiaUrl(query, yearFrom, yearTo) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  let url = "https://auto.ria.com/uk/search/";
  if (query) url += `?q=${encodeURIComponent(query)}`;
  return url;
}
function buildRstUrl(query, yearFrom, yearTo) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (yearFrom) params.set("year_from", yearFrom);
  if (yearTo) params.set("year_to", yearTo);
  return `https://rst.ua/oldcars/?${params}`;
}
function buildCarsUaUrl(query) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  return `https://cars.ua/search/?${params}`;
}
function buildOlxUrl(query) {
  return `https://www.olx.ua/uk/transport/legkovye-avtomobili/?q=${encodeURIComponent(query || "")}`;
}
function buildDoneDealUrl(query) {
  return `https://www.donedeal.ie/cars?q=${encodeURIComponent(query || "")}`;
}
function buildCarsIrelandUrl(query) {
  return `https://www.carsireland.ie/used-cars?q=${encodeURIComponent(query || "")}`;
}
function buildCarzoneUrl(query) {
  return `https://www.carzone.ie/search?q=${encodeURIComponent(query || "")}`;
}
var API_BASE = import_meta2.env.VITE_API_BASE || "";
async function fetchIrishPrices(model) {
  try {
    const res = await fetch(`${API_BASE}/api/irish-prices?model=${encodeURIComponent(model)}`);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("[externalSearchService] fetchIrishPrices failed:", err);
    return { listings: [], stats: null, error: err.message };
  }
}
var UA_SOURCES = [
  { id: "autoria", i18nKey: "sources.autoria", hasApi: true, emoji: "\u{1F535}", buildUrl: buildAutoRiaUrl },
  { id: "rst", i18nKey: "sources.rst", hasApi: false, emoji: "\u{1F7E0}", buildUrl: buildRstUrl },
  { id: "carsua", i18nKey: "sources.carsua", hasApi: false, emoji: "\u{1F7E2}", buildUrl: buildCarsUaUrl },
  { id: "olx", i18nKey: "sources.olx", hasApi: false, emoji: "\u{1F7E3}", buildUrl: buildOlxUrl }
];
var IE_SOURCES = [
  { id: "donedeal", i18nKey: "sources.donedeal", hasApi: true, emoji: "\u{1F7E1}", buildUrl: buildDoneDealUrl },
  { id: "carsireland", i18nKey: "sources.carsireland", hasApi: false, emoji: "\u{1F534}", buildUrl: buildCarsIrelandUrl },
  { id: "carzone", i18nKey: "sources.carzone", hasApi: false, emoji: "\u{1F7E4}", buildUrl: buildCarzoneUrl }
];

// src/components/SearchBar.jsx
function SearchBar({ onResults, onStats, onIrishResults, preset }) {
  const { t: t2 } = (0, import_react_i18next2.useTranslation)();
  const [query, setQuery] = (0, import_react.useState)("");
  const [yearFrom, setYearFrom] = (0, import_react.useState)("");
  const [yearTo, setYearTo] = (0, import_react.useState)("");
  const [priceFrom, setPriceFrom] = (0, import_react.useState)("");
  const [priceTo, setPriceTo] = (0, import_react.useState)("");
  const [loading, setLoading] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)(null);
  const [resultCount, setResultCount] = (0, import_react.useState)(null);
  const [uaSources, setUaSources] = (0, import_react.useState)({ autoria: true, rst: false, carsua: false, olx: false });
  const [ieSources, setIeSources] = (0, import_react.useState)({ donedeal: true, carsireland: false, carzone: false });
  (0, import_react.useEffect)(() => {
    if (!preset) return;
    setQuery(preset.searchTerms?.[0] || "");
    setYearFrom(preset.yearFrom || "");
    setYearTo(preset.yearTo || "");
    setPriceFrom("");
    setPriceTo("");
    setError(null);
    setResultCount(null);
  }, [preset]);
  const toggleUa = (id) => setUaSources((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleIe = (id) => setIeSources((prev) => ({ ...prev, [id]: !prev[id] }));
  const handleSearch = async (e) => {
    e?.preventDefault?.();
    setLoading(true);
    setError(null);
    setResultCount(null);
    let allListings = [];
    let externalCount = 0;
    try {
      if (uaSources.autoria) {
        const { ids, total, error: searchErr } = await searchAutoRia({
          query,
          markId: AUTORIA_TOYOTA_MARK_ID,
          yearFrom: yearFrom || void 0,
          yearTo: yearTo || void 0,
          priceFrom: priceFrom || void 0,
          priceTo: priceTo || void 0
        });
        if (searchErr) throw new Error(searchErr);
        if (ids && ids.length > 0) {
          const listings = await fetchAutoRiaListings(ids.slice(0, 10));
          allListings = [...allListings, ...listings];
        }
        setResultCount(total || 0);
      }
      const externalUa = UA_SOURCES.filter((s) => !s.hasApi && uaSources[s.id]);
      externalUa.forEach((source) => {
        const url = source.buildUrl(query, yearFrom, yearTo);
        window.open(url, `_blank_${source.id}`);
        externalCount++;
      });
      const externalIe = IE_SOURCES.filter((s) => !s.hasApi && ieSources[s.id]);
      externalIe.forEach((source) => {
        const url = source.buildUrl(query);
        window.open(url, `_blank_${source.id}`);
        externalCount++;
      });
      if (ieSources.donedeal && query) {
        const modelQuery = preset ? `${preset.make} ${preset.searchTerms?.[0] || ""}` : query;
        try {
          const ieData = await fetchIrishPrices(modelQuery);
          onIrishResults?.(ieData);
        } catch {
        }
      }
      const stats = calcPriceStats(allListings.map((l) => l.priceEur));
      onResults?.(allListings);
      onStats?.(stats);
      if (externalCount > 0 && allListings.length === 0) {
        setResultCount(-1);
      }
    } catch (err) {
      setError(err.message || "Search failed");
      onResults?.([]);
      onStats?.(null);
    } finally {
      setLoading(false);
    }
  };
  const handleClear = () => {
    setQuery("");
    setYearFrom("");
    setYearTo("");
    setPriceFrom("");
    setPriceTo("");
    setError(null);
    setResultCount(null);
    onResults?.([]);
    onStats?.(null);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "search-main" }, /* @__PURE__ */ React.createElement("div", { className: "sources-section" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "section-label" }, /* @__PURE__ */ React.createElement("span", { className: "section-label__flag section-label__flag--ua" }, "UA"), /* @__PURE__ */ React.createElement("span", { className: "section-label__text" }, t2("search.uaSources") || "Ukraine sources")), /* @__PURE__ */ React.createElement("div", { className: "sources-row" }, UA_SOURCES.map((source) => /* @__PURE__ */ React.createElement(
    SourceCheckbox,
    {
      key: source.id,
      source,
      checked: uaSources[source.id],
      onChange: () => toggleUa(source.id),
      t: t2
    }
  )))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "section-label" }, /* @__PURE__ */ React.createElement("span", { className: "section-label__flag section-label__flag--ie" }, "IE"), /* @__PURE__ */ React.createElement("span", { className: "section-label__text" }, t2("search.ieSources") || "Ireland sources")), /* @__PURE__ */ React.createElement("div", { className: "sources-row" }, IE_SOURCES.map((source) => /* @__PURE__ */ React.createElement(
    SourceCheckbox,
    {
      key: source.id,
      source,
      checked: ieSources[source.id],
      onChange: () => toggleIe(source.id),
      t: t2
    }
  ))))), /* @__PURE__ */ React.createElement("div", { className: "search-bar", role: "search" }, /* @__PURE__ */ React.createElement("svg", { className: "search-bar__icon", viewBox: "0 0 20 20", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("circle", { cx: "9", cy: "9", r: "6", stroke: "currentColor", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("path", { d: "M13.5 13.5L17 17", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" })), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "search",
      className: "search-bar__input",
      placeholder: t2("search.placeholder"),
      value: query,
      onChange: (e) => setQuery(e.target.value),
      onKeyDown: (e) => e.key === "Enter" && handleSearch(),
      autoComplete: "off",
      spellCheck: "false"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "filters-row", role: "group" }, /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field__label" }, t2("search.yearFrom")), /* @__PURE__ */ React.createElement("input", { type: "number", className: "input", value: yearFrom, onChange: (e) => setYearFrom(e.target.value), placeholder: "1980", min: "1950" })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field__label" }, t2("search.yearTo")), /* @__PURE__ */ React.createElement("input", { type: "number", className: "input", value: yearTo, onChange: (e) => setYearTo(e.target.value), placeholder: "2000", min: "1950" })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field__label" }, t2("search.priceFrom")), /* @__PURE__ */ React.createElement("input", { type: "number", className: "input", value: priceFrom, onChange: (e) => setPriceFrom(e.target.value), placeholder: "0", min: "0" })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field__label" }, t2("search.priceTo")), /* @__PURE__ */ React.createElement("input", { type: "number", className: "input", value: priceTo, onChange: (e) => setPriceTo(e.target.value), placeholder: "50000", min: "0" }))), /* @__PURE__ */ React.createElement("div", { className: "search-actions" }, /* @__PURE__ */ React.createElement("button", { className: "btn-search", type: "button", onClick: handleSearch, disabled: loading }, loading ? /* @__PURE__ */ React.createElement("span", null, "\u23F3 Loading...") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 20 20", fill: "none", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("circle", { cx: "9", cy: "9", r: "6", stroke: "currentColor", strokeWidth: "1.8" }), /* @__PURE__ */ React.createElement("path", { d: "M13.5 13.5L17 17", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" })), t2("search.search"))), /* @__PURE__ */ React.createElement("button", { className: "btn-clear", type: "button", onClick: handleClear }, t2("search.clear")), error && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--color-danger)" } }, "\u26A0\uFE0F ", error)));
}
function SourceCheckbox({ source, checked, onChange, t: t2 }) {
  const dotClass = `source-dot source-dot--${source.id.toLowerCase()}`;
  return /* @__PURE__ */ React.createElement(
    "label",
    {
      className: `checkbox-wrapper ${checked ? "checked" : ""}`,
      role: "checkbox",
      "aria-checked": checked,
      tabIndex: "0",
      onClick: onChange,
      onKeyDown: (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange();
        }
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "checkbox-box" }, checked && /* @__PURE__ */ React.createElement("svg", { width: "10", height: "8", viewBox: "0 0 10 8", fill: "none" }, /* @__PURE__ */ React.createElement("path", { d: "M1 4L3.5 6.5L9 1", stroke: "white", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }))),
    /* @__PURE__ */ React.createElement("span", { className: "checkbox-label" }, /* @__PURE__ */ React.createElement("span", { className: dotClass }), t2(source.i18nKey), !source.hasApi && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--color-text-muted)" } }, "\u2197"), source.hasApi && /* @__PURE__ */ React.createElement("span", { className: "api-badge" }, "API"))
  );
}

// src/components/ListingCard.jsx
var import_react2 = __toESM(require("react"), 1);
var import_react_i18next3 = require("react-i18next");

// src/services/importCalcService.js
var VRT_RATES = {
  classic: 0.14,
  // 30y+ — Revenue tends to set low OMSP for classics; ~14% of purchase price rough estimate
  aged: 0.25,
  // 20-30y
  modern: 0.2
  // under 20y — actual rate depends on CO2 band (7%–41%)
};
var CUSTOMS_RATE = 0.065;
var VAT_RATE = 0.23;
var NOX_LEVY = 0;
function calculateImportCost({
  carPrice,
  carYear,
  shippingCost = 900,
  miscCosts = 500,
  omsp = null
}) {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const carAge = currentYear - carYear;
  const isClassic = carAge >= 30;
  const isAged = carAge >= 20 && carAge < 30;
  const customsDuty = isClassic ? 0 : Math.round(carPrice * CUSTOMS_RATE);
  const vatBase = carPrice + customsDuty;
  const vatAmount = Math.round(vatBase * VAT_RATE);
  const vrtBase = omsp || carPrice;
  const vrtRate = isClassic ? VRT_RATES.classic : isAged ? VRT_RATES.aged : VRT_RATES.modern;
  const vrtAmount = Math.round(vrtBase * vrtRate);
  const noxLevy = NOX_LEVY;
  const totalImportTax = customsDuty + vatAmount + vrtAmount + noxLevy;
  const totalLanded = carPrice + totalImportTax + shippingCost + miscCosts;
  return {
    carPrice,
    carYear,
    carAge,
    isClassic,
    customsDuty,
    vatAmount,
    vatBase,
    vrtAmount,
    vrtRate,
    noxLevy,
    shippingCost,
    miscCosts,
    totalImportTax,
    totalLanded
  };
}
function calcMargin(totalLanded, ieMarketAvg) {
  const profit = ieMarketAvg - totalLanded;
  const margin = ieMarketAvg > 0 ? Math.round(profit / totalLanded * 100) : 0;
  const verdict = profit > 500 ? "profitable" : profit > -500 ? "breakEven" : "loss";
  return { profit: Math.round(profit), margin, verdict };
}

// src/components/ListingCard.jsx
function ListingCard({ listing, onSave, onCalc, saved }) {
  const { t: t2 } = (0, import_react_i18next3.useTranslation)();
  const hasPhoto = listing.photos && listing.photos.length > 0;
  let totalLanded = null;
  if (listing.priceEur) {
    const importCost = calculateImportCost({ carPrice: listing.priceEur, carYear: listing.year || 2e3, shippingCost: 900, miscCosts: 500 });
    totalLanded = importCost.totalLanded;
  }
  const dotClass = `source-dot source-dot--${(listing.source || "").toLowerCase().replace(".", "")}`;
  return /* @__PURE__ */ import_react2.default.createElement("article", { className: "car-card", role: "listitem" }, hasPhoto ? /* @__PURE__ */ import_react2.default.createElement(
    "img",
    {
      src: listing.photos[0],
      alt: `${listing.make} ${listing.model}`,
      className: "car-card__image",
      loading: "lazy",
      onError: (e) => {
        e.target.style.display = "none";
        e.target.parentNode.innerHTML = '<div class="demo-result-img" aria-hidden="true">\u{1F697}</div>';
      }
    }
  ) : /* @__PURE__ */ import_react2.default.createElement("div", { className: "demo-result-img", "aria-hidden": "true" }, "\u{1F697}"), /* @__PURE__ */ import_react2.default.createElement("div", { className: "car-card__body" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "car-card__header", style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } }, /* @__PURE__ */ import_react2.default.createElement("div", null, /* @__PURE__ */ import_react2.default.createElement("h3", { className: "car-card__title" }, listing.make, " ", listing.model, " ", listing.year || ""), /* @__PURE__ */ import_react2.default.createElement("div", { className: "car-card__meta" }, listing.year && /* @__PURE__ */ import_react2.default.createElement("span", { className: "car-card__meta-item" }, "\u{1F4C5} ", listing.year), listing.mileageKm > 0 && /* @__PURE__ */ import_react2.default.createElement("span", { className: "car-card__meta-item" }, "\u23F1 ", listing.mileageKm.toLocaleString(), " km"), listing.location && /* @__PURE__ */ import_react2.default.createElement("span", { className: "car-card__meta-item" }, "\u{1F4CD} ", listing.location), /* @__PURE__ */ import_react2.default.createElement("span", { className: "car-card__meta-item" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: "source-chip" }, /* @__PURE__ */ import_react2.default.createElement("span", { className: dotClass }), listing.source)), listing.year && (/* @__PURE__ */ new Date()).getFullYear() - listing.year >= 30 && /* @__PURE__ */ import_react2.default.createElement("span", { className: "badge badge--success", style: { fontSize: 11 } }, "30+ yr classic"))), /* @__PURE__ */ import_react2.default.createElement(
    "button",
    {
      className: `btn-save ${saved ? "saved" : ""}`,
      onClick: () => onSave(listing),
      "aria-label": "Save to favourites"
    },
    /* @__PURE__ */ import_react2.default.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: saved ? "currentColor" : "none", stroke: "currentColor", strokeWidth: "1.8" }, /* @__PURE__ */ import_react2.default.createElement("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }))
  )), /* @__PURE__ */ import_react2.default.createElement("div", { className: "car-card__footer", style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 16 } }, /* @__PURE__ */ import_react2.default.createElement("div", null, /* @__PURE__ */ import_react2.default.createElement("div", { className: "car-card__price" }, "\u20AC\u2009", listing.priceEur ? listing.priceEur.toLocaleString() : "\u2014"), totalLanded && /* @__PURE__ */ import_react2.default.createElement("div", { className: "car-card__price-landed" }, "+ import \u2192", /* @__PURE__ */ import_react2.default.createElement("span", { className: "car-card__price-total" }, "\u20AC\u2009~", totalLanded.toLocaleString(), " landed")), !totalLanded && listing.priceOriginal > 0 && /* @__PURE__ */ import_react2.default.createElement("div", { className: "car-card__price-landed" }, "$", listing.priceOriginal.toLocaleString(), " ", listing.priceOriginalCurrency)), /* @__PURE__ */ import_react2.default.createElement("div", { style: { display: "flex", gap: 8 } }, listing.priceEur > 0 && /* @__PURE__ */ import_react2.default.createElement("button", { onClick: () => onCalc(listing), className: "btn btn-secondary btn-sm" }, "Calc cost"), /* @__PURE__ */ import_react2.default.createElement("a", { href: listing.sourceUrl, target: "_blank", rel: "noreferrer", className: "btn btn-primary btn-sm" }, "View \u2192")))));
}

// src/components/ImportCalculator.jsx
var import_react3 = require("react");
var import_react_i18next4 = require("react-i18next");
function ImportCalculator({ initialPrice, initialYear, ieMarketAvg, onClose }) {
  const { t: t2 } = (0, import_react_i18next4.useTranslation)();
  const [carPrice, setCarPrice] = (0, import_react3.useState)(initialPrice || 5e3);
  const [carYear, setCarYear] = (0, import_react3.useState)(initialYear || 1985);
  const [shipping, setShipping] = (0, import_react3.useState)(900);
  const [misc, setMisc] = (0, import_react3.useState)(500);
  (0, import_react3.useEffect)(() => {
    if (initialPrice != null) setCarPrice(initialPrice);
    if (initialYear != null) setCarYear(initialYear);
  }, [initialPrice, initialYear]);
  const breakdown = calculateImportCost({
    carPrice: Number(carPrice) || 0,
    carYear: Number(carYear) || 2e3,
    shippingCost: Number(shipping) || 0,
    miscCosts: Number(misc) || 0
  });
  const margin = ieMarketAvg ? calcMargin(breakdown.totalLanded, ieMarketAvg) : null;
  const ageBadge = (() => {
    if (breakdown.carAge >= 30) return { label: "30+ years (classic)", class: "badge--success" };
    if (breakdown.carAge >= 20) return { label: "20-29 years", class: "badge--warning" };
    return { label: "Under 20 years", class: "badge--primary" };
  })();
  const verdictStyle = {
    profitable: { class: "alert--success", icon: "\u{1F4C8}" },
    breakEven: { class: "alert--warning", icon: "\u2696\uFE0F" },
    loss: { class: "alert--danger", icon: "\u{1F4C9}" }
  };
  const fmtEur = (n) => `\u20AC${(n || 0).toLocaleString()}`;
  return /* @__PURE__ */ React.createElement("div", { className: "calc-card", style: onClose ? { margin: 0 } : {} }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-6)" } }, /* @__PURE__ */ React.createElement("div", { className: "calc-card__title", style: { margin: 0 } }, /* @__PURE__ */ React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "var(--color-accent)", strokeWidth: "1.8", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("rect", { x: "4", y: "2", width: "16", height: "20", rx: "2" }), /* @__PURE__ */ React.createElement("line", { x1: "8", y1: "7", x2: "16", y2: "7" }), /* @__PURE__ */ React.createElement("line", { x1: "8", y1: "11", x2: "16", y2: "11" }), /* @__PURE__ */ React.createElement("line", { x1: "8", y1: "15", x2: "12", y2: "15" }), /* @__PURE__ */ React.createElement("line", { x1: "14", y1: "14", x2: "14", y2: "18" }), /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "16", x2: "16", y2: "16" })), t2("calc.title") || "Import cost calculator"), onClose && /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "btn-clear", style: { fontSize: 24, padding: 0, width: 32, height: 32, lineHeight: 1 }, "aria-label": "Close" }, "\xD7")), /* @__PURE__ */ React.createElement("form", { className: "calc-form", noValidate: true, onSubmit: (e) => e.preventDefault() }, /* @__PURE__ */ React.createElement("div", { className: "calc-grid" }, /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field__label" }, t2("calc.carPrice")), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      className: "input",
      value: carPrice,
      onChange: (e) => setCarPrice(e.target.value),
      min: "0",
      step: "100",
      placeholder: "5 000"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field__label" }, t2("calc.carAge")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "var(--space-3)", alignItems: "center" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      className: "input",
      value: carYear,
      onChange: (e) => setCarYear(e.target.value),
      min: "1950",
      max: "2025",
      placeholder: "1985"
    }
  ), /* @__PURE__ */ React.createElement("span", { className: `badge ${ageBadge.class}` }, ageBadge.label))), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field__label" }, t2("calc.shipping")), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      className: "input",
      value: shipping,
      onChange: (e) => setShipping(e.target.value),
      min: "0",
      step: "50",
      placeholder: "900"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field__label" }, t2("calc.misc")), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      className: "input",
      value: misc,
      onChange: (e) => setMisc(e.target.value),
      min: "0",
      step: "50",
      placeholder: "500"
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "calc-result" }, /* @__PURE__ */ React.createElement("div", { className: "calc-result__header" }, t2("calc.breakdown") || "Cost breakdown"), /* @__PURE__ */ React.createElement("table", { className: "cost-table", "aria-label": "Import cost breakdown" }, /* @__PURE__ */ React.createElement("tbody", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { className: "cost-table__label" }, t2("calc.carPrice")), /* @__PURE__ */ React.createElement("td", { className: "calc-value" }, fmtEur(breakdown.carPrice))), /* @__PURE__ */ React.createElement("tr", { className: "cost-row--tax" }, /* @__PURE__ */ React.createElement("td", { className: "cost-table__label" }, t2("calc.vrt"), /* @__PURE__ */ React.createElement("span", { className: "calc-rate", style: { color: "var(--color-text-muted)", fontSize: 12 } }, "(", (breakdown.vrtRate * 100).toFixed(0), "%)")), /* @__PURE__ */ React.createElement("td", { className: "calc-value" }, fmtEur(breakdown.vrtAmount))), /* @__PURE__ */ React.createElement("tr", { className: breakdown.customsDuty === 0 ? "cost-row--free" : "cost-row--tax" }, /* @__PURE__ */ React.createElement("td", { className: "cost-table__label" }, t2("calc.customs"), " (6.5%)", breakdown.isClassic && /* @__PURE__ */ React.createElement("span", { className: "calc-rate", style: { fontSize: 12, color: "var(--color-success-text)" } }, "\u2713 exempt")), /* @__PURE__ */ React.createElement("td", { className: "calc-value" }, fmtEur(breakdown.customsDuty))), /* @__PURE__ */ React.createElement("tr", { className: "cost-row--tax" }, /* @__PURE__ */ React.createElement("td", { className: "cost-table__label" }, t2("calc.vat"), /* @__PURE__ */ React.createElement("span", { className: "calc-rate", style: { color: "var(--color-text-muted)", fontSize: 12 } }, "(23%)")), /* @__PURE__ */ React.createElement("td", { className: "calc-value" }, fmtEur(breakdown.vatAmount))), /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { className: "cost-table__label" }, t2("calc.nox")), /* @__PURE__ */ React.createElement("td", { className: "calc-value" }, fmtEur(breakdown.noxLevy))), /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { className: "cost-table__label" }, t2("calc.shippingLine")), /* @__PURE__ */ React.createElement("td", { className: "calc-value" }, fmtEur(breakdown.shippingCost))), /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { className: "cost-table__label" }, t2("calc.otherCosts")), /* @__PURE__ */ React.createElement("td", { className: "calc-value" }, fmtEur(breakdown.miscCosts))), /* @__PURE__ */ React.createElement("tr", { className: "cost-row--total" }, /* @__PURE__ */ React.createElement("td", { style: { fontWeight: 600, color: "var(--color-text-primary)" } }, t2("calc.total")), /* @__PURE__ */ React.createElement("td", { className: "calc-value" }, fmtEur(breakdown.totalLanded)))))), margin && /* @__PURE__ */ React.createElement("div", { className: `alert ${verdictStyle[margin.verdict]?.class}`, style: { marginTop: "var(--space-4)" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 24, marginRight: 8 } }, verdictStyle[margin.verdict]?.icon), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", { style: { display: "block", marginBottom: 4 } }, t2(`calc.${margin.verdict}`)), /* @__PURE__ */ React.createElement("span", null, t2("calc.potential"), ": ", margin.profit >= 0 ? "+" : "", fmtEur(margin.profit), " (", margin.margin, "%) vs IE avg"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-3)", marginTop: "var(--space-5)" } }, breakdown.isClassic && /* @__PURE__ */ React.createElement("div", { className: "alert alert--success" }, /* @__PURE__ */ React.createElement("svg", { className: "alert__icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" })), /* @__PURE__ */ React.createElement("span", null, t2("calc.classicNote") || "Classic cars (30y+) are exempt from customs duty when imported from Ukraine.")), /* @__PURE__ */ React.createElement("div", { className: "alert alert--warning" }, /* @__PURE__ */ React.createElement("svg", { className: "alert__icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }), /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "9", x2: "12", y2: "13" }), /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })), /* @__PURE__ */ React.createElement("span", null, t2("calc.vrtNote") || "VRT is assessed by Revenue on OMSP \u2014 always verify at", " ", /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "https://www.revenue.ie/en/importing-vehicles-duty-free-allowances/guide-to-vrt/index.aspx",
      target: "_blank",
      rel: "noopener noreferrer"
    },
    "revenue.ie/vrt"
  ))))));
}

// src/components/PriceStats.jsx
var import_react_i18next5 = require("react-i18next");
var import_recharts = require("recharts");
function PriceStats({ stats, title }) {
  const { t: t2 } = (0, import_react_i18next5.useTranslation)();
  if (!stats) return null;
  const metrics = [
    { key: "min", label: t2("stats.min") || "Min Price", value: stats.min },
    { key: "avg", label: t2("stats.avg") || "Avg Price", value: stats.avgFiltered || stats.avg },
    { key: "median", label: t2("stats.median") || "Median", value: stats.median },
    { key: "max", label: t2("stats.max") || "Max Price", value: stats.max }
  ];
  const chartData = stats.prices.map((price, idx) => ({
    name: `#${idx + 1}`,
    price
  }));
  const avg = stats.avgFiltered || stats.avg;
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)", padding: "8px 12px", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", boxShadow: "var(--shadow-floating)" } }, /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontWeight: 600, color: "var(--color-text-primary)" } }, "\u20AC", payload[0].value.toLocaleString()));
    }
    return null;
  };
  return /* @__PURE__ */ React.createElement("div", { className: "search-main", style: { marginBottom: "var(--space-6)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-4)" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)", margin: 0, color: "var(--color-text-primary)" } }, "\u{1F4CA} ", title || t2("stats.title")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "var(--text-sm)", color: "var(--color-text-muted)", margin: "4px 0 0" } }, t2("stats.count", { count: stats.count })))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "var(--space-3)", marginBottom: "var(--space-5)" } }, metrics.map((m) => /* @__PURE__ */ React.createElement("div", { key: m.key, style: { background: "var(--color-bg-subtle)", borderRadius: "var(--radius-lg)", padding: "var(--space-3)" } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: 4 } }, m.label), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "var(--text-xl)", fontWeight: "var(--weight-semibold)", color: "var(--color-text-primary)" } }, "\u20AC", m.value?.toLocaleString() || "\u2014")))), stats.outliers?.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "alert alert--danger", style: { marginBottom: "var(--space-4)" } }, /* @__PURE__ */ React.createElement("svg", { className: "alert__icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }), /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "9", x2: "12", y2: "13" }), /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })), /* @__PURE__ */ React.createElement("span", null, stats.outliers.length, " outlier(s) excluded from the average calculation.")), chartData.length > 1 && /* @__PURE__ */ React.createElement("div", { style: { height: 160, width: "100%", marginTop: "var(--space-5)" } }, /* @__PURE__ */ React.createElement(import_recharts.ResponsiveContainer, { width: "100%", height: "100%" }, /* @__PURE__ */ React.createElement(import_recharts.BarChart, { data: chartData, margin: { top: 10, right: 10, left: -20, bottom: 0 } }, /* @__PURE__ */ React.createElement(import_recharts.XAxis, { dataKey: "name", hide: true }), /* @__PURE__ */ React.createElement(import_recharts.YAxis, { tick: { fontSize: 11, fill: "var(--color-text-muted)" }, axisLine: false, tickLine: false, tickFormatter: (v) => `\u20AC${v}` }), /* @__PURE__ */ React.createElement(import_recharts.Tooltip, { content: /* @__PURE__ */ React.createElement(CustomTooltip, null), cursor: { fill: "rgba(150,150,150,0.1)" } }), /* @__PURE__ */ React.createElement(import_recharts.ReferenceLine, { y: avg, stroke: "var(--color-text-muted)", strokeDasharray: "3 3" }), /* @__PURE__ */ React.createElement(import_recharts.Bar, { dataKey: "price", radius: [4, 4, 0, 0] }, chartData.map((entry, index) => /* @__PURE__ */ React.createElement(import_recharts.Cell, { key: `cell-${index}`, fill: entry.price <= avg ? "var(--color-success)" : "var(--color-warning)" }))))), /* @__PURE__ */ React.createElement("p", { style: { textAlign: "center", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: 4 } }, "Listings ordered by price (Lowest to Highest)")));
}

// src/components/IrishMarketPanel.jsx
var import_react4 = require("react");
var import_react_i18next7 = require("react-i18next");

// src/components/CompareBar.jsx
var import_react_i18next6 = require("react-i18next");
var import_recharts2 = require("recharts");
function CompareBar({ uaAvg, ieAvg }) {
  const { t: t2 } = (0, import_react_i18next6.useTranslation)();
  if (!uaAvg || !ieAvg) return null;
  const data = [
    { name: t2("compare.uaAvg") || "UA Avg", price: uaAvg, fill: "var(--color-ua)" },
    { name: t2("compare.ieAvg") || "IE Avg", price: ieAvg, fill: "var(--color-ie)" }
  ];
  const diff = ieAvg - uaAvg;
  const isSaving = diff > 0;
  const diffPct = Math.abs(Math.round(diff / uaAvg * 100));
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)", padding: "8px 12px", borderRadius: "var(--radius-md)", fontSize: "var(--text-sm)", boxShadow: "var(--shadow-floating)" } }, /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontWeight: 600, color: "var(--color-text-primary)" } }, payload[0].payload.name, ": \u20AC", payload[0].value.toLocaleString()));
    }
    return null;
  };
  return /* @__PURE__ */ React.createElement("div", { style: { marginTop: "var(--space-6)", paddingTop: "var(--space-6)", borderTop: "1px solid var(--color-border)" } }, /* @__PURE__ */ React.createElement("h4", { style: { fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--color-text-primary)", marginBottom: "var(--space-3)" } }, "\u2696\uFE0F ", t2("compare.title") || "Market Comparison"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" } }, /* @__PURE__ */ React.createElement("div", { className: isSaving ? "alert alert--success" : "alert alert--danger", style: { width: "100%", display: "block" } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: "var(--text-sm)", marginBottom: 2, fontWeight: "var(--weight-medium)" } }, isSaving ? t2("compare.saving") || "Potential savings" : t2("compare.premium") || "Premium paid"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", margin: 0 } }, "\u20AC", Math.abs(diff).toLocaleString(), " ", /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)" } }, "(", diffPct, "%)")))), /* @__PURE__ */ React.createElement("div", { style: { height: 100, width: "100%" } }, /* @__PURE__ */ React.createElement(import_recharts2.ResponsiveContainer, { width: "100%", height: "100%" }, /* @__PURE__ */ React.createElement(import_recharts2.BarChart, { data, layout: "vertical", margin: { top: 0, right: 30, left: 0, bottom: 0 } }, /* @__PURE__ */ React.createElement(import_recharts2.XAxis, { type: "number", hide: true }), /* @__PURE__ */ React.createElement(import_recharts2.YAxis, { dataKey: "name", type: "category", axisLine: false, tickLine: false, tick: { fontSize: 12, fontWeight: 500, fill: "var(--color-text-muted)" }, width: 90 }), /* @__PURE__ */ React.createElement(import_recharts2.Tooltip, { content: /* @__PURE__ */ React.createElement(CustomTooltip, null), cursor: { fill: "rgba(150,150,150,0.1)" } }), /* @__PURE__ */ React.createElement(import_recharts2.Bar, { dataKey: "price", radius: [0, 4, 4, 0], barSize: 24 }, data.map((entry, index) => /* @__PURE__ */ React.createElement(import_recharts2.Cell, { key: `cell-${index}`, fill: entry.fill })))))));
}

// src/components/IrishMarketPanel.jsx
function IrishMarketPanel({ onChange, modelName, irishData, uaStats }) {
  const { t: t2 } = (0, import_react_i18next7.useTranslation)();
  const [min, setMin] = (0, import_react4.useState)("");
  const [avg, setAvg] = (0, import_react4.useState)("");
  const [max, setMax] = (0, import_react4.useState)("");
  const [showManual, setShowManual] = (0, import_react4.useState)(true);
  (0, import_react4.useEffect)(() => {
    if (irishData?.stats) {
      const s = irishData.stats;
      setMin(String(s.min || ""));
      setAvg(String(s.avg || ""));
      setMax(String(s.max || ""));
      onChange?.({ min: s.min, avg: s.avg, max: s.max });
    }
  }, [irishData]);
  const handleManualUpdate = (field, val) => {
    const next = {
      min: Number(field === "min" ? val : min) || 0,
      avg: Number(field === "avg" ? val : avg) || 0,
      max: Number(field === "max" ? val : max) || 0
    };
    if (field === "min") setMin(val);
    if (field === "avg") setAvg(val);
    if (field === "max") setMax(val);
    onChange?.(next);
  };
  const listings = irishData?.listings || [];
  const stats = irishData?.stats;
  const doneDealUrl = modelName ? `https://www.donedeal.ie/cars?q=${encodeURIComponent(modelName)}` : "https://www.donedeal.ie/cars";
  return /* @__PURE__ */ React.createElement("div", { className: "search-main", style: { marginBottom: "var(--space-6)" } }, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)", marginBottom: "var(--space-4)", color: "var(--color-text-primary)" } }, "\u{1F1EE}\u{1F1EA} ", t2("ireland.title")), stats && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "var(--space-4)" } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: "var(--text-sm)", color: "var(--color-success-text)", marginBottom: "var(--space-3)" } }, "\u2705 ", t2("ireland.found", { count: stats.count })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-3)" } }, [
    { label: t2("ireland.minPrice"), value: stats.min },
    { label: t2("ireland.avgPrice"), value: stats.avg },
    { label: t2("ireland.maxPrice"), value: stats.max }
  ].map((m) => /* @__PURE__ */ React.createElement("div", { key: m.label, className: "alert alert--success", style: { padding: "var(--space-3)", textAlign: "center", display: "block" } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: "var(--text-xs)", color: "var(--color-success-text)", marginBottom: 2 } }, m.label), /* @__PURE__ */ React.createElement("p", { style: { fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)", color: "var(--color-success-text)" } }, "\u20AC", m.value?.toLocaleString() || "\u2014"))))), listings.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "var(--space-4)" } }, /* @__PURE__ */ React.createElement("div", { style: {
    maxHeight: 200,
    overflowY: "auto",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--color-border)"
  } }, listings.slice(0, 8).map((l, i) => /* @__PURE__ */ React.createElement(
    "a",
    {
      key: l.id || i,
      href: l.sourceUrl,
      target: "_blank",
      rel: "noreferrer",
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 12px",
        borderBottom: "1px solid var(--color-border)",
        textDecoration: "none",
        color: "var(--color-text-primary)",
        fontSize: "var(--text-sm)",
        transition: "background .1s"
      },
      onMouseEnter: (e) => e.currentTarget.style.background = "var(--color-bg-subtle)",
      onMouseLeave: (e) => e.currentTarget.style.background = "transparent"
    },
    /* @__PURE__ */ React.createElement("span", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, l.make, " ", l.model, " ", l.year || ""),
    /* @__PURE__ */ React.createElement("span", { style: { fontWeight: "var(--weight-semibold)", color: "var(--color-success)", marginLeft: 10 } }, "\u20AC", l.priceEur?.toLocaleString() || "\u2014"),
    /* @__PURE__ */ React.createElement("span", { style: { fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginLeft: 8 } }, l.location, " \u2197")
  )))), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setShowManual((prev) => !prev),
      style: {
        fontSize: "var(--text-sm)",
        color: "var(--color-accent)",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        marginBottom: "var(--space-4)",
        textDecoration: "underline"
      }
    },
    showManual ? t2("ireland.hideManual") : t2("ireland.showManual")
  ), showManual && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-3)" } }, /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field__label" }, t2("ireland.minPrice")), /* @__PURE__ */ React.createElement("input", { type: "number", className: "input", value: min, onChange: (e) => handleManualUpdate("min", e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field__label" }, t2("ireland.avgPrice")), /* @__PURE__ */ React.createElement("input", { type: "number", className: "input", value: avg, onChange: (e) => handleManualUpdate("avg", e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "field" }, /* @__PURE__ */ React.createElement("label", { className: "field__label" }, t2("ireland.maxPrice")), /* @__PURE__ */ React.createElement("input", { type: "number", className: "input", value: max, onChange: (e) => handleManualUpdate("max", e.target.value) }))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "var(--space-4)" } }, /* @__PURE__ */ React.createElement("a", { href: doneDealUrl, target: "_blank", rel: "noreferrer", className: "btn btn-secondary btn-sm" }, t2("ireland.viewDoneDeal"), " \u2197")), /* @__PURE__ */ React.createElement(
    CompareBar,
    {
      uaAvg: uaStats?.avgFiltered || uaStats?.avg,
      ieAvg: Number(avg)
    }
  ));
}

// node_modules/i18next/dist/esm/i18next.js
var isString = (obj) => typeof obj === "string";
var defer = () => {
  let res;
  let rej;
  const promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });
  promise.resolve = res;
  promise.reject = rej;
  return promise;
};
var makeString = (object) => {
  if (object == null) return "";
  return "" + object;
};
var copy = (a, s, t2) => {
  a.forEach((m) => {
    if (s[m]) t2[m] = s[m];
  });
};
var lastOfPathSeparatorRegExp = /###/g;
var cleanKey = (key) => key && key.indexOf("###") > -1 ? key.replace(lastOfPathSeparatorRegExp, ".") : key;
var canNotTraverseDeeper = (object) => !object || isString(object);
var getLastOfPath = (object, path, Empty) => {
  const stack = !isString(path) ? path : path.split(".");
  let stackIndex = 0;
  while (stackIndex < stack.length - 1) {
    if (canNotTraverseDeeper(object)) return {};
    const key = cleanKey(stack[stackIndex]);
    if (!object[key] && Empty) object[key] = new Empty();
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      object = object[key];
    } else {
      object = {};
    }
    ++stackIndex;
  }
  if (canNotTraverseDeeper(object)) return {};
  return {
    obj: object,
    k: cleanKey(stack[stackIndex])
  };
};
var setPath = (object, path, newValue) => {
  const {
    obj,
    k
  } = getLastOfPath(object, path, Object);
  if (obj !== void 0 || path.length === 1) {
    obj[k] = newValue;
    return;
  }
  let e = path[path.length - 1];
  let p = path.slice(0, path.length - 1);
  let last = getLastOfPath(object, p, Object);
  while (last.obj === void 0 && p.length) {
    e = `${p[p.length - 1]}.${e}`;
    p = p.slice(0, p.length - 1);
    last = getLastOfPath(object, p, Object);
    if (last && last.obj && typeof last.obj[`${last.k}.${e}`] !== "undefined") {
      last.obj = void 0;
    }
  }
  last.obj[`${last.k}.${e}`] = newValue;
};
var pushPath = (object, path, newValue, concat) => {
  const {
    obj,
    k
  } = getLastOfPath(object, path, Object);
  obj[k] = obj[k] || [];
  obj[k].push(newValue);
};
var getPath = (object, path) => {
  const {
    obj,
    k
  } = getLastOfPath(object, path);
  if (!obj) return void 0;
  return obj[k];
};
var getPathWithDefaults = (data, defaultData, key) => {
  const value = getPath(data, key);
  if (value !== void 0) {
    return value;
  }
  return getPath(defaultData, key);
};
var deepExtend = (target, source, overwrite) => {
  for (const prop in source) {
    if (prop !== "__proto__" && prop !== "constructor") {
      if (prop in target) {
        if (isString(target[prop]) || target[prop] instanceof String || isString(source[prop]) || source[prop] instanceof String) {
          if (overwrite) target[prop] = source[prop];
        } else {
          deepExtend(target[prop], source[prop], overwrite);
        }
      } else {
        target[prop] = source[prop];
      }
    }
  }
  return target;
};
var regexEscape = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var _entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};
var escape = (data) => {
  if (isString(data)) {
    return data.replace(/[&<>"'\/]/g, (s) => _entityMap[s]);
  }
  return data;
};
var RegExpCache = class {
  constructor(capacity) {
    this.capacity = capacity;
    this.regExpMap = /* @__PURE__ */ new Map();
    this.regExpQueue = [];
  }
  getRegExp(pattern) {
    const regExpFromCache = this.regExpMap.get(pattern);
    if (regExpFromCache !== void 0) {
      return regExpFromCache;
    }
    const regExpNew = new RegExp(pattern);
    if (this.regExpQueue.length === this.capacity) {
      this.regExpMap.delete(this.regExpQueue.shift());
    }
    this.regExpMap.set(pattern, regExpNew);
    this.regExpQueue.push(pattern);
    return regExpNew;
  }
};
var chars = [" ", ",", "?", "!", ";"];
var looksLikeObjectPathRegExpCache = new RegExpCache(20);
var looksLikeObjectPath = (key, nsSeparator, keySeparator) => {
  nsSeparator = nsSeparator || "";
  keySeparator = keySeparator || "";
  const possibleChars = chars.filter((c) => nsSeparator.indexOf(c) < 0 && keySeparator.indexOf(c) < 0);
  if (possibleChars.length === 0) return true;
  const r = looksLikeObjectPathRegExpCache.getRegExp(`(${possibleChars.map((c) => c === "?" ? "\\?" : c).join("|")})`);
  let matched = !r.test(key);
  if (!matched) {
    const ki = key.indexOf(keySeparator);
    if (ki > 0 && !r.test(key.substring(0, ki))) {
      matched = true;
    }
  }
  return matched;
};
var deepFind = function(obj, path) {
  let keySeparator = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ".";
  if (!obj) return void 0;
  if (obj[path]) return obj[path];
  const tokens = path.split(keySeparator);
  let current = obj;
  for (let i = 0; i < tokens.length; ) {
    if (!current || typeof current !== "object") {
      return void 0;
    }
    let next;
    let nextPath = "";
    for (let j = i; j < tokens.length; ++j) {
      if (j !== i) {
        nextPath += keySeparator;
      }
      nextPath += tokens[j];
      next = current[nextPath];
      if (next !== void 0) {
        if (["string", "number", "boolean"].indexOf(typeof next) > -1 && j < tokens.length - 1) {
          continue;
        }
        i += j - i + 1;
        break;
      }
    }
    current = next;
  }
  return current;
};
var getCleanedCode = (code) => code && code.replace("_", "-");
var consoleLogger = {
  type: "logger",
  log(args) {
    this.output("log", args);
  },
  warn(args) {
    this.output("warn", args);
  },
  error(args) {
    this.output("error", args);
  },
  output(type, args) {
    if (console && console[type]) console[type].apply(console, args);
  }
};
var Logger = class _Logger {
  constructor(concreteLogger) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.init(concreteLogger, options);
  }
  init(concreteLogger) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.prefix = options.prefix || "i18next:";
    this.logger = concreteLogger || consoleLogger;
    this.options = options;
    this.debug = options.debug;
  }
  log() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return this.forward(args, "log", "", true);
  }
  warn() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return this.forward(args, "warn", "", true);
  }
  error() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return this.forward(args, "error", "");
  }
  deprecate() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return this.forward(args, "warn", "WARNING DEPRECATED: ", true);
  }
  forward(args, lvl, prefix, debugOnly) {
    if (debugOnly && !this.debug) return null;
    if (isString(args[0])) args[0] = `${prefix}${this.prefix} ${args[0]}`;
    return this.logger[lvl](args);
  }
  create(moduleName) {
    return new _Logger(this.logger, {
      ...{
        prefix: `${this.prefix}:${moduleName}:`
      },
      ...this.options
    });
  }
  clone(options) {
    options = options || this.options;
    options.prefix = options.prefix || this.prefix;
    return new _Logger(this.logger, options);
  }
};
var baseLogger = new Logger();
var EventEmitter = class {
  constructor() {
    this.observers = {};
  }
  on(events, listener) {
    events.split(" ").forEach((event) => {
      if (!this.observers[event]) this.observers[event] = /* @__PURE__ */ new Map();
      const numListeners = this.observers[event].get(listener) || 0;
      this.observers[event].set(listener, numListeners + 1);
    });
    return this;
  }
  off(event, listener) {
    if (!this.observers[event]) return;
    if (!listener) {
      delete this.observers[event];
      return;
    }
    this.observers[event].delete(listener);
  }
  emit(event) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    if (this.observers[event]) {
      const cloned = Array.from(this.observers[event].entries());
      cloned.forEach((_ref) => {
        let [observer, numTimesAdded] = _ref;
        for (let i = 0; i < numTimesAdded; i++) {
          observer(...args);
        }
      });
    }
    if (this.observers["*"]) {
      const cloned = Array.from(this.observers["*"].entries());
      cloned.forEach((_ref2) => {
        let [observer, numTimesAdded] = _ref2;
        for (let i = 0; i < numTimesAdded; i++) {
          observer.apply(observer, [event, ...args]);
        }
      });
    }
  }
};
var ResourceStore = class extends EventEmitter {
  constructor(data) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      ns: ["translation"],
      defaultNS: "translation"
    };
    super();
    this.data = data || {};
    this.options = options;
    if (this.options.keySeparator === void 0) {
      this.options.keySeparator = ".";
    }
    if (this.options.ignoreJSONStructure === void 0) {
      this.options.ignoreJSONStructure = true;
    }
  }
  addNamespaces(ns) {
    if (this.options.ns.indexOf(ns) < 0) {
      this.options.ns.push(ns);
    }
  }
  removeNamespaces(ns) {
    const index = this.options.ns.indexOf(ns);
    if (index > -1) {
      this.options.ns.splice(index, 1);
    }
  }
  getResource(lng, ns, key) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    const ignoreJSONStructure = options.ignoreJSONStructure !== void 0 ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let path;
    if (lng.indexOf(".") > -1) {
      path = lng.split(".");
    } else {
      path = [lng, ns];
      if (key) {
        if (Array.isArray(key)) {
          path.push(...key);
        } else if (isString(key) && keySeparator) {
          path.push(...key.split(keySeparator));
        } else {
          path.push(key);
        }
      }
    }
    const result = getPath(this.data, path);
    if (!result && !ns && !key && lng.indexOf(".") > -1) {
      lng = path[0];
      ns = path[1];
      key = path.slice(2).join(".");
    }
    if (result || !ignoreJSONStructure || !isString(key)) return result;
    return deepFind(this.data && this.data[lng] && this.data[lng][ns], key, keySeparator);
  }
  addResource(lng, ns, key, value) {
    let options = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
      silent: false
    };
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    let path = [lng, ns];
    if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);
    if (lng.indexOf(".") > -1) {
      path = lng.split(".");
      value = ns;
      ns = path[1];
    }
    this.addNamespaces(ns);
    setPath(this.data, path, value);
    if (!options.silent) this.emit("added", lng, ns, key, value);
  }
  addResources(lng, ns, resources) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {
      silent: false
    };
    for (const m in resources) {
      if (isString(resources[m]) || Array.isArray(resources[m])) this.addResource(lng, ns, m, resources[m], {
        silent: true
      });
    }
    if (!options.silent) this.emit("added", lng, ns, resources);
  }
  addResourceBundle(lng, ns, resources, deep, overwrite) {
    let options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {
      silent: false,
      skipCopy: false
    };
    let path = [lng, ns];
    if (lng.indexOf(".") > -1) {
      path = lng.split(".");
      deep = resources;
      resources = ns;
      ns = path[1];
    }
    this.addNamespaces(ns);
    let pack = getPath(this.data, path) || {};
    if (!options.skipCopy) resources = JSON.parse(JSON.stringify(resources));
    if (deep) {
      deepExtend(pack, resources, overwrite);
    } else {
      pack = {
        ...pack,
        ...resources
      };
    }
    setPath(this.data, path, pack);
    if (!options.silent) this.emit("added", lng, ns, resources);
  }
  removeResourceBundle(lng, ns) {
    if (this.hasResourceBundle(lng, ns)) {
      delete this.data[lng][ns];
    }
    this.removeNamespaces(ns);
    this.emit("removed", lng, ns);
  }
  hasResourceBundle(lng, ns) {
    return this.getResource(lng, ns) !== void 0;
  }
  getResourceBundle(lng, ns) {
    if (!ns) ns = this.options.defaultNS;
    if (this.options.compatibilityAPI === "v1") return {
      ...{},
      ...this.getResource(lng, ns)
    };
    return this.getResource(lng, ns);
  }
  getDataByLanguage(lng) {
    return this.data[lng];
  }
  hasLanguageSomeTranslations(lng) {
    const data = this.getDataByLanguage(lng);
    const n = data && Object.keys(data) || [];
    return !!n.find((v) => data[v] && Object.keys(data[v]).length > 0);
  }
  toJSON() {
    return this.data;
  }
};
var postProcessor = {
  processors: {},
  addPostProcessor(module2) {
    this.processors[module2.name] = module2;
  },
  handle(processors, value, key, options, translator) {
    processors.forEach((processor) => {
      if (this.processors[processor]) value = this.processors[processor].process(value, key, options, translator);
    });
    return value;
  }
};
var checkedLoadedFor = {};
var Translator = class _Translator extends EventEmitter {
  constructor(services) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super();
    copy(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], services, this);
    this.options = options;
    if (this.options.keySeparator === void 0) {
      this.options.keySeparator = ".";
    }
    this.logger = baseLogger.create("translator");
  }
  changeLanguage(lng) {
    if (lng) this.language = lng;
  }
  exists(key) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      interpolation: {}
    };
    if (key === void 0 || key === null) {
      return false;
    }
    const resolved = this.resolve(key, options);
    return resolved && resolved.res !== void 0;
  }
  extractFromKey(key, options) {
    let nsSeparator = options.nsSeparator !== void 0 ? options.nsSeparator : this.options.nsSeparator;
    if (nsSeparator === void 0) nsSeparator = ":";
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    let namespaces = options.ns || this.options.defaultNS || [];
    const wouldCheckForNsInKey = nsSeparator && key.indexOf(nsSeparator) > -1;
    const seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !options.keySeparator && !this.options.userDefinedNsSeparator && !options.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);
    if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
      const m = key.match(this.interpolator.nestingRegexp);
      if (m && m.length > 0) {
        return {
          key,
          namespaces: isString(namespaces) ? [namespaces] : namespaces
        };
      }
      const parts = key.split(nsSeparator);
      if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
      key = parts.join(keySeparator);
    }
    return {
      key,
      namespaces: isString(namespaces) ? [namespaces] : namespaces
    };
  }
  translate(keys, options, lastKey) {
    if (typeof options !== "object" && this.options.overloadTranslationOptionHandler) {
      options = this.options.overloadTranslationOptionHandler(arguments);
    }
    if (typeof options === "object") options = {
      ...options
    };
    if (!options) options = {};
    if (keys === void 0 || keys === null) return "";
    if (!Array.isArray(keys)) keys = [String(keys)];
    const returnDetails = options.returnDetails !== void 0 ? options.returnDetails : this.options.returnDetails;
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    const {
      key,
      namespaces
    } = this.extractFromKey(keys[keys.length - 1], options);
    const namespace = namespaces[namespaces.length - 1];
    const lng = options.lng || this.language;
    const appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if (lng && lng.toLowerCase() === "cimode") {
      if (appendNamespaceToCIMode) {
        const nsSeparator = options.nsSeparator || this.options.nsSeparator;
        if (returnDetails) {
          return {
            res: `${namespace}${nsSeparator}${key}`,
            usedKey: key,
            exactUsedKey: key,
            usedLng: lng,
            usedNS: namespace,
            usedParams: this.getUsedParamsDetails(options)
          };
        }
        return `${namespace}${nsSeparator}${key}`;
      }
      if (returnDetails) {
        return {
          res: key,
          usedKey: key,
          exactUsedKey: key,
          usedLng: lng,
          usedNS: namespace,
          usedParams: this.getUsedParamsDetails(options)
        };
      }
      return key;
    }
    const resolved = this.resolve(keys, options);
    let res = resolved && resolved.res;
    const resUsedKey = resolved && resolved.usedKey || key;
    const resExactUsedKey = resolved && resolved.exactUsedKey || key;
    const resType = Object.prototype.toString.apply(res);
    const noObject = ["[object Number]", "[object Function]", "[object RegExp]"];
    const joinArrays = options.joinArrays !== void 0 ? options.joinArrays : this.options.joinArrays;
    const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
    const handleAsObject = !isString(res) && typeof res !== "boolean" && typeof res !== "number";
    if (handleAsObjectInI18nFormat && res && handleAsObject && noObject.indexOf(resType) < 0 && !(isString(joinArrays) && Array.isArray(res))) {
      if (!options.returnObjects && !this.options.returnObjects) {
        if (!this.options.returnedObjectHandler) {
          this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        }
        const r = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, res, {
          ...options,
          ns: namespaces
        }) : `key '${key} (${this.language})' returned an object instead of string.`;
        if (returnDetails) {
          resolved.res = r;
          resolved.usedParams = this.getUsedParamsDetails(options);
          return resolved;
        }
        return r;
      }
      if (keySeparator) {
        const resTypeIsArray = Array.isArray(res);
        const copy2 = resTypeIsArray ? [] : {};
        const newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
        for (const m in res) {
          if (Object.prototype.hasOwnProperty.call(res, m)) {
            const deepKey = `${newKeyToUse}${keySeparator}${m}`;
            copy2[m] = this.translate(deepKey, {
              ...options,
              ...{
                joinArrays: false,
                ns: namespaces
              }
            });
            if (copy2[m] === deepKey) copy2[m] = res[m];
          }
        }
        res = copy2;
      }
    } else if (handleAsObjectInI18nFormat && isString(joinArrays) && Array.isArray(res)) {
      res = res.join(joinArrays);
      if (res) res = this.extendTranslation(res, keys, options, lastKey);
    } else {
      let usedDefault = false;
      let usedKey = false;
      const needsPluralHandling = options.count !== void 0 && !isString(options.count);
      const hasDefaultValue = _Translator.hasDefaultValue(options);
      const defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, options) : "";
      const defaultValueSuffixOrdinalFallback = options.ordinal && needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, {
        ordinal: false
      }) : "";
      const needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0 && this.pluralResolver.shouldUseIntlApi();
      const defaultValue = needsZeroSuffixLookup && options[`defaultValue${this.options.pluralSeparator}zero`] || options[`defaultValue${defaultValueSuffix}`] || options[`defaultValue${defaultValueSuffixOrdinalFallback}`] || options.defaultValue;
      if (!this.isValidLookup(res) && hasDefaultValue) {
        usedDefault = true;
        res = defaultValue;
      }
      if (!this.isValidLookup(res)) {
        usedKey = true;
        res = key;
      }
      const missingKeyNoValueFallbackToKey = options.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey;
      const resForMissing = missingKeyNoValueFallbackToKey && usedKey ? void 0 : res;
      const updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
      if (usedKey || usedDefault || updateMissing) {
        this.logger.log(updateMissing ? "updateKey" : "missingKey", lng, namespace, key, updateMissing ? defaultValue : res);
        if (keySeparator) {
          const fk = this.resolve(key, {
            ...options,
            keySeparator: false
          });
          if (fk && fk.res) this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
        }
        let lngs = [];
        const fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);
        if (this.options.saveMissingTo === "fallback" && fallbackLngs && fallbackLngs[0]) {
          for (let i = 0; i < fallbackLngs.length; i++) {
            lngs.push(fallbackLngs[i]);
          }
        } else if (this.options.saveMissingTo === "all") {
          lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
        } else {
          lngs.push(options.lng || this.language);
        }
        const send = (l, k, specificDefaultValue) => {
          const defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
          if (this.options.missingKeyHandler) {
            this.options.missingKeyHandler(l, namespace, k, defaultForMissing, updateMissing, options);
          } else if (this.backendConnector && this.backendConnector.saveMissing) {
            this.backendConnector.saveMissing(l, namespace, k, defaultForMissing, updateMissing, options);
          }
          this.emit("missingKey", l, namespace, k, res);
        };
        if (this.options.saveMissing) {
          if (this.options.saveMissingPlurals && needsPluralHandling) {
            lngs.forEach((language) => {
              const suffixes = this.pluralResolver.getSuffixes(language, options);
              if (needsZeroSuffixLookup && options[`defaultValue${this.options.pluralSeparator}zero`] && suffixes.indexOf(`${this.options.pluralSeparator}zero`) < 0) {
                suffixes.push(`${this.options.pluralSeparator}zero`);
              }
              suffixes.forEach((suffix) => {
                send([language], key + suffix, options[`defaultValue${suffix}`] || defaultValue);
              });
            });
          } else {
            send(lngs, key, defaultValue);
          }
        }
      }
      res = this.extendTranslation(res, keys, options, resolved, lastKey);
      if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = `${namespace}:${key}`;
      if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
        if (this.options.compatibilityAPI !== "v1") {
          res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${namespace}:${key}` : key, usedDefault ? res : void 0);
        } else {
          res = this.options.parseMissingKeyHandler(res);
        }
      }
    }
    if (returnDetails) {
      resolved.res = res;
      resolved.usedParams = this.getUsedParamsDetails(options);
      return resolved;
    }
    return res;
  }
  extendTranslation(res, key, options, resolved, lastKey) {
    var _this = this;
    if (this.i18nFormat && this.i18nFormat.parse) {
      res = this.i18nFormat.parse(res, {
        ...this.options.interpolation.defaultVariables,
        ...options
      }, options.lng || this.language || resolved.usedLng, resolved.usedNS, resolved.usedKey, {
        resolved
      });
    } else if (!options.skipInterpolation) {
      if (options.interpolation) this.interpolator.init({
        ...options,
        ...{
          interpolation: {
            ...this.options.interpolation,
            ...options.interpolation
          }
        }
      });
      const skipOnVariables = isString(res) && (options && options.interpolation && options.interpolation.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let nestBef;
      if (skipOnVariables) {
        const nb = res.match(this.interpolator.nestingRegexp);
        nestBef = nb && nb.length;
      }
      let data = options.replace && !isString(options.replace) ? options.replace : options;
      if (this.options.interpolation.defaultVariables) data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
      res = this.interpolator.interpolate(res, data, options.lng || this.language || resolved.usedLng, options);
      if (skipOnVariables) {
        const na = res.match(this.interpolator.nestingRegexp);
        const nestAft = na && na.length;
        if (nestBef < nestAft) options.nest = false;
      }
      if (!options.lng && this.options.compatibilityAPI !== "v1" && resolved && resolved.res) options.lng = this.language || resolved.usedLng;
      if (options.nest !== false) res = this.interpolator.nest(res, function() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        if (lastKey && lastKey[0] === args[0] && !options.context) {
          _this.logger.warn(`It seems you are nesting recursively key: ${args[0]} in key: ${key[0]}`);
          return null;
        }
        return _this.translate(...args, key);
      }, options);
      if (options.interpolation) this.interpolator.reset();
    }
    const postProcess = options.postProcess || this.options.postProcess;
    const postProcessorNames = isString(postProcess) ? [postProcess] : postProcess;
    if (res !== void 0 && res !== null && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) {
      res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? {
        i18nResolved: {
          ...resolved,
          usedParams: this.getUsedParamsDetails(options)
        },
        ...options
      } : options, this);
    }
    return res;
  }
  resolve(keys) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let found;
    let usedKey;
    let exactUsedKey;
    let usedLng;
    let usedNS;
    if (isString(keys)) keys = [keys];
    keys.forEach((k) => {
      if (this.isValidLookup(found)) return;
      const extracted = this.extractFromKey(k, options);
      const key = extracted.key;
      usedKey = key;
      let namespaces = extracted.namespaces;
      if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);
      const needsPluralHandling = options.count !== void 0 && !isString(options.count);
      const needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0 && this.pluralResolver.shouldUseIntlApi();
      const needsContextHandling = options.context !== void 0 && (isString(options.context) || typeof options.context === "number") && options.context !== "";
      const codes = options.lngs ? options.lngs : this.languageUtils.toResolveHierarchy(options.lng || this.language, options.fallbackLng);
      namespaces.forEach((ns) => {
        if (this.isValidLookup(found)) return;
        usedNS = ns;
        if (!checkedLoadedFor[`${codes[0]}-${ns}`] && this.utils && this.utils.hasLoadedNamespace && !this.utils.hasLoadedNamespace(usedNS)) {
          checkedLoadedFor[`${codes[0]}-${ns}`] = true;
          this.logger.warn(`key "${usedKey}" for languages "${codes.join(", ")}" won't get resolved as namespace "${usedNS}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
        }
        codes.forEach((code) => {
          if (this.isValidLookup(found)) return;
          usedLng = code;
          const finalKeys = [key];
          if (this.i18nFormat && this.i18nFormat.addLookupKeys) {
            this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, options);
          } else {
            let pluralSuffix;
            if (needsPluralHandling) pluralSuffix = this.pluralResolver.getSuffix(code, options.count, options);
            const zeroSuffix = `${this.options.pluralSeparator}zero`;
            const ordinalPrefix = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (needsPluralHandling) {
              finalKeys.push(key + pluralSuffix);
              if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                finalKeys.push(key + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
              }
              if (needsZeroSuffixLookup) {
                finalKeys.push(key + zeroSuffix);
              }
            }
            if (needsContextHandling) {
              const contextKey = `${key}${this.options.contextSeparator}${options.context}`;
              finalKeys.push(contextKey);
              if (needsPluralHandling) {
                finalKeys.push(contextKey + pluralSuffix);
                if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                  finalKeys.push(contextKey + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
                }
                if (needsZeroSuffixLookup) {
                  finalKeys.push(contextKey + zeroSuffix);
                }
              }
            }
          }
          let possibleKey;
          while (possibleKey = finalKeys.pop()) {
            if (!this.isValidLookup(found)) {
              exactUsedKey = possibleKey;
              found = this.getResource(code, ns, possibleKey, options);
            }
          }
        });
      });
    });
    return {
      res: found,
      usedKey,
      exactUsedKey,
      usedLng,
      usedNS
    };
  }
  isValidLookup(res) {
    return res !== void 0 && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === "");
  }
  getResource(code, ns, key) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    if (this.i18nFormat && this.i18nFormat.getResource) return this.i18nFormat.getResource(code, ns, key, options);
    return this.resourceStore.getResource(code, ns, key, options);
  }
  getUsedParamsDetails() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const optionsKeys = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"];
    const useOptionsReplaceForData = options.replace && !isString(options.replace);
    let data = useOptionsReplaceForData ? options.replace : options;
    if (useOptionsReplaceForData && typeof options.count !== "undefined") {
      data.count = options.count;
    }
    if (this.options.interpolation.defaultVariables) {
      data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
    }
    if (!useOptionsReplaceForData) {
      data = {
        ...data
      };
      for (const key of optionsKeys) {
        delete data[key];
      }
    }
    return data;
  }
  static hasDefaultValue(options) {
    const prefix = "defaultValue";
    for (const option in options) {
      if (Object.prototype.hasOwnProperty.call(options, option) && prefix === option.substring(0, prefix.length) && void 0 !== options[option]) {
        return true;
      }
    }
    return false;
  }
};
var capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);
var LanguageUtil = class {
  constructor(options) {
    this.options = options;
    this.supportedLngs = this.options.supportedLngs || false;
    this.logger = baseLogger.create("languageUtils");
  }
  getScriptPartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || code.indexOf("-") < 0) return null;
    const p = code.split("-");
    if (p.length === 2) return null;
    p.pop();
    if (p[p.length - 1].toLowerCase() === "x") return null;
    return this.formatLanguageCode(p.join("-"));
  }
  getLanguagePartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || code.indexOf("-") < 0) return code;
    const p = code.split("-");
    return this.formatLanguageCode(p[0]);
  }
  formatLanguageCode(code) {
    if (isString(code) && code.indexOf("-") > -1) {
      if (typeof Intl !== "undefined" && typeof Intl.getCanonicalLocales !== "undefined") {
        try {
          let formattedCode = Intl.getCanonicalLocales(code)[0];
          if (formattedCode && this.options.lowerCaseLng) {
            formattedCode = formattedCode.toLowerCase();
          }
          if (formattedCode) return formattedCode;
        } catch (e) {
        }
      }
      const specialCases = ["hans", "hant", "latn", "cyrl", "cans", "mong", "arab"];
      let p = code.split("-");
      if (this.options.lowerCaseLng) {
        p = p.map((part) => part.toLowerCase());
      } else if (p.length === 2) {
        p[0] = p[0].toLowerCase();
        p[1] = p[1].toUpperCase();
        if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
      } else if (p.length === 3) {
        p[0] = p[0].toLowerCase();
        if (p[1].length === 2) p[1] = p[1].toUpperCase();
        if (p[0] !== "sgn" && p[2].length === 2) p[2] = p[2].toUpperCase();
        if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
        if (specialCases.indexOf(p[2].toLowerCase()) > -1) p[2] = capitalize(p[2].toLowerCase());
      }
      return p.join("-");
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
  }
  isSupportedCode(code) {
    if (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) {
      code = this.getLanguagePartFromCode(code);
    }
    return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
  }
  getBestMatchFromCodes(codes) {
    if (!codes) return null;
    let found;
    codes.forEach((code) => {
      if (found) return;
      const cleanedLng = this.formatLanguageCode(code);
      if (!this.options.supportedLngs || this.isSupportedCode(cleanedLng)) found = cleanedLng;
    });
    if (!found && this.options.supportedLngs) {
      codes.forEach((code) => {
        if (found) return;
        const lngOnly = this.getLanguagePartFromCode(code);
        if (this.isSupportedCode(lngOnly)) return found = lngOnly;
        found = this.options.supportedLngs.find((supportedLng) => {
          if (supportedLng === lngOnly) return supportedLng;
          if (supportedLng.indexOf("-") < 0 && lngOnly.indexOf("-") < 0) return;
          if (supportedLng.indexOf("-") > 0 && lngOnly.indexOf("-") < 0 && supportedLng.substring(0, supportedLng.indexOf("-")) === lngOnly) return supportedLng;
          if (supportedLng.indexOf(lngOnly) === 0 && lngOnly.length > 1) return supportedLng;
        });
      });
    }
    if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
    return found;
  }
  getFallbackCodes(fallbacks, code) {
    if (!fallbacks) return [];
    if (typeof fallbacks === "function") fallbacks = fallbacks(code);
    if (isString(fallbacks)) fallbacks = [fallbacks];
    if (Array.isArray(fallbacks)) return fallbacks;
    if (!code) return fallbacks.default || [];
    let found = fallbacks[code];
    if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
    if (!found) found = fallbacks[this.formatLanguageCode(code)];
    if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
    if (!found) found = fallbacks.default;
    return found || [];
  }
  toResolveHierarchy(code, fallbackCode) {
    const fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
    const codes = [];
    const addCode = (c) => {
      if (!c) return;
      if (this.isSupportedCode(c)) {
        codes.push(c);
      } else {
        this.logger.warn(`rejecting language code not found in supportedLngs: ${c}`);
      }
    };
    if (isString(code) && (code.indexOf("-") > -1 || code.indexOf("_") > -1)) {
      if (this.options.load !== "languageOnly") addCode(this.formatLanguageCode(code));
      if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly") addCode(this.getScriptPartFromCode(code));
      if (this.options.load !== "currentOnly") addCode(this.getLanguagePartFromCode(code));
    } else if (isString(code)) {
      addCode(this.formatLanguageCode(code));
    }
    fallbackCodes.forEach((fc) => {
      if (codes.indexOf(fc) < 0) addCode(this.formatLanguageCode(fc));
    });
    return codes;
  }
};
var sets = [{
  lngs: ["ach", "ak", "am", "arn", "br", "fil", "gun", "ln", "mfe", "mg", "mi", "oc", "pt", "pt-BR", "tg", "tl", "ti", "tr", "uz", "wa"],
  nr: [1, 2],
  fc: 1
}, {
  lngs: ["af", "an", "ast", "az", "bg", "bn", "ca", "da", "de", "dev", "el", "en", "eo", "es", "et", "eu", "fi", "fo", "fur", "fy", "gl", "gu", "ha", "hi", "hu", "hy", "ia", "it", "kk", "kn", "ku", "lb", "mai", "ml", "mn", "mr", "nah", "nap", "nb", "ne", "nl", "nn", "no", "nso", "pa", "pap", "pms", "ps", "pt-PT", "rm", "sco", "se", "si", "so", "son", "sq", "sv", "sw", "ta", "te", "tk", "ur", "yo"],
  nr: [1, 2],
  fc: 2
}, {
  lngs: ["ay", "bo", "cgg", "fa", "ht", "id", "ja", "jbo", "ka", "km", "ko", "ky", "lo", "ms", "sah", "su", "th", "tt", "ug", "vi", "wo", "zh"],
  nr: [1],
  fc: 3
}, {
  lngs: ["be", "bs", "cnr", "dz", "hr", "ru", "sr", "uk"],
  nr: [1, 2, 5],
  fc: 4
}, {
  lngs: ["ar"],
  nr: [0, 1, 2, 3, 11, 100],
  fc: 5
}, {
  lngs: ["cs", "sk"],
  nr: [1, 2, 5],
  fc: 6
}, {
  lngs: ["csb", "pl"],
  nr: [1, 2, 5],
  fc: 7
}, {
  lngs: ["cy"],
  nr: [1, 2, 3, 8],
  fc: 8
}, {
  lngs: ["fr"],
  nr: [1, 2],
  fc: 9
}, {
  lngs: ["ga"],
  nr: [1, 2, 3, 7, 11],
  fc: 10
}, {
  lngs: ["gd"],
  nr: [1, 2, 3, 20],
  fc: 11
}, {
  lngs: ["is"],
  nr: [1, 2],
  fc: 12
}, {
  lngs: ["jv"],
  nr: [0, 1],
  fc: 13
}, {
  lngs: ["kw"],
  nr: [1, 2, 3, 4],
  fc: 14
}, {
  lngs: ["lt"],
  nr: [1, 2, 10],
  fc: 15
}, {
  lngs: ["lv"],
  nr: [1, 2, 0],
  fc: 16
}, {
  lngs: ["mk"],
  nr: [1, 2],
  fc: 17
}, {
  lngs: ["mnk"],
  nr: [0, 1, 2],
  fc: 18
}, {
  lngs: ["mt"],
  nr: [1, 2, 11, 20],
  fc: 19
}, {
  lngs: ["or"],
  nr: [2, 1],
  fc: 2
}, {
  lngs: ["ro"],
  nr: [1, 2, 20],
  fc: 20
}, {
  lngs: ["sl"],
  nr: [5, 1, 2, 3],
  fc: 21
}, {
  lngs: ["he", "iw"],
  nr: [1, 2, 20, 21],
  fc: 22
}];
var _rulesPluralsTypes = {
  1: (n) => Number(n > 1),
  2: (n) => Number(n != 1),
  3: (n) => 0,
  4: (n) => Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2),
  5: (n) => Number(n == 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5),
  6: (n) => Number(n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2),
  7: (n) => Number(n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2),
  8: (n) => Number(n == 1 ? 0 : n == 2 ? 1 : n != 8 && n != 11 ? 2 : 3),
  9: (n) => Number(n >= 2),
  10: (n) => Number(n == 1 ? 0 : n == 2 ? 1 : n < 7 ? 2 : n < 11 ? 3 : 4),
  11: (n) => Number(n == 1 || n == 11 ? 0 : n == 2 || n == 12 ? 1 : n > 2 && n < 20 ? 2 : 3),
  12: (n) => Number(n % 10 != 1 || n % 100 == 11),
  13: (n) => Number(n !== 0),
  14: (n) => Number(n == 1 ? 0 : n == 2 ? 1 : n == 3 ? 2 : 3),
  15: (n) => Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2),
  16: (n) => Number(n % 10 == 1 && n % 100 != 11 ? 0 : n !== 0 ? 1 : 2),
  17: (n) => Number(n == 1 || n % 10 == 1 && n % 100 != 11 ? 0 : 1),
  18: (n) => Number(n == 0 ? 0 : n == 1 ? 1 : 2),
  19: (n) => Number(n == 1 ? 0 : n == 0 || n % 100 > 1 && n % 100 < 11 ? 1 : n % 100 > 10 && n % 100 < 20 ? 2 : 3),
  20: (n) => Number(n == 1 ? 0 : n == 0 || n % 100 > 0 && n % 100 < 20 ? 1 : 2),
  21: (n) => Number(n % 100 == 1 ? 1 : n % 100 == 2 ? 2 : n % 100 == 3 || n % 100 == 4 ? 3 : 0),
  22: (n) => Number(n == 1 ? 0 : n == 2 ? 1 : (n < 0 || n > 10) && n % 10 == 0 ? 2 : 3)
};
var nonIntlVersions = ["v1", "v2", "v3"];
var intlVersions = ["v4"];
var suffixesOrder = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
};
var createRules = () => {
  const rules = {};
  sets.forEach((set) => {
    set.lngs.forEach((l) => {
      rules[l] = {
        numbers: set.nr,
        plurals: _rulesPluralsTypes[set.fc]
      };
    });
  });
  return rules;
};
var PluralResolver = class {
  constructor(languageUtils) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.languageUtils = languageUtils;
    this.options = options;
    this.logger = baseLogger.create("pluralResolver");
    if ((!this.options.compatibilityJSON || intlVersions.includes(this.options.compatibilityJSON)) && (typeof Intl === "undefined" || !Intl.PluralRules)) {
      this.options.compatibilityJSON = "v3";
      this.logger.error("Your environment seems not to be Intl API compatible, use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling.");
    }
    this.rules = createRules();
    this.pluralRulesCache = {};
  }
  addRule(lng, obj) {
    this.rules[lng] = obj;
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(code) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.shouldUseIntlApi()) {
      const cleanedCode = getCleanedCode(code === "dev" ? "en" : code);
      const type = options.ordinal ? "ordinal" : "cardinal";
      const cacheKey = JSON.stringify({
        cleanedCode,
        type
      });
      if (cacheKey in this.pluralRulesCache) {
        return this.pluralRulesCache[cacheKey];
      }
      let rule;
      try {
        rule = new Intl.PluralRules(cleanedCode, {
          type
        });
      } catch (err) {
        if (!code.match(/-|_/)) return;
        const lngPart = this.languageUtils.getLanguagePartFromCode(code);
        rule = this.getRule(lngPart, options);
      }
      this.pluralRulesCache[cacheKey] = rule;
      return rule;
    }
    return this.rules[code] || this.rules[this.languageUtils.getLanguagePartFromCode(code)];
  }
  needsPlural(code) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const rule = this.getRule(code, options);
    if (this.shouldUseIntlApi()) {
      return rule && rule.resolvedOptions().pluralCategories.length > 1;
    }
    return rule && rule.numbers.length > 1;
  }
  getPluralFormsOfKey(code, key) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return this.getSuffixes(code, options).map((suffix) => `${key}${suffix}`);
  }
  getSuffixes(code) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const rule = this.getRule(code, options);
    if (!rule) {
      return [];
    }
    if (this.shouldUseIntlApi()) {
      return rule.resolvedOptions().pluralCategories.sort((pluralCategory1, pluralCategory2) => suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2]).map((pluralCategory) => `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${pluralCategory}`);
    }
    return rule.numbers.map((number) => this.getSuffix(code, number, options));
  }
  getSuffix(code, count) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const rule = this.getRule(code, options);
    if (rule) {
      if (this.shouldUseIntlApi()) {
        return `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${rule.select(count)}`;
      }
      return this.getSuffixRetroCompatible(rule, count);
    }
    this.logger.warn(`no plural rule found for: ${code}`);
    return "";
  }
  getSuffixRetroCompatible(rule, count) {
    const idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count));
    let suffix = rule.numbers[idx];
    if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
      if (suffix === 2) {
        suffix = "plural";
      } else if (suffix === 1) {
        suffix = "";
      }
    }
    const returnSuffix = () => this.options.prepend && suffix.toString() ? this.options.prepend + suffix.toString() : suffix.toString();
    if (this.options.compatibilityJSON === "v1") {
      if (suffix === 1) return "";
      if (typeof suffix === "number") return `_plural_${suffix.toString()}`;
      return returnSuffix();
    } else if (this.options.compatibilityJSON === "v2") {
      return returnSuffix();
    } else if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
      return returnSuffix();
    }
    return this.options.prepend && idx.toString() ? this.options.prepend + idx.toString() : idx.toString();
  }
  shouldUseIntlApi() {
    return !nonIntlVersions.includes(this.options.compatibilityJSON);
  }
};
var deepFindWithDefaults = function(data, defaultData, key) {
  let keySeparator = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ".";
  let ignoreJSONStructure = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : true;
  let path = getPathWithDefaults(data, defaultData, key);
  if (!path && ignoreJSONStructure && isString(key)) {
    path = deepFind(data, key, keySeparator);
    if (path === void 0) path = deepFind(defaultData, key, keySeparator);
  }
  return path;
};
var regexSafe = (val) => val.replace(/\$/g, "$$$$");
var Interpolator = class {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.logger = baseLogger.create("interpolator");
    this.options = options;
    this.format = options.interpolation && options.interpolation.format || ((value) => value);
    this.init(options);
  }
  init() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!options.interpolation) options.interpolation = {
      escapeValue: true
    };
    const {
      escape: escape$1,
      escapeValue,
      useRawValueToEscape,
      prefix,
      prefixEscaped,
      suffix,
      suffixEscaped,
      formatSeparator,
      unescapeSuffix,
      unescapePrefix,
      nestingPrefix,
      nestingPrefixEscaped,
      nestingSuffix,
      nestingSuffixEscaped,
      nestingOptionsSeparator,
      maxReplaces,
      alwaysFormat
    } = options.interpolation;
    this.escape = escape$1 !== void 0 ? escape$1 : escape;
    this.escapeValue = escapeValue !== void 0 ? escapeValue : true;
    this.useRawValueToEscape = useRawValueToEscape !== void 0 ? useRawValueToEscape : false;
    this.prefix = prefix ? regexEscape(prefix) : prefixEscaped || "{{";
    this.suffix = suffix ? regexEscape(suffix) : suffixEscaped || "}}";
    this.formatSeparator = formatSeparator || ",";
    this.unescapePrefix = unescapeSuffix ? "" : unescapePrefix || "-";
    this.unescapeSuffix = this.unescapePrefix ? "" : unescapeSuffix || "";
    this.nestingPrefix = nestingPrefix ? regexEscape(nestingPrefix) : nestingPrefixEscaped || regexEscape("$t(");
    this.nestingSuffix = nestingSuffix ? regexEscape(nestingSuffix) : nestingSuffixEscaped || regexEscape(")");
    this.nestingOptionsSeparator = nestingOptionsSeparator || ",";
    this.maxReplaces = maxReplaces || 1e3;
    this.alwaysFormat = alwaysFormat !== void 0 ? alwaysFormat : false;
    this.resetRegExp();
  }
  reset() {
    if (this.options) this.init(this.options);
  }
  resetRegExp() {
    const getOrResetRegExp = (existingRegExp, pattern) => {
      if (existingRegExp && existingRegExp.source === pattern) {
        existingRegExp.lastIndex = 0;
        return existingRegExp;
      }
      return new RegExp(pattern, "g");
    };
    this.regexp = getOrResetRegExp(this.regexp, `${this.prefix}(.+?)${this.suffix}`);
    this.regexpUnescape = getOrResetRegExp(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`);
    this.nestingRegexp = getOrResetRegExp(this.nestingRegexp, `${this.nestingPrefix}(.+?)${this.nestingSuffix}`);
  }
  interpolate(str, data, lng, options) {
    let match;
    let value;
    let replaces;
    const defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
    const handleFormat = (key) => {
      if (key.indexOf(this.formatSeparator) < 0) {
        const path = deepFindWithDefaults(data, defaultData, key, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(path, void 0, lng, {
          ...options,
          ...data,
          interpolationkey: key
        }) : path;
      }
      const p = key.split(this.formatSeparator);
      const k = p.shift().trim();
      const f = p.join(this.formatSeparator).trim();
      return this.format(deepFindWithDefaults(data, defaultData, k, this.options.keySeparator, this.options.ignoreJSONStructure), f, lng, {
        ...options,
        ...data,
        interpolationkey: k
      });
    };
    this.resetRegExp();
    const missingInterpolationHandler = options && options.missingInterpolationHandler || this.options.missingInterpolationHandler;
    const skipOnVariables = options && options.interpolation && options.interpolation.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    const todos = [{
      regex: this.regexpUnescape,
      safeValue: (val) => regexSafe(val)
    }, {
      regex: this.regexp,
      safeValue: (val) => this.escapeValue ? regexSafe(this.escape(val)) : regexSafe(val)
    }];
    todos.forEach((todo) => {
      replaces = 0;
      while (match = todo.regex.exec(str)) {
        const matchedVar = match[1].trim();
        value = handleFormat(matchedVar);
        if (value === void 0) {
          if (typeof missingInterpolationHandler === "function") {
            const temp = missingInterpolationHandler(str, match, options);
            value = isString(temp) ? temp : "";
          } else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) {
            value = "";
          } else if (skipOnVariables) {
            value = match[0];
            continue;
          } else {
            this.logger.warn(`missed to pass in variable ${matchedVar} for interpolating ${str}`);
            value = "";
          }
        } else if (!isString(value) && !this.useRawValueToEscape) {
          value = makeString(value);
        }
        const safeValue = todo.safeValue(value);
        str = str.replace(match[0], safeValue);
        if (skipOnVariables) {
          todo.regex.lastIndex += value.length;
          todo.regex.lastIndex -= match[0].length;
        } else {
          todo.regex.lastIndex = 0;
        }
        replaces++;
        if (replaces >= this.maxReplaces) {
          break;
        }
      }
    });
    return str;
  }
  nest(str, fc) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    let match;
    let value;
    let clonedOptions;
    const handleHasOptions = (key, inheritedOptions) => {
      const sep = this.nestingOptionsSeparator;
      if (key.indexOf(sep) < 0) return key;
      const c = key.split(new RegExp(`${sep}[ ]*{`));
      let optionsString = `{${c[1]}`;
      key = c[0];
      optionsString = this.interpolate(optionsString, clonedOptions);
      const matchedSingleQuotes = optionsString.match(/'/g);
      const matchedDoubleQuotes = optionsString.match(/"/g);
      if (matchedSingleQuotes && matchedSingleQuotes.length % 2 === 0 && !matchedDoubleQuotes || matchedDoubleQuotes.length % 2 !== 0) {
        optionsString = optionsString.replace(/'/g, '"');
      }
      try {
        clonedOptions = JSON.parse(optionsString);
        if (inheritedOptions) clonedOptions = {
          ...inheritedOptions,
          ...clonedOptions
        };
      } catch (e) {
        this.logger.warn(`failed parsing options string in nesting for key ${key}`, e);
        return `${key}${sep}${optionsString}`;
      }
      if (clonedOptions.defaultValue && clonedOptions.defaultValue.indexOf(this.prefix) > -1) delete clonedOptions.defaultValue;
      return key;
    };
    while (match = this.nestingRegexp.exec(str)) {
      let formatters = [];
      clonedOptions = {
        ...options
      };
      clonedOptions = clonedOptions.replace && !isString(clonedOptions.replace) ? clonedOptions.replace : clonedOptions;
      clonedOptions.applyPostProcessor = false;
      delete clonedOptions.defaultValue;
      let doReduce = false;
      if (match[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(match[1])) {
        const r = match[1].split(this.formatSeparator).map((elem) => elem.trim());
        match[1] = r.shift();
        formatters = r;
        doReduce = true;
      }
      value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
      if (value && match[0] === str && !isString(value)) return value;
      if (!isString(value)) value = makeString(value);
      if (!value) {
        this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
        value = "";
      }
      if (doReduce) {
        value = formatters.reduce((v, f) => this.format(v, f, options.lng, {
          ...options,
          interpolationkey: match[1].trim()
        }), value.trim());
      }
      str = str.replace(match[0], value);
      this.regexp.lastIndex = 0;
    }
    return str;
  }
};
var parseFormatStr = (formatStr) => {
  let formatName = formatStr.toLowerCase().trim();
  const formatOptions = {};
  if (formatStr.indexOf("(") > -1) {
    const p = formatStr.split("(");
    formatName = p[0].toLowerCase().trim();
    const optStr = p[1].substring(0, p[1].length - 1);
    if (formatName === "currency" && optStr.indexOf(":") < 0) {
      if (!formatOptions.currency) formatOptions.currency = optStr.trim();
    } else if (formatName === "relativetime" && optStr.indexOf(":") < 0) {
      if (!formatOptions.range) formatOptions.range = optStr.trim();
    } else {
      const opts = optStr.split(";");
      opts.forEach((opt) => {
        if (opt) {
          const [key, ...rest] = opt.split(":");
          const val = rest.join(":").trim().replace(/^'+|'+$/g, "");
          const trimmedKey = key.trim();
          if (!formatOptions[trimmedKey]) formatOptions[trimmedKey] = val;
          if (val === "false") formatOptions[trimmedKey] = false;
          if (val === "true") formatOptions[trimmedKey] = true;
          if (!isNaN(val)) formatOptions[trimmedKey] = parseInt(val, 10);
        }
      });
    }
  }
  return {
    formatName,
    formatOptions
  };
};
var createCachedFormatter = (fn) => {
  const cache = {};
  return (val, lng, options) => {
    let optForCache = options;
    if (options && options.interpolationkey && options.formatParams && options.formatParams[options.interpolationkey] && options[options.interpolationkey]) {
      optForCache = {
        ...optForCache,
        [options.interpolationkey]: void 0
      };
    }
    const key = lng + JSON.stringify(optForCache);
    let formatter = cache[key];
    if (!formatter) {
      formatter = fn(getCleanedCode(lng), options);
      cache[key] = formatter;
    }
    return formatter(val);
  };
};
var Formatter = class {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.logger = baseLogger.create("formatter");
    this.options = options;
    this.formats = {
      number: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      }),
      currency: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt,
          style: "currency"
        });
        return (val) => formatter.format(val);
      }),
      datetime: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.DateTimeFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      }),
      relativetime: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.RelativeTimeFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val, opt.range || "day");
      }),
      list: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.ListFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      })
    };
    this.init(options);
  }
  init(services) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      interpolation: {}
    };
    this.formatSeparator = options.interpolation.formatSeparator || ",";
  }
  add(name, fc) {
    this.formats[name.toLowerCase().trim()] = fc;
  }
  addCached(name, fc) {
    this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
  }
  format(value, format, lng) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const formats = format.split(this.formatSeparator);
    if (formats.length > 1 && formats[0].indexOf("(") > 1 && formats[0].indexOf(")") < 0 && formats.find((f) => f.indexOf(")") > -1)) {
      const lastIndex = formats.findIndex((f) => f.indexOf(")") > -1);
      formats[0] = [formats[0], ...formats.splice(1, lastIndex)].join(this.formatSeparator);
    }
    const result = formats.reduce((mem, f) => {
      const {
        formatName,
        formatOptions
      } = parseFormatStr(f);
      if (this.formats[formatName]) {
        let formatted = mem;
        try {
          const valOptions = options && options.formatParams && options.formatParams[options.interpolationkey] || {};
          const l = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
          formatted = this.formats[formatName](mem, l, {
            ...formatOptions,
            ...options,
            ...valOptions
          });
        } catch (error) {
          this.logger.warn(error);
        }
        return formatted;
      } else {
        this.logger.warn(`there was no format function for ${formatName}`);
      }
      return mem;
    }, value);
    return result;
  }
};
var removePending = (q, name) => {
  if (q.pending[name] !== void 0) {
    delete q.pending[name];
    q.pendingCount--;
  }
};
var Connector = class extends EventEmitter {
  constructor(backend, store, services) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    super();
    this.backend = backend;
    this.store = store;
    this.services = services;
    this.languageUtils = services.languageUtils;
    this.options = options;
    this.logger = baseLogger.create("backendConnector");
    this.waitingReads = [];
    this.maxParallelReads = options.maxParallelReads || 10;
    this.readingCalls = 0;
    this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
    this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
    this.state = {};
    this.queue = [];
    if (this.backend && this.backend.init) {
      this.backend.init(services, options.backend, options);
    }
  }
  queueLoad(languages, namespaces, options, callback) {
    const toLoad = {};
    const pending = {};
    const toLoadLanguages = {};
    const toLoadNamespaces = {};
    languages.forEach((lng) => {
      let hasAllNamespaces = true;
      namespaces.forEach((ns) => {
        const name = `${lng}|${ns}`;
        if (!options.reload && this.store.hasResourceBundle(lng, ns)) {
          this.state[name] = 2;
        } else if (this.state[name] < 0) ;
        else if (this.state[name] === 1) {
          if (pending[name] === void 0) pending[name] = true;
        } else {
          this.state[name] = 1;
          hasAllNamespaces = false;
          if (pending[name] === void 0) pending[name] = true;
          if (toLoad[name] === void 0) toLoad[name] = true;
          if (toLoadNamespaces[ns] === void 0) toLoadNamespaces[ns] = true;
        }
      });
      if (!hasAllNamespaces) toLoadLanguages[lng] = true;
    });
    if (Object.keys(toLoad).length || Object.keys(pending).length) {
      this.queue.push({
        pending,
        pendingCount: Object.keys(pending).length,
        loaded: {},
        errors: [],
        callback
      });
    }
    return {
      toLoad: Object.keys(toLoad),
      pending: Object.keys(pending),
      toLoadLanguages: Object.keys(toLoadLanguages),
      toLoadNamespaces: Object.keys(toLoadNamespaces)
    };
  }
  loaded(name, err, data) {
    const s = name.split("|");
    const lng = s[0];
    const ns = s[1];
    if (err) this.emit("failedLoading", lng, ns, err);
    if (!err && data) {
      this.store.addResourceBundle(lng, ns, data, void 0, void 0, {
        skipCopy: true
      });
    }
    this.state[name] = err ? -1 : 2;
    if (err && data) this.state[name] = 0;
    const loaded = {};
    this.queue.forEach((q) => {
      pushPath(q.loaded, [lng], ns);
      removePending(q, name);
      if (err) q.errors.push(err);
      if (q.pendingCount === 0 && !q.done) {
        Object.keys(q.loaded).forEach((l) => {
          if (!loaded[l]) loaded[l] = {};
          const loadedKeys = q.loaded[l];
          if (loadedKeys.length) {
            loadedKeys.forEach((n) => {
              if (loaded[l][n] === void 0) loaded[l][n] = true;
            });
          }
        });
        q.done = true;
        if (q.errors.length) {
          q.callback(q.errors);
        } else {
          q.callback();
        }
      }
    });
    this.emit("loaded", loaded);
    this.queue = this.queue.filter((q) => !q.done);
  }
  read(lng, ns, fcName) {
    let tried = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
    let wait = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : this.retryTimeout;
    let callback = arguments.length > 5 ? arguments[5] : void 0;
    if (!lng.length) return callback(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng,
        ns,
        fcName,
        tried,
        wait,
        callback
      });
      return;
    }
    this.readingCalls++;
    const resolver = (err, data) => {
      this.readingCalls--;
      if (this.waitingReads.length > 0) {
        const next = this.waitingReads.shift();
        this.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
      }
      if (err && data && tried < this.maxRetries) {
        setTimeout(() => {
          this.read.call(this, lng, ns, fcName, tried + 1, wait * 2, callback);
        }, wait);
        return;
      }
      callback(err, data);
    };
    const fc = this.backend[fcName].bind(this.backend);
    if (fc.length === 2) {
      try {
        const r = fc(lng, ns);
        if (r && typeof r.then === "function") {
          r.then((data) => resolver(null, data)).catch(resolver);
        } else {
          resolver(null, r);
        }
      } catch (err) {
        resolver(err);
      }
      return;
    }
    return fc(lng, ns, resolver);
  }
  prepareLoading(languages, namespaces) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    let callback = arguments.length > 3 ? arguments[3] : void 0;
    if (!this.backend) {
      this.logger.warn("No backend was added via i18next.use. Will not load resources.");
      return callback && callback();
    }
    if (isString(languages)) languages = this.languageUtils.toResolveHierarchy(languages);
    if (isString(namespaces)) namespaces = [namespaces];
    const toLoad = this.queueLoad(languages, namespaces, options, callback);
    if (!toLoad.toLoad.length) {
      if (!toLoad.pending.length) callback();
      return null;
    }
    toLoad.toLoad.forEach((name) => {
      this.loadOne(name);
    });
  }
  load(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {}, callback);
  }
  reload(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {
      reload: true
    }, callback);
  }
  loadOne(name) {
    let prefix = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    const s = name.split("|");
    const lng = s[0];
    const ns = s[1];
    this.read(lng, ns, "read", void 0, void 0, (err, data) => {
      if (err) this.logger.warn(`${prefix}loading namespace ${ns} for language ${lng} failed`, err);
      if (!err && data) this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);
      this.loaded(name, err, data);
    });
  }
  saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
    let options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {};
    let clb = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : () => {
    };
    if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(namespace)) {
      this.logger.warn(`did not save key "${key}" as the namespace "${namespace}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
      return;
    }
    if (key === void 0 || key === null || key === "") return;
    if (this.backend && this.backend.create) {
      const opts = {
        ...options,
        isUpdate
      };
      const fc = this.backend.create.bind(this.backend);
      if (fc.length < 6) {
        try {
          let r;
          if (fc.length === 5) {
            r = fc(languages, namespace, key, fallbackValue, opts);
          } else {
            r = fc(languages, namespace, key, fallbackValue);
          }
          if (r && typeof r.then === "function") {
            r.then((data) => clb(null, data)).catch(clb);
          } else {
            clb(null, r);
          }
        } catch (err) {
          clb(err);
        }
      } else {
        fc(languages, namespace, key, fallbackValue, clb, opts);
      }
    }
    if (!languages || !languages[0]) return;
    this.store.addResource(languages[0], namespace, key, fallbackValue);
  }
};
var get = () => ({
  debug: false,
  initImmediate: true,
  ns: ["translation"],
  defaultNS: ["translation"],
  fallbackLng: ["dev"],
  fallbackNS: false,
  supportedLngs: false,
  nonExplicitSupportedLngs: false,
  load: "all",
  preload: false,
  simplifyPluralSuffix: true,
  keySeparator: ".",
  nsSeparator: ":",
  pluralSeparator: "_",
  contextSeparator: "_",
  partialBundledLanguages: false,
  saveMissing: false,
  updateMissing: false,
  saveMissingTo: "fallback",
  saveMissingPlurals: true,
  missingKeyHandler: false,
  missingInterpolationHandler: false,
  postProcess: false,
  postProcessPassResolved: false,
  returnNull: false,
  returnEmptyString: true,
  returnObjects: false,
  joinArrays: false,
  returnedObjectHandler: false,
  parseMissingKeyHandler: false,
  appendNamespaceToMissingKey: false,
  appendNamespaceToCIMode: false,
  overloadTranslationOptionHandler: (args) => {
    let ret = {};
    if (typeof args[1] === "object") ret = args[1];
    if (isString(args[1])) ret.defaultValue = args[1];
    if (isString(args[2])) ret.tDescription = args[2];
    if (typeof args[2] === "object" || typeof args[3] === "object") {
      const options = args[3] || args[2];
      Object.keys(options).forEach((key) => {
        ret[key] = options[key];
      });
    }
    return ret;
  },
  interpolation: {
    escapeValue: true,
    format: (value) => value,
    prefix: "{{",
    suffix: "}}",
    formatSeparator: ",",
    unescapePrefix: "-",
    nestingPrefix: "$t(",
    nestingSuffix: ")",
    nestingOptionsSeparator: ",",
    maxReplaces: 1e3,
    skipOnVariables: true
  }
});
var transformOptions = (options) => {
  if (isString(options.ns)) options.ns = [options.ns];
  if (isString(options.fallbackLng)) options.fallbackLng = [options.fallbackLng];
  if (isString(options.fallbackNS)) options.fallbackNS = [options.fallbackNS];
  if (options.supportedLngs && options.supportedLngs.indexOf("cimode") < 0) {
    options.supportedLngs = options.supportedLngs.concat(["cimode"]);
  }
  return options;
};
var noop = () => {
};
var bindMemberFunctions = (inst) => {
  const mems = Object.getOwnPropertyNames(Object.getPrototypeOf(inst));
  mems.forEach((mem) => {
    if (typeof inst[mem] === "function") {
      inst[mem] = inst[mem].bind(inst);
    }
  });
};
var I18n = class _I18n extends EventEmitter {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : void 0;
    super();
    this.options = transformOptions(options);
    this.services = {};
    this.logger = baseLogger;
    this.modules = {
      external: []
    };
    bindMemberFunctions(this);
    if (callback && !this.isInitialized && !options.isClone) {
      if (!this.options.initImmediate) {
        this.init(options, callback);
        return this;
      }
      setTimeout(() => {
        this.init(options, callback);
      }, 0);
    }
  }
  init() {
    var _this = this;
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : void 0;
    this.isInitializing = true;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (!options.defaultNS && options.defaultNS !== false && options.ns) {
      if (isString(options.ns)) {
        options.defaultNS = options.ns;
      } else if (options.ns.indexOf("translation") < 0) {
        options.defaultNS = options.ns[0];
      }
    }
    const defOpts = get();
    this.options = {
      ...defOpts,
      ...this.options,
      ...transformOptions(options)
    };
    if (this.options.compatibilityAPI !== "v1") {
      this.options.interpolation = {
        ...defOpts.interpolation,
        ...this.options.interpolation
      };
    }
    if (options.keySeparator !== void 0) {
      this.options.userDefinedKeySeparator = options.keySeparator;
    }
    if (options.nsSeparator !== void 0) {
      this.options.userDefinedNsSeparator = options.nsSeparator;
    }
    const createClassOnDemand = (ClassOrObject) => {
      if (!ClassOrObject) return null;
      if (typeof ClassOrObject === "function") return new ClassOrObject();
      return ClassOrObject;
    };
    if (!this.options.isClone) {
      if (this.modules.logger) {
        baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
      } else {
        baseLogger.init(null, this.options);
      }
      let formatter;
      if (this.modules.formatter) {
        formatter = this.modules.formatter;
      } else if (typeof Intl !== "undefined") {
        formatter = Formatter;
      }
      const lu = new LanguageUtil(this.options);
      this.store = new ResourceStore(this.options.resources, this.options);
      const s = this.services;
      s.logger = baseLogger;
      s.resourceStore = this.store;
      s.languageUtils = lu;
      s.pluralResolver = new PluralResolver(lu, {
        prepend: this.options.pluralSeparator,
        compatibilityJSON: this.options.compatibilityJSON,
        simplifyPluralSuffix: this.options.simplifyPluralSuffix
      });
      if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
        s.formatter = createClassOnDemand(formatter);
        s.formatter.init(s, this.options);
        this.options.interpolation.format = s.formatter.format.bind(s.formatter);
      }
      s.interpolator = new Interpolator(this.options);
      s.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      };
      s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
      s.backendConnector.on("*", function(event) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        _this.emit(event, ...args);
      });
      if (this.modules.languageDetector) {
        s.languageDetector = createClassOnDemand(this.modules.languageDetector);
        if (s.languageDetector.init) s.languageDetector.init(s, this.options.detection, this.options);
      }
      if (this.modules.i18nFormat) {
        s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
        if (s.i18nFormat.init) s.i18nFormat.init(this);
      }
      this.translator = new Translator(this.services, this.options);
      this.translator.on("*", function(event) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }
        _this.emit(event, ...args);
      });
      this.modules.external.forEach((m) => {
        if (m.init) m.init(this);
      });
    }
    this.format = this.options.interpolation.format;
    if (!callback) callback = noop;
    if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      if (codes.length > 0 && codes[0] !== "dev") this.options.lng = codes[0];
    }
    if (!this.services.languageDetector && !this.options.lng) {
      this.logger.warn("init: no languageDetector is used and no lng is defined");
    }
    const storeApi = ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"];
    storeApi.forEach((fcName) => {
      this[fcName] = function() {
        return _this.store[fcName](...arguments);
      };
    });
    const storeApiChained = ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"];
    storeApiChained.forEach((fcName) => {
      this[fcName] = function() {
        _this.store[fcName](...arguments);
        return _this;
      };
    });
    const deferred = defer();
    const load = () => {
      const finish = (err, t2) => {
        this.isInitializing = false;
        if (this.isInitialized && !this.initializedStoreOnce) this.logger.warn("init: i18next is already initialized. You should call init just once!");
        this.isInitialized = true;
        if (!this.options.isClone) this.logger.log("initialized", this.options);
        this.emit("initialized", this.options);
        deferred.resolve(t2);
        callback(err, t2);
      };
      if (this.languages && this.options.compatibilityAPI !== "v1" && !this.isInitialized) return finish(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, finish);
    };
    if (this.options.resources || !this.options.initImmediate) {
      load();
    } else {
      setTimeout(load, 0);
    }
    return deferred;
  }
  loadResources(language) {
    let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop;
    let usedCallback = callback;
    const usedLng = isString(language) ? language : this.language;
    if (typeof language === "function") usedCallback = language;
    if (!this.options.resources || this.options.partialBundledLanguages) {
      if (usedLng && usedLng.toLowerCase() === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return usedCallback();
      const toLoad = [];
      const append = (lng) => {
        if (!lng) return;
        if (lng === "cimode") return;
        const lngs = this.services.languageUtils.toResolveHierarchy(lng);
        lngs.forEach((l) => {
          if (l === "cimode") return;
          if (toLoad.indexOf(l) < 0) toLoad.push(l);
        });
      };
      if (!usedLng) {
        const fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
        fallbacks.forEach((l) => append(l));
      } else {
        append(usedLng);
      }
      if (this.options.preload) {
        this.options.preload.forEach((l) => append(l));
      }
      this.services.backendConnector.load(toLoad, this.options.ns, (e) => {
        if (!e && !this.resolvedLanguage && this.language) this.setResolvedLanguage(this.language);
        usedCallback(e);
      });
    } else {
      usedCallback(null);
    }
  }
  reloadResources(lngs, ns, callback) {
    const deferred = defer();
    if (typeof lngs === "function") {
      callback = lngs;
      lngs = void 0;
    }
    if (typeof ns === "function") {
      callback = ns;
      ns = void 0;
    }
    if (!lngs) lngs = this.languages;
    if (!ns) ns = this.options.ns;
    if (!callback) callback = noop;
    this.services.backendConnector.reload(lngs, ns, (err) => {
      deferred.resolve();
      callback(err);
    });
    return deferred;
  }
  use(module2) {
    if (!module2) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
    if (!module2.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
    if (module2.type === "backend") {
      this.modules.backend = module2;
    }
    if (module2.type === "logger" || module2.log && module2.warn && module2.error) {
      this.modules.logger = module2;
    }
    if (module2.type === "languageDetector") {
      this.modules.languageDetector = module2;
    }
    if (module2.type === "i18nFormat") {
      this.modules.i18nFormat = module2;
    }
    if (module2.type === "postProcessor") {
      postProcessor.addPostProcessor(module2);
    }
    if (module2.type === "formatter") {
      this.modules.formatter = module2;
    }
    if (module2.type === "3rdParty") {
      this.modules.external.push(module2);
    }
    return this;
  }
  setResolvedLanguage(l) {
    if (!l || !this.languages) return;
    if (["cimode", "dev"].indexOf(l) > -1) return;
    for (let li = 0; li < this.languages.length; li++) {
      const lngInLngs = this.languages[li];
      if (["cimode", "dev"].indexOf(lngInLngs) > -1) continue;
      if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
        this.resolvedLanguage = lngInLngs;
        break;
      }
    }
  }
  changeLanguage(lng, callback) {
    var _this2 = this;
    this.isLanguageChangingTo = lng;
    const deferred = defer();
    this.emit("languageChanging", lng);
    const setLngProps = (l) => {
      this.language = l;
      this.languages = this.services.languageUtils.toResolveHierarchy(l);
      this.resolvedLanguage = void 0;
      this.setResolvedLanguage(l);
    };
    const done = (err, l) => {
      if (l) {
        setLngProps(l);
        this.translator.changeLanguage(l);
        this.isLanguageChangingTo = void 0;
        this.emit("languageChanged", l);
        this.logger.log("languageChanged", l);
      } else {
        this.isLanguageChangingTo = void 0;
      }
      deferred.resolve(function() {
        return _this2.t(...arguments);
      });
      if (callback) callback(err, function() {
        return _this2.t(...arguments);
      });
    };
    const setLng = (lngs) => {
      if (!lng && !lngs && this.services.languageDetector) lngs = [];
      const l = isString(lngs) ? lngs : this.services.languageUtils.getBestMatchFromCodes(lngs);
      if (l) {
        if (!this.language) {
          setLngProps(l);
        }
        if (!this.translator.language) this.translator.changeLanguage(l);
        if (this.services.languageDetector && this.services.languageDetector.cacheUserLanguage) this.services.languageDetector.cacheUserLanguage(l);
      }
      this.loadResources(l, (err) => {
        done(err, l);
      });
    };
    if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
      setLng(this.services.languageDetector.detect());
    } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
      if (this.services.languageDetector.detect.length === 0) {
        this.services.languageDetector.detect().then(setLng);
      } else {
        this.services.languageDetector.detect(setLng);
      }
    } else {
      setLng(lng);
    }
    return deferred;
  }
  getFixedT(lng, ns, keyPrefix) {
    var _this3 = this;
    const fixedT = function(key, opts) {
      let options;
      if (typeof opts !== "object") {
        for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
          rest[_key3 - 2] = arguments[_key3];
        }
        options = _this3.options.overloadTranslationOptionHandler([key, opts].concat(rest));
      } else {
        options = {
          ...opts
        };
      }
      options.lng = options.lng || fixedT.lng;
      options.lngs = options.lngs || fixedT.lngs;
      options.ns = options.ns || fixedT.ns;
      if (options.keyPrefix !== "") options.keyPrefix = options.keyPrefix || keyPrefix || fixedT.keyPrefix;
      const keySeparator = _this3.options.keySeparator || ".";
      let resultKey;
      if (options.keyPrefix && Array.isArray(key)) {
        resultKey = key.map((k) => `${options.keyPrefix}${keySeparator}${k}`);
      } else {
        resultKey = options.keyPrefix ? `${options.keyPrefix}${keySeparator}${key}` : key;
      }
      return _this3.t(resultKey, options);
    };
    if (isString(lng)) {
      fixedT.lng = lng;
    } else {
      fixedT.lngs = lng;
    }
    fixedT.ns = ns;
    fixedT.keyPrefix = keyPrefix;
    return fixedT;
  }
  t() {
    return this.translator && this.translator.translate(...arguments);
  }
  exists() {
    return this.translator && this.translator.exists(...arguments);
  }
  setDefaultNamespace(ns) {
    this.options.defaultNS = ns;
  }
  hasLoadedNamespace(ns) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!this.isInitialized) {
      this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages);
      return false;
    }
    if (!this.languages || !this.languages.length) {
      this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages);
      return false;
    }
    const lng = options.lng || this.resolvedLanguage || this.languages[0];
    const fallbackLng = this.options ? this.options.fallbackLng : false;
    const lastLng = this.languages[this.languages.length - 1];
    if (lng.toLowerCase() === "cimode") return true;
    const loadNotPending = (l, n) => {
      const loadState = this.services.backendConnector.state[`${l}|${n}`];
      return loadState === -1 || loadState === 0 || loadState === 2;
    };
    if (options.precheck) {
      const preResult = options.precheck(this, loadNotPending);
      if (preResult !== void 0) return preResult;
    }
    if (this.hasResourceBundle(lng, ns)) return true;
    if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages) return true;
    if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
    return false;
  }
  loadNamespaces(ns, callback) {
    const deferred = defer();
    if (!this.options.ns) {
      if (callback) callback();
      return Promise.resolve();
    }
    if (isString(ns)) ns = [ns];
    ns.forEach((n) => {
      if (this.options.ns.indexOf(n) < 0) this.options.ns.push(n);
    });
    this.loadResources((err) => {
      deferred.resolve();
      if (callback) callback(err);
    });
    return deferred;
  }
  loadLanguages(lngs, callback) {
    const deferred = defer();
    if (isString(lngs)) lngs = [lngs];
    const preloaded = this.options.preload || [];
    const newLngs = lngs.filter((lng) => preloaded.indexOf(lng) < 0 && this.services.languageUtils.isSupportedCode(lng));
    if (!newLngs.length) {
      if (callback) callback();
      return Promise.resolve();
    }
    this.options.preload = preloaded.concat(newLngs);
    this.loadResources((err) => {
      deferred.resolve();
      if (callback) callback(err);
    });
    return deferred;
  }
  dir(lng) {
    if (!lng) lng = this.resolvedLanguage || (this.languages && this.languages.length > 0 ? this.languages[0] : this.language);
    if (!lng) return "rtl";
    const rtlLngs = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"];
    const languageUtils = this.services && this.services.languageUtils || new LanguageUtil(get());
    return rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) > -1 || lng.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
  }
  static createInstance() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : void 0;
    return new _I18n(options, callback);
  }
  cloneInstance() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop;
    const forkResourceStore = options.forkResourceStore;
    if (forkResourceStore) delete options.forkResourceStore;
    const mergedOptions = {
      ...this.options,
      ...options,
      ...{
        isClone: true
      }
    };
    const clone = new _I18n(mergedOptions);
    if (options.debug !== void 0 || options.prefix !== void 0) {
      clone.logger = clone.logger.clone(options);
    }
    const membersToCopy = ["store", "services", "language"];
    membersToCopy.forEach((m) => {
      clone[m] = this[m];
    });
    clone.services = {
      ...this.services
    };
    clone.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    if (forkResourceStore) {
      clone.store = new ResourceStore(this.store.data, mergedOptions);
      clone.services.resourceStore = clone.store;
    }
    clone.translator = new Translator(clone.services, mergedOptions);
    clone.translator.on("*", function(event) {
      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }
      clone.emit(event, ...args);
    });
    clone.init(mergedOptions, callback);
    clone.translator.options = mergedOptions;
    clone.translator.backendConnector.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    return clone;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
};
var instance = I18n.createInstance();
instance.createInstance = I18n.createInstance;
var createInstance = instance.createInstance;
var dir = instance.dir;
var init = instance.init;
var loadResources = instance.loadResources;
var reloadResources = instance.reloadResources;
var use = instance.use;
var changeLanguage = instance.changeLanguage;
var getFixedT = instance.getFixedT;
var t = instance.t;
var exists = instance.exists;
var setDefaultNamespace = instance.setDefaultNamespace;
var hasLoadedNamespace = instance.hasLoadedNamespace;
var loadNamespaces = instance.loadNamespaces;
var loadLanguages = instance.loadLanguages;

// src/i18n/index.js
var import_react_i18next8 = require("react-i18next");

// src/i18n/en.json
var en_default = {
  app: {
    title: "UA \u2192 IE Car Scout",
    subtitle: "Find cars in Ukraine. Calculate real import cost to Ireland."
  },
  nav: {
    search: "Search",
    favourites: "Favourites",
    calculator: "Import Calc",
    about: "About"
  },
  search: {
    placeholder: "Make, model or keyword...",
    yearFrom: "Year from",
    yearTo: "Year to",
    priceFrom: "Price from (\u20AC)",
    priceTo: "Price to (\u20AC)",
    source: "Source",
    allSources: "All sources",
    search: "Search",
    clear: "Clear",
    results: "{{count}} results",
    noResults: "No listings found. Try different filters.",
    loading: "Searching...",
    uaSources: "\u{1F1FA}\u{1F1E6} Ukraine sources",
    ieSources: "\u{1F1EE}\u{1F1EA} Ireland sources",
    openExternal: "Opens in new tab",
    apiSearch: "API search",
    externalOpened: "Opened {{count}} external sites"
  },
  sources: {
    autoria: "AUTO.RIA",
    rst: "RST.ua",
    carsua: "CARS.ua",
    olx: "OLX.ua",
    donedeal: "DoneDeal",
    carsireland: "CarsIreland",
    carzone: "Carzone"
  },
  toyota: {
    quickFilter: "Toyota favourites",
    ae86: "AE86 Corolla/Sprinter",
    supra_a60: "Supra A60 (81-86)",
    supra_a70: "Supra A70 (86-93)",
    mr2_aw11: "MR2 AW11 (84-89)",
    mr2_sw20: "MR2 SW20 (89-99)",
    celica: "Celica T160/T180",
    corolla: "Corolla (80-96)",
    hilux: "Hilux / Surf"
  },
  listing: {
    source: "Source",
    year: "Year",
    engine: "Engine",
    mileage: "Mileage",
    location: "Location",
    price: "Price",
    viewListing: "View listing",
    save: "Save",
    saved: "Saved",
    calcImport: "Calculate import"
  },
  stats: {
    title: "Ukraine market \u2014 price stats",
    min: "Minimum",
    avg: "Average",
    median: "Median",
    max: "Maximum",
    count: "{{count}} listings",
    currency: "EUR"
  },
  ireland: {
    title: "Irish market (comparison)",
    minPrice: "Min price (\u20AC)",
    avgPrice: "Avg price (\u20AC)",
    maxPrice: "Max price (\u20AC)",
    note: "Enter prices from Done Deal, Cars Ireland, or Motorcheck",
    sources: "Sources: donedeal.ie \xB7 carsireland.ie",
    autoFetch: "Auto-fetch from DoneDeal",
    fetching: "Fetching Irish prices...",
    fetchError: "Could not fetch Irish prices",
    found: "{{count}} listings found on DoneDeal",
    manualOverride: "Manual prices (override)"
  },
  calc: {
    title: "Import cost calculator",
    carPrice: "Car price (\u20AC)",
    carAge: "Car age",
    age30plus: "30+ years (classic)",
    age20to30: "20\u201330 years",
    ageUnder20: "Under 20 years",
    engine: "Engine size",
    shipping: "Shipping UA \u2192 IE (\u20AC)",
    misc: "Other costs (NCT prep, insurance, etc.) (\u20AC)",
    breakdown: "Cost breakdown",
    vrt: "VRT (Vehicle Registration Tax)",
    customs: "Customs duty (6.5%)",
    vat: "VAT (23%)",
    nox: "NOx levy",
    shippingLine: "Shipping",
    otherCosts: "Other costs",
    total: "Total landed cost",
    potential: "Potential margin vs IE avg",
    vrtNote: "VRT is assessed by Revenue on OMSP \u2014 always verify at revenue.ie/vrt",
    classicNote: "Classic cars (30y+) are exempt from customs duty when imported from Ukraine (post-Brexit EU rules apply)",
    profitable: "Potentially profitable",
    breakEven: "Break even",
    loss: "Not worth importing at this price"
  },
  compare: {
    title: "UA vs IE \u2014 price comparison",
    uaAvg: "UA average",
    ieAvg: "IE average",
    saving: "You save",
    premium: "IE premium"
  },
  favourites: {
    title: "Saved listings",
    empty: "No saved listings yet",
    remove: "Remove",
    export: "Export to PDF"
  },
  footer: {
    disclaimer: "Prices are indicative. Always verify VRT with Revenue Commissioners before purchase.",
    madeBy: "Built for Eddie's Toyota hunt \u{1F340}"
  }
};

// src/i18n/ru.json
var ru_default = {
  app: {
    title: "UA \u2192 IE Car Scout",
    subtitle: "\u0418\u0449\u0438 \u043C\u0430\u0448\u0438\u043D\u044B \u0432 \u0423\u043A\u0440\u0430\u0438\u043D\u0435. \u0421\u0447\u0438\u0442\u0430\u0439 \u0440\u0435\u0430\u043B\u044C\u043D\u0443\u044E \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C \u0432\u0432\u043E\u0437\u0430 \u0432 \u0418\u0440\u043B\u0430\u043D\u0434\u0438\u044E."
  },
  nav: {
    search: "\u041F\u043E\u0438\u0441\u043A",
    favourites: "\u0418\u0437\u0431\u0440\u0430\u043D\u043D\u043E\u0435",
    calculator: "\u041A\u0430\u043B\u044C\u043A\u0443\u043B\u044F\u0442\u043E\u0440",
    about: "\u041E \u043F\u0440\u043E\u0435\u043A\u0442\u0435"
  },
  search: {
    placeholder: "\u041C\u0430\u0440\u043A\u0430, \u043C\u043E\u0434\u0435\u043B\u044C \u0438\u043B\u0438 \u043A\u043B\u044E\u0447\u0435\u0432\u043E\u0435 \u0441\u043B\u043E\u0432\u043E...",
    yearFrom: "\u0413\u043E\u0434 \u043E\u0442",
    yearTo: "\u0413\u043E\u0434 \u0434\u043E",
    priceFrom: "\u0426\u0435\u043D\u0430 \u043E\u0442 (\u20AC)",
    priceTo: "\u0426\u0435\u043D\u0430 \u0434\u043E (\u20AC)",
    source: "\u041F\u043B\u043E\u0449\u0430\u0434\u043A\u0430",
    allSources: "\u0412\u0441\u0435 \u043F\u043B\u043E\u0449\u0430\u0434\u043A\u0438",
    search: "\u041D\u0430\u0439\u0442\u0438",
    clear: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C",
    results: "{{count}} \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0439",
    noResults: "\u041E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0434\u0440\u0443\u0433\u0438\u0435 \u0444\u0438\u043B\u044C\u0442\u0440\u044B.",
    loading: "\u041F\u043E\u0438\u0441\u043A...",
    uaSources: "\u{1F1FA}\u{1F1E6} \u0423\u043A\u0440\u0430\u0438\u043D\u0441\u043A\u0438\u0435 \u043F\u043B\u043E\u0449\u0430\u0434\u043A\u0438",
    ieSources: "\u{1F1EE}\u{1F1EA} \u0418\u0440\u043B\u0430\u043D\u0434\u0441\u043A\u0438\u0435 \u043F\u043B\u043E\u0449\u0430\u0434\u043A\u0438",
    openExternal: "\u041E\u0442\u043A\u0440\u043E\u0435\u0442\u0441\u044F \u0432 \u043D\u043E\u0432\u043E\u0439 \u0432\u043A\u043B\u0430\u0434\u043A\u0435",
    apiSearch: "\u041F\u043E\u0438\u0441\u043A \u043F\u043E API",
    externalOpened: "\u041E\u0442\u043A\u0440\u044B\u0442\u043E {{count}} \u0432\u043D\u0435\u0448\u043D\u0438\u0445 \u0441\u0430\u0439\u0442\u043E\u0432"
  },
  sources: {
    autoria: "AUTO.RIA",
    rst: "RST.ua",
    carsua: "CARS.ua",
    olx: "OLX.ua",
    donedeal: "DoneDeal",
    carsireland: "CarsIreland",
    carzone: "Carzone"
  },
  toyota: {
    quickFilter: "\u041B\u044E\u0431\u0438\u043C\u044B\u0435 Toyota",
    ae86: "AE86 Corolla/Sprinter",
    supra_a60: "Supra A60 (81-86)",
    supra_a70: "Supra A70 (86-93)",
    mr2_aw11: "MR2 AW11 (84-89)",
    mr2_sw20: "MR2 SW20 (89-99)",
    celica: "Celica T160/T180",
    corolla: "Corolla (80-96)",
    hilux: "Hilux / Surf"
  },
  listing: {
    source: "\u041F\u043B\u043E\u0449\u0430\u0434\u043A\u0430",
    year: "\u0413\u043E\u0434",
    engine: "\u0414\u0432\u0438\u0433\u0430\u0442\u0435\u043B\u044C",
    mileage: "\u041F\u0440\u043E\u0431\u0435\u0433",
    location: "\u041B\u043E\u043A\u0430\u0446\u0438\u044F",
    price: "\u0426\u0435\u043D\u0430",
    viewListing: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0435",
    save: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",
    saved: "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043E",
    calcImport: "\u041F\u043E\u0441\u0447\u0438\u0442\u0430\u0442\u044C \u0432\u0432\u043E\u0437"
  },
  stats: {
    title: "\u0420\u044B\u043D\u043E\u043A \u0423\u043A\u0440\u0430\u0438\u043D\u044B \u2014 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u0446\u0435\u043D",
    min: "\u041C\u0438\u043D\u0438\u043C\u0443\u043C",
    avg: "\u0421\u0440\u0435\u0434\u043D\u0435\u0435",
    median: "\u041C\u0435\u0434\u0438\u0430\u043D\u0430",
    max: "\u041C\u0430\u043A\u0441\u0438\u043C\u0443\u043C",
    count: "{{count}} \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0439",
    currency: "EUR"
  },
  ireland: {
    title: "\u0418\u0440\u043B\u0430\u043D\u0434\u0441\u043A\u0438\u0439 \u0440\u044B\u043D\u043E\u043A (\u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435)",
    minPrice: "\u041C\u0438\u043D. \u0446\u0435\u043D\u0430 (\u20AC)",
    avgPrice: "\u0421\u0440\u0435\u0434\u043D\u044F\u044F \u0446\u0435\u043D\u0430 (\u20AC)",
    maxPrice: "\u041C\u0430\u043A\u0441. \u0446\u0435\u043D\u0430 (\u20AC)",
    note: "\u0412\u0432\u0435\u0434\u0438 \u0446\u0435\u043D\u044B \u0441 Done Deal, Cars Ireland \u0438\u043B\u0438 Motorcheck",
    sources: "\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u0438: donedeal.ie \xB7 carsireland.ie",
    autoFetch: "\u0410\u0432\u0442\u043E-\u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0441 DoneDeal",
    fetching: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0438\u0440\u043B\u0430\u043D\u0434\u0441\u043A\u0438\u0445 \u0446\u0435\u043D...",
    fetchError: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0438\u0440\u043B\u0430\u043D\u0434\u0441\u043A\u0438\u0435 \u0446\u0435\u043D\u044B",
    found: "{{count}} \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0439 \u043D\u0430\u0439\u0434\u0435\u043D\u043E \u043D\u0430 DoneDeal",
    manualOverride: "\u0420\u0443\u0447\u043D\u043E\u0439 \u0432\u0432\u043E\u0434 \u0446\u0435\u043D (\u043F\u0435\u0440\u0435\u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u0442\u044C)"
  },
  calc: {
    title: "\u041A\u0430\u043B\u044C\u043A\u0443\u043B\u044F\u0442\u043E\u0440 \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u0438 \u0432\u0432\u043E\u0437\u0430",
    carPrice: "\u0426\u0435\u043D\u0430 \u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u044F (\u20AC)",
    carAge: "\u0412\u043E\u0437\u0440\u0430\u0441\u0442 \u0430\u0432\u0442\u043E",
    age30plus: "30+ \u043B\u0435\u0442 (\u043A\u043B\u0430\u0441\u0441\u0438\u043A\u0430)",
    age20to30: "20\u201330 \u043B\u0435\u0442",
    ageUnder20: "\u0414\u043E 20 \u043B\u0435\u0442",
    engine: "\u041E\u0431\u044A\u0451\u043C \u0434\u0432\u0438\u0433\u0430\u0442\u0435\u043B\u044F",
    shipping: "\u0422\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430 UA \u2192 IE (\u20AC)",
    misc: "\u041F\u0440\u043E\u0447\u0438\u0435 \u0440\u0430\u0441\u0445\u043E\u0434\u044B (NCT, \u0441\u0442\u0440\u0430\u0445\u043E\u0432\u043A\u0430 \u0438 \u0442.\u0434.) (\u20AC)",
    breakdown: "\u0414\u0435\u0442\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u0440\u0430\u0441\u0445\u043E\u0434\u043E\u0432",
    vrt: "VRT (\u043D\u0430\u043B\u043E\u0433 \u043D\u0430 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044E)",
    customs: "\u0422\u0430\u043C\u043E\u0436\u0435\u043D\u043D\u0430\u044F \u043F\u043E\u0448\u043B\u0438\u043D\u0430 (6.5%)",
    vat: "\u041D\u0414\u0421 (23%)",
    nox: "\u041D\u0430\u043B\u043E\u0433 NOx",
    shippingLine: "\u0422\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430",
    otherCosts: "\u041F\u0440\u043E\u0447\u0438\u0435 \u0440\u0430\u0441\u0445\u043E\u0434\u044B",
    total: "\u0418\u0442\u043E\u0433\u043E: \u0441\u0435\u0431\u0435\u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C",
    potential: "\u041F\u043E\u0442\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u0440\u0438\u0431\u044B\u043B\u044C vs \u0441\u0440\u0435\u0434\u043D\u044F\u044F IE \u0446\u0435\u043D\u0430",
    vrtNote: "VRT \u0440\u0430\u0441\u0441\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F Revenue \u043F\u043E OMSP \u2014 \u0432\u0441\u0435\u0433\u0434\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u044F\u0439 \u043D\u0430 revenue.ie/vrt",
    classicNote: "\u041A\u043B\u0430\u0441\u0441\u0438\u043A\u0430 30+ \u043B\u0435\u0442 \u043E\u0441\u0432\u043E\u0431\u043E\u0436\u0434\u0435\u043D\u0430 \u043E\u0442 \u0442\u0430\u043C\u043E\u0436\u0435\u043D\u043D\u043E\u0439 \u043F\u043E\u0448\u043B\u0438\u043D\u044B \u043F\u0440\u0438 \u0432\u0432\u043E\u0437\u0435 \u0438\u0437 \u0423\u043A\u0440\u0430\u0438\u043D\u044B",
    profitable: "\u041F\u043E\u0442\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E \u0432\u044B\u0433\u043E\u0434\u043D\u043E",
    breakEven: "\u0411\u0435\u0437\u0443\u0431\u044B\u0442\u043E\u0447\u043D\u043E",
    loss: "\u041D\u0435\u0432\u044B\u0433\u043E\u0434\u043D\u043E \u043F\u0440\u0438 \u0442\u0430\u043A\u043E\u0439 \u0446\u0435\u043D\u0435"
  },
  compare: {
    title: "UA vs IE \u2014 \u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435 \u0446\u0435\u043D",
    uaAvg: "\u0421\u0440\u0435\u0434\u043D\u044F\u044F UA",
    ieAvg: "\u0421\u0440\u0435\u0434\u043D\u044F\u044F IE",
    saving: "\u042D\u043A\u043E\u043D\u043E\u043C\u0438\u044F",
    premium: "\u041D\u0430\u0446\u0435\u043D\u043A\u0430 IE"
  },
  favourites: {
    title: "\u0421\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0435 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u044F",
    empty: "\u041D\u0435\u0442 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0445 \u043E\u0431\u044A\u044F\u0432\u043B\u0435\u043D\u0438\u0439",
    remove: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
    export: "\u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0432 PDF"
  },
  footer: {
    disclaimer: "\u0426\u0435\u043D\u044B \u043E\u0440\u0438\u0435\u043D\u0442\u0438\u0440\u043E\u0432\u043E\u0447\u043D\u044B\u0435. \u0412\u0441\u0435\u0433\u0434\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u044F\u0439 VRT \u0432 Revenue Commissioners \u043F\u0435\u0440\u0435\u0434 \u043F\u043E\u043A\u0443\u043F\u043A\u043E\u0439.",
    madeBy: "\u0421\u0434\u0435\u043B\u0430\u043D\u043E \u0434\u043B\u044F \u043E\u0445\u043E\u0442\u044B \u042D\u0434\u0434\u0438 \u0437\u0430 Toyota \u{1F340}"
  }
};

// src/i18n/index.js
instance.use(import_react_i18next8.initReactI18next).init({
  resources: {
    en: { translation: en_default },
    ru: { translation: ru_default }
  },
  lng: localStorage.getItem("lang") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});
var i18n_default = instance;

// src/App.jsx
function App() {
  const { t: t2 } = (0, import_react_i18next9.useTranslation)();
  const [activeTab, setActiveTab] = (0, import_react5.useState)("search");
  const [selectedPreset, setSelectedPreset] = (0, import_react5.useState)(null);
  const [listings, setListings] = (0, import_react5.useState)([]);
  const [stats, setStats] = (0, import_react5.useState)(null);
  const [irishData, setIrishData] = (0, import_react5.useState)(null);
  const [ieMarket, setIeMarket] = (0, import_react5.useState)(null);
  const [favourites, setFavourites] = (0, import_react5.useState)(() => {
    const saved = localStorage.getItem("carscout_favs");
    return saved ? JSON.parse(saved) : [];
  });
  const [calcListing, setCalcListing] = (0, import_react5.useState)(null);
  (0, import_react5.useEffect)(() => {
    localStorage.setItem("carscout_favs", JSON.stringify(favourites));
  }, [favourites]);
  const handleSave = (listing) => {
    setFavourites((prev) => {
      const exists2 = prev.find((f) => f.id === listing.id);
      if (exists2) return prev.filter((f) => f.id !== listing.id);
      return [...prev, listing];
    });
  };
  const savedIds = favourites.map((f) => f.id);
  const toggleLanguage = () => {
    i18n_default.changeLanguage(i18n_default.language === "en" ? "ru" : "en");
  };
  return /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, /* @__PURE__ */ import_react5.default.createElement("nav", { className: "navbar", role: "navigation", "aria-label": "Main navigation" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "container" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "navbar__inner" }, /* @__PURE__ */ import_react5.default.createElement("a", { href: "#", onClick: (e) => {
    e.preventDefault();
    setActiveTab("search");
  }, className: "navbar__logo", "aria-label": "UA \u2192 IE Car Scout home" }, /* @__PURE__ */ import_react5.default.createElement("svg", { className: "navbar__logo-icon", viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true" }, /* @__PURE__ */ import_react5.default.createElement("rect", { x: "1", y: "1", width: "46", height: "46", rx: "12", fill: "#0A0E1A" }), /* @__PURE__ */ import_react5.default.createElement("path", { d: "M10 31 Q10 29 12 29 L16.5 27.5 Q18 25 24 25 Q30 25 31.5 27.5 L36 29 Q38 29 38 31 L38 33 Q38 34 37 34 L35 34 Q35 32.5 33 32.5 Q31 32.5 31 34 L17 34 Q17 32.5 15 32.5 Q13 32.5 13 34 L11 34 Q10 34 10 33 Z", fill: "white" }), /* @__PURE__ */ import_react5.default.createElement("circle", { cx: "15", cy: "34.5", r: "2.8", fill: "#1E293B", stroke: "white", strokeWidth: "1" }), /* @__PURE__ */ import_react5.default.createElement("circle", { cx: "33", cy: "34.5", r: "2.8", fill: "#1E293B", stroke: "white", strokeWidth: "1" }), /* @__PURE__ */ import_react5.default.createElement("path", { d: "M20 28.5 Q21.5 26 24 26 Q26.5 26 28 28.5 Z", fill: "#2563EB" }), /* @__PURE__ */ import_react5.default.createElement("clipPath", { id: "cl1" }, /* @__PURE__ */ import_react5.default.createElement("rect", { x: "1", y: "39", width: "23", height: "8", rx: "0" })), /* @__PURE__ */ import_react5.default.createElement("rect", { x: "1", y: "39", width: "23", height: "4", fill: "#3B82F6", opacity: "0.55", clipPath: "url(#cl1)" }), /* @__PURE__ */ import_react5.default.createElement("rect", { x: "1", y: "43", width: "23", height: "4", fill: "#FBBF24", opacity: "0.55", clipPath: "url(#cl1)" }), /* @__PURE__ */ import_react5.default.createElement("circle", { cx: "40", cy: "42", r: "5", fill: "#16A34A", opacity: "0.75" }), /* @__PURE__ */ import_react5.default.createElement("text", { x: "40", y: "45", textAnchor: "middle", fontSize: "6", fontWeight: "700", fill: "white", fontFamily: "sans-serif" }, "\u2618")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "navbar__logo-text" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "navbar__logo-title" }, /* @__PURE__ */ import_react5.default.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: "var(--color-ua)", marginRight: 2, verticalAlign: 1 } }, "UA"), "Car Scout", /* @__PURE__ */ import_react5.default.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: "var(--color-ie)", marginLeft: 2, verticalAlign: 1 } }, "IE")), /* @__PURE__ */ import_react5.default.createElement("span", { className: "navbar__logo-sub" }, "Find cars in Ukraine \xB7 Import to Ireland"))), /* @__PURE__ */ import_react5.default.createElement("nav", { className: "navbar__nav", "aria-label": "Page sections" }, /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setActiveTab("search"),
      className: `navbar__nav-item ${activeTab === "search" ? "active" : ""}`,
      style: { background: "none", border: "none", fontFamily: "inherit", cursor: "pointer" }
    },
    "Search"
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setActiveTab("calc"),
      className: `navbar__nav-item ${activeTab === "calc" ? "active" : ""}`,
      style: { background: "none", border: "none", fontFamily: "inherit", cursor: "pointer" }
    },
    "Import Calc"
  ), /* @__PURE__ */ import_react5.default.createElement(
    "button",
    {
      onClick: () => setActiveTab("favs"),
      className: `navbar__nav-item ${activeTab === "favs" ? "active" : ""}`,
      style: { background: "none", border: "none", fontFamily: "inherit", cursor: "pointer" }
    },
    "Favourites ",
    favourites.length > 0 && `(${favourites.length})`
  )), /* @__PURE__ */ import_react5.default.createElement("div", { className: "navbar__actions" }, /* @__PURE__ */ import_react5.default.createElement("button", { onClick: toggleLanguage, className: "lang-badge", "aria-label": "Switch Language" }, i18n_default.language === "en" ? "\u{1F1FA}\u{1F1E6} RU" : "\u{1F1EE}\u{1F1EA} EN"))))), /* @__PURE__ */ import_react5.default.createElement("main", { className: "page-content" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "container" }, activeTab === "search" && /* @__PURE__ */ import_react5.default.createElement("section", { className: "search-section" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "hero-route", "aria-hidden": "true" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "flag" }, "\u{1F1FA}\u{1F1E6}"), " Ukraine", /* @__PURE__ */ import_react5.default.createElement("span", { className: "arrow" }, "\u2192"), /* @__PURE__ */ import_react5.default.createElement("span", { className: "flag" }, "\u{1F1EE}\u{1F1EA}"), " Ireland"), /* @__PURE__ */ import_react5.default.createElement("h1", { className: "search-section__title" }, "Find your next car in Ukraine"), /* @__PURE__ */ import_react5.default.createElement("p", { className: "search-section__sub" }, "Real-time listings. Accurate import cost to Ireland."), /* @__PURE__ */ import_react5.default.createElement(
    ToyotaQuickFilter,
    {
      onSelect: setSelectedPreset,
      selected: selectedPreset?.id
    }
  ), /* @__PURE__ */ import_react5.default.createElement(
    SearchBar,
    {
      preset: selectedPreset,
      onResults: setListings,
      onStats: setStats,
      onIrishResults: setIrishData
    }
  ), stats && /* @__PURE__ */ import_react5.default.createElement(PriceStats, { stats }), (irishData || listings.length > 0) && /* @__PURE__ */ import_react5.default.createElement(
    IrishMarketPanel,
    {
      irishData,
      uaStats: stats,
      modelName: selectedPreset ? `${selectedPreset.make} ${selectedPreset.searchTerms?.[0] || ""}` : "",
      onChange: setIeMarket
    }
  ), listings.length > 0 && /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, /* @__PURE__ */ import_react5.default.createElement("div", { className: "results-header" }, /* @__PURE__ */ import_react5.default.createElement("p", { className: "results-count" }, /* @__PURE__ */ import_react5.default.createElement("strong", null, listings.length), " results found")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "results-grid", role: "list" }, listings.map((l) => /* @__PURE__ */ import_react5.default.createElement(
    ListingCard,
    {
      key: l.id,
      listing: l,
      onSave: handleSave,
      onCalc: () => setCalcListing(l),
      saved: savedIds.includes(l.id)
    }
  ))))), activeTab === "calc" && /* @__PURE__ */ import_react5.default.createElement(ImportCalculator, { ieMarketAvg: ieMarket?.avg }), activeTab === "favs" && /* @__PURE__ */ import_react5.default.createElement("section", { className: "fav-section" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "fav-header" }, /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("h1", { className: "fav-title" }, "Saved Vehicles"), /* @__PURE__ */ import_react5.default.createElement("p", { className: "fav-sub" }, "Review and compare import costs for your shortlisted cars.")), favourites.length > 0 && /* @__PURE__ */ import_react5.default.createElement("button", { onClick: () => window.print(), className: "btn btn-secondary", style: { display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ import_react5.default.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ import_react5.default.createElement("polyline", { points: "6 9 6 2 18 2 18 9" }), /* @__PURE__ */ import_react5.default.createElement("path", { d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" }), /* @__PURE__ */ import_react5.default.createElement("rect", { x: "6", y: "14", width: "12", height: "8" })), "Print List")), favourites.length === 0 ? /* @__PURE__ */ import_react5.default.createElement("div", { className: "empty-state" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "empty-state__icon" }, "\u{1F90D}"), /* @__PURE__ */ import_react5.default.createElement("h2", { className: "empty-state__title" }, "No cars saved yet"), /* @__PURE__ */ import_react5.default.createElement("p", { className: "empty-state__text" }, "Click the heart icon on any listing to save it here for later review."), /* @__PURE__ */ import_react5.default.createElement("button", { onClick: () => setActiveTab("search"), className: "btn btn-primary", style: { marginTop: "var(--space-4)" } }, "Go to Search")) : /* @__PURE__ */ import_react5.default.createElement("div", { className: "results-grid", role: "list" }, favourites.map((l) => /* @__PURE__ */ import_react5.default.createElement(
    ListingCard,
    {
      key: l.id,
      listing: l,
      onSave: handleSave,
      onCalc: () => setCalcListing(l),
      saved: true
    }
  )))))), calcListing && /* @__PURE__ */ import_react5.default.createElement(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1e3,
        padding: "1rem"
      },
      onClick: (e) => {
        if (e.target === e.currentTarget) setCalcListing(null);
      }
    },
    /* @__PURE__ */ import_react5.default.createElement("div", { style: { maxWidth: 640, width: "100%", maxHeight: "90vh", overflowY: "auto", background: "var(--color-bg-surface)", borderRadius: "var(--radius-2xl)" } }, /* @__PURE__ */ import_react5.default.createElement(
      ImportCalculator,
      {
        initialPrice: calcListing.priceEur,
        initialYear: calcListing.year,
        ieMarketAvg: ieMarket?.avg,
        onClose: () => setCalcListing(null)
      }
    ))
  ), /* @__PURE__ */ import_react5.default.createElement("footer", { className: "footer", role: "contentinfo" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "container" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "footer__inner" }, /* @__PURE__ */ import_react5.default.createElement("p", { className: "footer__disclaimer" }, t2("footer.disclaimer") || "Prices are indicative. Always verify VRT with Revenue Commissioners before purchase. VAT and customs calculated per current Irish Revenue guidelines."), /* @__PURE__ */ import_react5.default.createElement("p", { className: "footer__credit" }, t2("footer.madeBy") || "Built for Eddie's Toyota hunt \u2618\uFE0F")))));
}

// test-render.jsx
try {
  console.log("Rendering...");
  (0, import_server.renderToString)(/* @__PURE__ */ import_react6.default.createElement(App, null));
  console.log("Render Success!");
} catch (e) {
  console.error("RENDER ERROR:", e);
}
