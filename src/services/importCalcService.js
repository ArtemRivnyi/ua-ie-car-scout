/**
 * importCalcService.js
 *
 * Calculates the full cost of importing a car from Ukraine to Ireland.
 *
 * Irish taxes involved:
 *  1. VRT  — Vehicle Registration Tax, assessed by Revenue on OMSP
 *  2. Customs duty — 6.5% on cars from non-EU (Ukraine), waived for 30y+ classics
 *  3. VAT — 23% on (car price + customs duty)
 *  4. NOx levy — €0 for pre-2021 cars (no NOx data / exempt)
 *
 * Reference:
 *  https://www.revenue.ie/en/vrt/index.aspx
 *  https://www.revenue.ie/en/importing-vehicles-customs-excise/index.aspx
 *
 * NOTE: VRT is calculated by Revenue on OMSP (Open Market Selling Price),
 * NOT on the purchase price. For rare/classic cars this can differ significantly.
 * Always verify at: https://www.revenue.ie/en/vrt/vrt-calculator.aspx
 */

/**
 * VRT rate bands (CO2-based for modern cars; for classics Revenue uses
 * a fixed OMSP assessment — we approximate with age-based flat rates here)
 */
export const VRT_RATES = {
  classic:   0.14,  // 30y+ — Revenue tends to set low OMSP for classics; ~14% of purchase price rough estimate
  aged:      0.25,  // 20-30y
  modern:    0.20,  // under 20y — actual rate depends on CO2 band (7%–41%)
};

/**
 * Customs duty rate — 6.5% for passenger cars from Ukraine (non-EU origin).
 * Cars 30+ years old may qualify for reduced/nil rate as antiques under CN 97.05.
 * TODO: confirm with a customs broker for current post-war import rules.
 */
export const CUSTOMS_RATE = 0.065;
export const CUSTOMS_EXEMPT_AGE = 30;  // years — adjust if rules change

export const VAT_RATE = 0.23;

/**
 * NOx levy (introduced 2020, applies to NEW registrations post Jan 2021 only)
 * Pre-2021 cars: €0
 */
export const NOX_LEVY = 0;

/**
 * Calculate full import cost breakdown.
 *
 * @param {object} params
 * @param {number} params.carPrice       - Purchase price in EUR
 * @param {number} params.carYear        - Year of manufacture
 * @param {number} params.shippingCost   - Transport UA→IE in EUR (default 900)
 * @param {number} params.miscCosts      - NCT prep, insurance, etc. (default 500)
 * @param {number} [params.omsp]         - Optional: known Revenue OMSP override
 * @returns {ImportBreakdown}
 */
export function calculateImportCost({
  carPrice,
  carYear,
  shippingCost = 900,
  miscCosts = 500,
  omsp = null,
}) {
  const currentYear = new Date().getFullYear();
  const carAge = currentYear - carYear;

  const isClassic = carAge >= 30;
  const isAged    = carAge >= 20 && carAge < 30;

  // Customs duty
  const customsDuty = isClassic ? 0 : Math.round(carPrice * CUSTOMS_RATE);

  // VAT base = carPrice + customsDuty
  const vatBase = carPrice + customsDuty;
  const vatAmount = Math.round(vatBase * VAT_RATE);

  // VRT (approximation — actual is on OMSP assessed by Revenue inspector)
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
    totalLanded,
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
  const verdict = profit > 500 ? 'profitable' : profit > -500 ? 'breakEven' : 'loss';
  return { profit: Math.round(profit), margin, verdict };
}
