/**
 * importCalcService.js
 *
 * Calculates the full cost of importing a car from Ukraine to Ireland.
 *
 * Irish taxes involved:
 *  1. VRT  — Vehicle Registration Tax, assessed by Revenue on OMSP
 *             (Open Market Selling Price — set by Revenue inspector, NOT purchase price)
 *  2. Customs duty — 6.5% on landed value (price + shipping) for non-EU cars;
 *             waived for 30y+ classics under CN 97.05
 *  3. VAT — 23% on (landed value + customs duty)
 *  4. NOx levy — tiered surcharge for diesel vehicles at registration
 *
 * Reference:
 *  https://www.revenue.ie/en/vrt/index.aspx
 *  https://www.revenue.ie/en/importing-vehicles-customs-excise/index.aspx
 *
 * ⚠️ VRT is calculated by Revenue on OMSP — NOT on the purchase price.
 *    For classic/rare cars, OMSP can be 2–5× the purchase price.
 *    This calculator provides an ESTIMATE only.
 *    Always verify at: https://www.revenue.ie/en/vrt/vrt-calculator.aspx
 */

/**
 * Customs duty rate — 6.5% for passenger cars from Ukraine (non-EU origin).
 * Applied to landed value (purchase price + shipping + insurance).
 * Cars 30+ years old may qualify for nil rate as antiques under CN 97.05.
 */
export const CUSTOMS_RATE = 0.065;
export const CUSTOMS_EXEMPT_AGE = 30;

/** Irish VAT rate */
export const VAT_RATE = 0.23;

/**
 * Default VRT rate estimate — Band 8 (~20%) is a reasonable mid-range estimate.
 * Actual VRT ranges from 7% (≤80 g/km CO₂) to 41% (>225 g/km CO₂) based on
 * WLTP CO₂ emissions. For classics without CO₂ data, Revenue typically applies
 * a standard assessment.
 *
 * CO₂-based VRT bands (WLTP, from Jan 2022):
 *   Band 1:  0–50 g/km     →  7%
 *   Band 2:  51–80 g/km    →  9%
 *   Band 3:  81–85 g/km    → 9.75%
 *   Band 4:  86–90 g/km    → 10.5%
 *   Band 5:  91–95 g/km    → 11.25%
 *   Band 6:  96–100 g/km   → 12%
 *   Band 7:  101–105 g/km  → 13.5%
 *   Band 8:  106–110 g/km  → 15%
 *   Band 9:  111–115 g/km  → 16.5%
 *   Band 10: 116–120 g/km  → 18%
 *   Band 11: 121–125 g/km  → 19.5%
 *   Band 12: 126–130 g/km  → 21%
 *   Band 13: 131–135 g/km  → 22.5%
 *   Band 14: 136–140 g/km  → 24%
 *   Band 15: 141–145 g/km  → 25.5%
 *   Band 16: 146–150 g/km  → 27%
 *   Band 17: 151–155 g/km  → 29.5%
 *   Band 18: 156–170 g/km  → 32%
 *   Band 19: 171–190 g/km  → 35.5%
 *   Band 20: 191+ g/km     → 41%
 */
const CO2_VRT_BANDS = [
  { maxCo2:  50, rate: 0.07   },
  { maxCo2:  80, rate: 0.09   },
  { maxCo2:  85, rate: 0.0975 },
  { maxCo2:  90, rate: 0.105  },
  { maxCo2:  95, rate: 0.1125 },
  { maxCo2: 100, rate: 0.12   },
  { maxCo2: 105, rate: 0.135  },
  { maxCo2: 110, rate: 0.15   },
  { maxCo2: 115, rate: 0.165  },
  { maxCo2: 120, rate: 0.18   },
  { maxCo2: 125, rate: 0.195  },
  { maxCo2: 130, rate: 0.21   },
  { maxCo2: 135, rate: 0.225  },
  { maxCo2: 140, rate: 0.24   },
  { maxCo2: 145, rate: 0.255  },
  { maxCo2: 150, rate: 0.27   },
  { maxCo2: 155, rate: 0.295  },
  { maxCo2: 170, rate: 0.32   },
  { maxCo2: 190, rate: 0.355  },
  { maxCo2: Infinity, rate: 0.41 },
];

/**
 * Default VRT rate when CO₂ data is not available.
 * 20% is a reasonable mid-range estimate (Band 10–11 area).
 */
export const DEFAULT_VRT_RATE = 0.20;

/**
 * Get VRT rate from CO₂ emissions (WLTP g/km).
 * @param {number|null} co2Gkm - CO₂ emissions in g/km
 * @returns {number} VRT rate as a decimal (e.g. 0.20 for 20%)
 */
export function getVrtRateFromCo2(co2Gkm) {
  if (co2Gkm == null || co2Gkm < 0) return DEFAULT_VRT_RATE;
  const band = CO2_VRT_BANDS.find(b => co2Gkm <= b.maxCo2);
  return band ? band.rate : 0.41;
}

/**
 * NOx levy calculation — applies to ALL vehicles registered after 31 Dec 2019.
 * For petrol cars without NOx data: €0.
 * For diesel: calculated from NOx emissions (mg/km).
 *
 * NOx levy bands:
 *   0–40 mg/km:   €5 per mg/km
 *   41–80 mg/km:  €15 per mg/km
 *   81–120 mg/km: €25 per mg/km
 *   121–180 mg/km: €30 per mg/km
 *   180+ mg/km:   €35 per mg/km
 *
 * @param {number} noxMgKm - NOx emissions in mg/km
 * @returns {number} NOx levy in EUR
 */
export function calculateNoxLevy(noxMgKm) {
  if (!noxMgKm || noxMgKm <= 0) return 0;

  const bands = [
    { max:  40, rate:  5 },
    { max:  80, rate: 15 },
    { max: 120, rate: 25 },
    { max: 180, rate: 30 },
    { max: Infinity, rate: 35 },
  ];

  const band = bands.find(b => noxMgKm <= b.max);
  return Math.round(noxMgKm * (band ? band.rate : 35));
}

/**
 * Calculate full import cost breakdown.
 *
 * @param {object} params
 * @param {number} params.carPrice       - Purchase price in EUR
 * @param {number} params.carYear        - Year of manufacture
 * @param {number} params.shippingCost   - Transport UA→IE in EUR (default 1400)
 * @param {number} params.miscCosts      - NCT prep, insurance, etc. (default 500)
 * @param {number} [params.omsp]         - Optional: known Revenue OMSP override
 * @param {number} [params.co2Gkm]       - Optional: CO₂ emissions in g/km (WLTP) for precise VRT band
 * @param {string} [params.fuelType]     - Optional: 'petrol'|'diesel'|'hybrid'|'electric' for NOx levy
 * @param {number} [params.noxMgKm]      - Optional: NOx emissions in mg/km (for diesel NOx levy)
 * @returns {ImportBreakdown}
 */
export function calculateImportCost({
  carPrice,
  carYear,
  shippingCost = 1400,
  miscCosts = 500,
  omsp = null,
  co2Gkm = null,
  fuelType = 'petrol',
  noxMgKm = null,
}) {
  const currentYear = new Date().getFullYear();
  const carAge = currentYear - carYear;
  const isClassic = carAge >= 30;

  // ── Customs duty ──────────────────────────────────────────────
  // Base = landed value (purchase price + shipping), NOT just purchase price
  const customsValue = carPrice + shippingCost;
  const customsDuty = isClassic ? 0 : Math.round(customsValue * CUSTOMS_RATE);

  // ── VAT ───────────────────────────────────────────────────────
  // Base = landed value + customs duty
  const vatBase = customsValue + customsDuty;
  const vatAmount = Math.round(vatBase * VAT_RATE);

  // ── VRT (estimation — actual is on OMSP assessed by Revenue) ─
  // Revenue sets OMSP independently. For classics, OMSP is typically
  // 2–5× the purchase price. For modern cars, typically ~1.1× purchase price.
  const estimatedOmsp = isClassic ? carPrice * 2.5 : carPrice * 1.1;
  const vrtBase = omsp || estimatedOmsp;
  const vrtRate = co2Gkm != null ? getVrtRateFromCo2(co2Gkm) : DEFAULT_VRT_RATE;
  const vrtAmount = Math.round(vrtBase * vrtRate);

  // ── NOx levy ──────────────────────────────────────────────────
  // Applies to diesel vehicles at registration. Petrol/hybrid/electric: €0.
  const isDiesel = fuelType === 'diesel';
  const noxLevy = isDiesel ? calculateNoxLevy(noxMgKm || 0) : 0;

  // ── Totals ────────────────────────────────────────────────────
  const totalImportTax = customsDuty + vatAmount + vrtAmount + noxLevy;
  const totalLanded = carPrice + totalImportTax + shippingCost + miscCosts;

  // ── Warning ───────────────────────────────────────────────────
  let warning;
  if (isClassic) {
    warning = '⚠️ For classic cars, Revenue sets OMSP independently — real VRT may be 2–5× higher than purchase price. Always check at revenue.ie/en/vrt/vrt-calculator.aspx';
  } else if (co2Gkm != null) {
    warning = '⚠️ VRT rate is based on CO₂ band, but actual OMSP is set by Revenue and may differ from purchase price. Verify at revenue.ie.';
  } else {
    warning = '⚠️ VRT is estimated at ~20%. Exact rate depends on CO₂ emissions (g/km). Enter CO₂ value for a more precise estimate, or verify at revenue.ie.';
  }

  return {
    carPrice,
    carYear,
    carAge,
    isClassic,
    customsValue,
    customsDuty,
    vatAmount,
    vatBase,
    vrtAmount,
    vrtRate,
    vrtBase,
    estimatedOmsp,
    omspOverride: omsp,
    co2Gkm,
    fuelType,
    noxMgKm,
    noxLevy,
    shippingCost,
    miscCosts,
    totalImportTax,
    totalLanded,
    warning,
  };
}

/**
 * Calculate potential profit margin.
 *
 * @param {number} totalLanded  - Result from calculateImportCost
 * @param {number} ieMarketAvg  - Average Irish market price for this model
 * @returns {{ profit: number, margin: number, verdict: string }}
 */
export function calcMargin(totalLanded, ieMarketAvg) {
  const profit = ieMarketAvg - totalLanded;
  const margin = ieMarketAvg > 0 ? Math.round((profit / totalLanded) * 100) : 0;
  const verdict = profit > 500 ? 'profitable' : profit >= -500 ? 'breakEven' : 'loss';
  return { profit: Math.round(profit), margin, verdict };
}
