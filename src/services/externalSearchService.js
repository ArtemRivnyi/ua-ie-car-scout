/**
 * externalSearchService.js — UA & IE source registry + backend API callers
 */

const API_BASE = import.meta.env.VITE_API_BASE
  ? import.meta.env.VITE_API_BASE.replace(/\/api\/?$/, '') + '/api'
  : 'https://ua-ie-car-scout-api.onrender.com/api';

/** Fetch Irish listings via backend proxy */
export async function scrapeIreland(sources, make, model, yearFrom, yearTo, priceFrom, priceTo) {
  const params = new URLSearchParams();
  if (sources.length) params.set('sources', sources.join(','));
  if (make)      params.set('make', make);
  if (model)     params.set('model', model);
  if (yearFrom)  params.set('yearFrom', yearFrom);
  if (yearTo)    params.set('yearTo', yearTo);
  if (priceFrom) params.set('priceFrom', priceFrom);
  if (priceTo)   params.set('priceTo', priceTo);

  const res = await fetch(`${API_BASE}/scrape/ie?${params}`);
  if (!res.ok) throw new Error(`IE scrape error: ${res.status}`);
  return res.json();
}

/** Fetch Ukraine listings via backend proxy */
export async function scrapeUkraine(sources, query, yearFrom, yearTo, priceFrom, priceTo) {
  const params = new URLSearchParams();
  if (sources.length) params.set('sources', sources.join(','));
  if (query)     params.set('query', query);
  if (yearFrom)  params.set('yearFrom', yearFrom);
  if (yearTo)    params.set('yearTo', yearTo);
  if (priceFrom) params.set('priceFrom', priceFrom);
  if (priceTo)   params.set('priceTo', priceTo);

  const res = await fetch(`${API_BASE}/scrape/ua?${params}`);
  if (!res.ok) throw new Error(`UA scrape error: ${res.status}`);
  return res.json();
}

// Source definitions
export const UA_SOURCES = [
  { id: 'autoria',  i18nKey: 'sources.autoria',  hasApi: true,  buildUrl: q => `https://auto.ria.com/uk/search/?q=${encodeURIComponent(q)}` },
  { id: 'rst',      i18nKey: 'sources.rst',      hasApi: false, buildUrl: q => `https://rst.ua/oldcars/${q.toLowerCase().split(' ').join('/')}/` },
  { id: 'carsua',   i18nKey: 'sources.carsua',   hasApi: false, buildUrl: q => `https://cars.ua/search/${q.toLowerCase().replace(/\s+/g,'/')}` },
  { id: 'olx',      i18nKey: 'sources.olx',      hasApi: false, buildUrl: q => `https://www.olx.ua/uk/transport/legkovye-avtomobili/q-${encodeURIComponent(q)}/` },
];

export const IE_SOURCES = [
  { id: 'donedeal',    i18nKey: 'sources.donedeal',    hasApi: true,  buildUrl: q => `https://www.donedeal.ie/cars?words=${encodeURIComponent(q)}` },
  { id: 'carsireland', i18nKey: 'sources.carsireland', hasApi: false, buildUrl: q => `https://www.carsireland.ie/search?make=${q.split(' ')[0]}` },
  { id: 'carzone',     i18nKey: 'sources.carzone',     hasApi: false, buildUrl: q => `https://www.carzone.ie/search?make=${q.split(' ')[0]}` },
];
