import React from 'react';
import { useTranslation } from 'react-i18next';
import { calculateImportCost, calcMargin } from '../services/importCalcService';

export default function ListingCard({ listing, onSave, onCalc, saved, ieMarketAvg }) {
  const { t } = useTranslation();

  const hasPhoto = listing.photos && listing.photos.length > 0;

  // Import cost breakdown
  let totalLanded = null;
  let profitability = null;

  if (listing.priceEur > 0) {
    const imp = calculateImportCost({
      carPrice:     listing.priceEur,
      carYear:      listing.year || 2000,
      shippingCost: 900,
      miscCosts:    500,
    });
    totalLanded = imp.totalLanded;

    // Profitability badge — only if we have an IE market reference
    if (ieMarketAvg && ieMarketAvg > 0) {
      profitability = calcMargin(totalLanded, ieMarketAvg);
    }
  }

  const dotClass = `source-dot source-dot--${(listing.source||'').toLowerCase().replace(/[.\s]/g,'')}`;
  const isClassic = listing.year && (new Date().getFullYear() - listing.year) >= 30;

  // Profitability color/label
  let profitBg    = 'var(--color-bg-subtle)';
  let profitColor = 'var(--color-text-muted)';
  let profitLabel = '';
  if (profitability) {
    const p = profitability.profit;
    if (p > 500)  { 
      profitBg = 'var(--color-success-bg)';  
      profitColor = 'var(--color-success-text)';  
      profitLabel = `Save €${p.toLocaleString()} vs Ireland`; 
    }
    else if (p > -500) { 
      profitBg = 'var(--color-warning-bg)'; 
      profitColor = 'var(--color-warning-text)'; 
      profitLabel = `≈ Same price as Ireland`; 
    }
    else { 
      profitBg = 'var(--color-danger-bg)';   
      profitColor = 'var(--color-danger-text)';   
      profitLabel = `Costs €${Math.abs(p).toLocaleString()} more than Ireland`; 
    }
  }

  return (
    <article className="car-card" role="listitem">
      {/* Image */}
      {hasPhoto ? (
        <img src={listing.photos[0]} alt={`${listing.make} ${listing.model}`}
          className="car-card__image" loading="lazy"
          onError={e => {
            e.target.onerror = null;
            e.target.replaceWith(Object.assign(document.createElement('div'), {
              className: 'demo-result-img',
              innerHTML: '<img src="/assets/icons/family_car_icon.png" width="48" height="48" style="opacity:0.3"/>'
            }));
          }}
        />
      ) : (
        <div className="demo-result-img" aria-hidden="true">
          <img src="/assets/icons/family_car_icon.png" width="48" height="48" style={{opacity:0.3}}/>
        </div>
      )}

      <div className="car-card__body">
        {/* Header */}
        <div className="car-card__header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div style={{flex:1,minWidth:0}}>
            <h3 className="car-card__title">
              {listing.description || `${listing.make} ${listing.model} ${listing.year || ''}`.trim()}
            </h3>
            <div className="car-card__meta">
              {listing.year    && <span className="car-card__meta-item">📅 {listing.year}</span>}
              {listing.mileageKm > 0 && <span className="car-card__meta-item">⏱ {listing.mileageKm.toLocaleString()} km</span>}
              {listing.location && <span className="car-card__meta-item">📍 {listing.location}</span>}
              <span className="car-card__meta-item">
                <span className="source-chip">
                  <span className={dotClass}></span>
                  {listing.source}
                </span>
              </span>
              {isClassic && <span className="badge badge--success" style={{fontSize:11}}>30+ yr classic</span>}
            </div>
          </div>

          <button className={`btn-save ${saved?'saved':''}`} onClick={(e) => { e.stopPropagation(); onSave(listing); }}
            aria-label={saved ? 'Remove from favourites' : 'Save to favourites'}>
            <svg width="16" height="16" viewBox="0 0 24 24"
              fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        {/* Price + profitability */}
        <div className="car-card__footer">
          <div style={{minWidth:0,flex:1}}>
            <div className="car-card__price">
              €{listing.priceEur ? listing.priceEur.toLocaleString() : '—'}
            </div>
            {totalLanded && (
              <div className="car-card__price-landed" style={{marginTop:2}}>
                landed: <span className="car-card__price-total">~€{totalLanded.toLocaleString()}</span>
              </div>
            )}
            {/* Profitability badge */}
            {profitability && (
              <div style={{
                display:'inline-flex', alignItems:'center', gap:4, marginTop:4,
                padding:'2px 8px', borderRadius:'var(--radius-full)', fontSize:12, fontWeight:600,
                background: profitBg, color: profitColor,
              }}>
                {profitability.profit > 500 ? '📈' : profitability.profit > -500 ? '➡️' : '📉'}
                {profitLabel}
              </div>
            )}
            {!listing.priceEur && listing.priceOriginal > 0 && (
              <div className="car-card__price-landed">
                ${listing.priceOriginal.toLocaleString()} {listing.priceOriginalCurrency}
              </div>
            )}
          </div>

          <div className="car-card__actions">
            {listing.priceEur > 0 && (
              <button onClick={(e) => { e.stopPropagation(); onCalc(listing); }} className="btn btn-secondary btn-sm">
                Calc
              </button>
            )}
            <a href={listing.sourceUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm"
              onClick={e => e.stopPropagation()}>
              View →
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
