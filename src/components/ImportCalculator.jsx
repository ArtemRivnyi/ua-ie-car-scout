import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { calculateImportCost, calcMargin } from '../services/importCalcService';

export default function ImportCalculator({ initialPrice, initialYear, ieMarketAvg, onClose }) {
  const { t } = useTranslation();

  const [carPrice, setCarPrice] = useState(initialPrice || 5000);
  const [carYear,  setCarYear]  = useState(initialYear  || 1985);
  const [shipping, setShipping] = useState(1400);
  const [misc,     setMisc]     = useState(500);
  const [fuelType, setFuelType] = useState('petrol');
  const [co2Gkm,   setCo2Gkm]  = useState('');
  const [noxMgKm,  setNoxMgKm]  = useState('');
  const [omspOverride, setOmspOverride] = useState('');

  useEffect(() => {
    if (initialPrice != null) setCarPrice(initialPrice);
    if (initialYear != null)  setCarYear(initialYear);
  }, [initialPrice, initialYear]);

  const breakdown = calculateImportCost({
    carPrice: Number(carPrice) || 0,
    carYear:  Number(carYear)  || 2000,
    shippingCost: Number(shipping) || 0,
    miscCosts:    Number(misc)     || 0,
    fuelType,
    co2Gkm:  co2Gkm !== '' ? Number(co2Gkm) : null,
    noxMgKm: noxMgKm !== '' ? Number(noxMgKm) : null,
    omsp:    omspOverride !== '' ? Number(omspOverride) : null,
  });

  const margin = ieMarketAvg ? calcMargin(breakdown.totalLanded, ieMarketAvg) : null;

  const ageBadge = (() => {
    if (breakdown.carAge >= 30) return { label: '30+ years (classic)', class: 'badge--success' };
    if (breakdown.carAge >= 20) return { label: '20-29 years', class: 'badge--warning' };
    return { label: 'Under 20 years', class: 'badge--primary' };
  })();

  const verdictStyle = {
    profitable: { class: 'alert--success', icon: '📈' },
    breakEven:  { class: 'alert--warning', icon: '⚖️' },
    loss:       { class: 'alert--danger', icon: '📉' },
  };

  const fmtEur = (n) => `€${(n || 0).toLocaleString()}`;

  return (
    <div className="calc-card" style={onClose ? { margin: 0 } : {}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <div className="calc-card__title" style={{ margin: 0 }}>
          <img src="/assets/icons/calculator_icon.png" alt="Calculator" style={{ width: '24px', height: '24px', objectFit: 'contain' }} aria-hidden="true" />
          {t('calc.title') || 'Import cost calculator'}
        </div>
        
        {onClose && (
          <button onClick={onClose} className="btn-clear" style={{ fontSize: 24, padding: 0, width: 32, height: 32, lineHeight: 1 }} aria-label="Close">
            &times;
          </button>
        )}
      </div>

      <form className="calc-form" noValidate onSubmit={e => e.preventDefault()}>
        <div className="calc-grid">
          <div className="field">
            <label className="field__label">{t('calc.carPrice')}</label>
            <input
              type="number" className="input"
              value={carPrice} onChange={e => setCarPrice(e.target.value)}
              min="0" step="100" placeholder="5 000"
            />
          </div>
          <div className="field">
            <label className="field__label">{t('calc.carAge')}</label>
            <div style={{display:'flex', gap:'var(--space-3)', alignItems:'center'}}>
              <input
                type="number" className="input"
                value={carYear} onChange={e => setCarYear(e.target.value)}
                min="1950" max="2025" placeholder="1985"
              />
              <span className={`badge ${ageBadge.class}`}>{ageBadge.label}</span>
            </div>
          </div>
          <div className="field">
            <label className="field__label">{t('calc.shipping') || 'Shipping UA → IE (€)'}</label>
            <input
              type="number" className="input"
              value={shipping} onChange={e => setShipping(e.target.value)}
              min="0" step="50" placeholder="1400"
            />
          </div>
          <div className="field">
            <label className="field__label">{t('calc.misc')}</label>
            <input
              type="number" className="input"
              value={misc} onChange={e => setMisc(e.target.value)}
              min="0" step="50" placeholder="500"
            />
          </div>

          {/* Fuel type selector */}
          <div className="field">
            <label className="field__label">{t('calc.fuelType') || 'Fuel type'}</label>
            <select className="input" value={fuelType} onChange={e => setFuelType(e.target.value)}>
              <option value="petrol">⛽ Petrol</option>
              <option value="diesel">🛢️ Diesel</option>
              <option value="hybrid">🔋 Hybrid</option>
              <option value="electric">⚡ Electric</option>
            </select>
          </div>

          {/* CO₂ for precise VRT band */}
          <div className="field">
            <label className="field__label">
              {t('calc.co2') || 'CO₂ (g/km, WLTP)'}
              <span style={{fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: 4}}>
                optional
              </span>
            </label>
            <input
              type="number" className="input"
              value={co2Gkm} onChange={e => setCo2Gkm(e.target.value)}
              min="0" max="500" step="1" placeholder="e.g. 120"
            />
          </div>

          {/* NOx for diesel */}
          {fuelType === 'diesel' && (
            <div className="field">
              <label className="field__label">
                {t('calc.noxInput') || 'NOx (mg/km)'}
                <span style={{fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: 4}}>
                  for diesel NOx levy
                </span>
              </label>
              <input
                type="number" className="input"
                value={noxMgKm} onChange={e => setNoxMgKm(e.target.value)}
                min="0" max="500" step="1" placeholder="e.g. 80"
              />
            </div>
          )}

          {/* OMSP override */}
          <div className="field">
            <label className="field__label">
              {t('calc.omsp') || 'OMSP override (€)'}
              <span style={{fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: 4}}>
                if known from Revenue
              </span>
            </label>
            <input
              type="number" className="input"
              value={omspOverride} onChange={e => setOmspOverride(e.target.value)}
              min="0" step="100" placeholder={`est. €${Math.round(breakdown.estimatedOmsp).toLocaleString()}`}
            />
          </div>
        </div>

        <div className="calc-result">
          <div className="calc-result__header">{t('calc.breakdown') || 'Cost breakdown'}</div>

          <table className="cost-table" aria-label="Import cost breakdown">
            <tbody>
              <tr>
                <td className="cost-table__label">{t('calc.carPrice')}</td>
                <td className="calc-value">{fmtEur(breakdown.carPrice)}</td>
              </tr>
              <tr className="cost-row--tax">
                <td className="cost-table__label">
                  {t('calc.vrt')}
                  <span className="calc-rate" style={{color:'var(--color-text-muted)', fontSize:12}}>
                    ({(breakdown.vrtRate * 100).toFixed(1)}%{co2Gkm === '' ? ' est.' : ''} of OMSP)
                  </span>
                </td>
                <td className="calc-value">{fmtEur(breakdown.vrtAmount)}</td>
              </tr>
              <tr style={{fontSize: 12, color: 'var(--color-text-muted)'}}>
                <td className="cost-table__label" style={{paddingLeft: 20}}>
                  └ OMSP base: {fmtEur(breakdown.vrtBase)}
                  {!breakdown.omspOverride && <span style={{fontSize: 11}}> (estimated)</span>}
                </td>
                <td></td>
              </tr>
              <tr className={breakdown.customsDuty === 0 ? "cost-row--free" : "cost-row--tax"}>
                <td className="cost-table__label">
                  {t('calc.customs')} (6.5%)
                  {breakdown.isClassic && (
                    <span className="calc-rate" style={{fontSize:12, color:'var(--color-success-text)'}}>✓ exempt</span>
                  )}
                </td>
                <td className="calc-value">{fmtEur(breakdown.customsDuty)}</td>
              </tr>
              <tr className="cost-row--tax">
                <td className="cost-table__label">
                  {t('calc.vat')}
                  <span className="calc-rate" style={{color:'var(--color-text-muted)', fontSize:12}}>(23%)</span>
                </td>
                <td className="calc-value">{fmtEur(breakdown.vatAmount)}</td>
              </tr>
              <tr className={breakdown.noxLevy > 0 ? "cost-row--tax" : ""}>
                <td className="cost-table__label">
                  {t('calc.nox')}
                  {fuelType === 'diesel' && breakdown.noxLevy > 0 && (
                    <span className="calc-rate" style={{fontSize:12, color:'var(--color-warning-text)'}}> (diesel)</span>
                  )}
                </td>
                <td className="calc-value">{fmtEur(breakdown.noxLevy)}</td>
              </tr>
              <tr>
                <td className="cost-table__label">{t('calc.shippingLine')}</td>
                <td className="calc-value">{fmtEur(breakdown.shippingCost)}</td>
              </tr>
              <tr>
                <td className="cost-table__label">{t('calc.otherCosts')}</td>
                <td className="calc-value">{fmtEur(breakdown.miscCosts)}</td>
              </tr>
              <tr className="cost-row--total">
                <td style={{fontWeight:600, color:'var(--color-text-primary)'}}>{t('calc.total')}</td>
                <td className="calc-value">{fmtEur(breakdown.totalLanded)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {margin && (
          <div className={`alert ${verdictStyle[margin.verdict]?.class}`} style={{ marginTop: 'var(--space-4)' }}>
            <span style={{ fontSize: 24, marginRight: 8 }}>{verdictStyle[margin.verdict]?.icon}</span>
            <div>
              <strong style={{ display: 'block', marginBottom: 4 }}>{t(`calc.${margin.verdict}`)}</strong>
              <span>{t('calc.potential')}: {margin.profit >= 0 ? '+' : ''}{fmtEur(margin.profit)} ({margin.margin}%) vs IE avg</span>
            </div>
          </div>
        )}

        <div style={{display:'flex', flexDirection:'column', gap:'var(--space-3)', marginTop:'var(--space-5)'}}>
          {/* Dynamic warning from calculator */}
          {breakdown.warning && (
            <div className="alert alert--warning">
              <img src="/assets/icons/warning_icon.png" alt="Warning" className="alert__icon" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
              <span>
                {breakdown.warning}
              </span>
            </div>
          )}

          {breakdown.isClassic && (
            <div className="alert alert--success">
              <img src="/assets/icons/shield_icon.png" alt="Exempt" className="alert__icon" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
              <span>
                {t('calc.classicNote') || 'Classic cars (30y+) are exempt from customs duty when imported from Ukraine.'}
              </span>
            </div>
          )}

          <div className="alert alert--info" style={{ fontSize: 12, opacity: 0.85 }}>
            <span>
              💡 {t('calc.vrtNote') || 'VRT is assessed by Revenue on OMSP (Open Market Selling Price) — not your purchase price.'}
              {' '}
              <a href="https://www.revenue.ie/en/importing-vehicles-duty-free-allowances/guide-to-vrt/index.aspx"
                 target="_blank" rel="noopener noreferrer">Verify at revenue.ie/vrt</a>
            </span>
          </div>
        </div>

      </form>
    </div>
  );
}
