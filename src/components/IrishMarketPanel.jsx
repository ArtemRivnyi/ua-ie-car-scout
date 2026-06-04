import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { calcPriceStats } from '../services/priceService';
import CompareBar from './CompareBar';

export default function IrishMarketPanel({ onChange, modelName, irishData, uaStats }) {
  const { t } = useTranslation();

  const [stats,    setStats]    = useState(null);
  const [listings, setListings] = useState([]);
  const [min, setMin] = useState('');
  const [avg, setAvg] = useState('');
  const [max, setMax] = useState('');
  const [median, setMedian] = useState('');
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    if (!irishData) return;

    let s = irishData.stats;
    const ls = irishData.listings || [];
    setListings(ls);

    // Compute stats if not provided by backend (always recompute for accuracy)
    if (ls.length > 0) {
      s = calcPriceStats(ls);
      if (s) s.count = ls.length;
    }

    if (s) {
      setStats(s);
      setMin(String(s.min    || ''));
      setAvg(String(s.avgFiltered || s.avg || ''));
      setMax(String(s.max    || ''));
      setMedian(String(s.median || ''));
      onChange?.({ min: s.min, avg: s.avgFiltered || s.avg, median: s.median, max: s.max });
    }
  }, [irishData]);

  const handleManualUpdate = (field, val) => {
    if (field === 'min')    setMin(val);
    if (field === 'avg')    setAvg(val);
    if (field === 'max')    setMax(val);
    if (field === 'median') setMedian(val);
    const n = v => Number(v) || 0;
    onChange?.({
      min:    n(field === 'min'    ? val : min),
      avg:    n(field === 'avg'    ? val : avg),
      max:    n(field === 'max'    ? val : max),
      median: n(field === 'median' ? val : median),
    });
  };

  const metrics = [
    { key: 'min',    label: 'Min',    value: Number(min)    || stats?.min },
    { key: 'median', label: 'Median', value: Number(median) || stats?.median },
    { key: 'avg',    label: 'Avg',    value: Number(avg)    || stats?.avgFiltered || stats?.avg },
    { key: 'max',    label: 'Max',    value: Number(max)    || stats?.max },
  ];

  const doneDealUrl = `https://www.donedeal.ie/cars?q=${encodeURIComponent(modelName || 'Toyota')}`;

  return (
    <div className="search-main" style={{marginBottom:'var(--space-6)'}}>
      <h3 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',marginBottom:'var(--space-4)',color:'var(--color-text-primary)'}}>
        🇮🇪 {t('ireland.title') || 'Irish market (comparison)'}
      </h3>

      {stats ? (
        <>
          <p style={{fontSize:'var(--text-sm)',color:'var(--color-success-text)',marginBottom:'var(--space-3)'}}>
            ✅ {stats.count} listings found on Irish market
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'var(--space-3)',marginBottom:'var(--space-4)'}}>
            {metrics.map(m => (
              <div key={m.key} style={{
                background:'var(--color-ie-bg)', borderRadius:'var(--radius-lg)',
                padding:'var(--space-3)', textAlign:'center',
                border:'1px solid rgba(22,163,74,.15)'
              }}>
                <p style={{fontSize:'var(--text-xs)',color:'var(--color-success-text)',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.05em'}}>{m.label}</p>
                <p style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',color:'var(--color-success-text)',margin:0}}>
                  €{m.value?.toLocaleString() || '—'}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="alert alert--warning" style={{marginBottom:'var(--space-4)'}}>
          <p style={{fontSize:'var(--text-sm)'}}>
            ⚠️ {t('ireland.notFound') || 'No similar cars found on DoneDeal. You can enter prices manually.'}
          </p>
        </div>
      )}

      {/* Listings preview */}
      {listings.length > 0 && (
        <div style={{marginBottom:'var(--space-4)',maxHeight:200,overflowY:'auto',
          borderRadius:'var(--radius-md)',border:'1px solid var(--color-border)'}}>
          {listings.slice(0, 10).map((l, i) => (
            <a key={l.id || i} href={l.sourceUrl} target="_blank" rel="noreferrer"
              style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                padding:'8px 12px',borderBottom:'1px solid var(--color-border)',
                textDecoration:'none',color:'var(--color-text-primary)',fontSize:'var(--text-sm)',
                transition:'background .1s'}}
              onMouseEnter={e => e.currentTarget.style.background='var(--color-bg-subtle)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >
              <span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                {l.make} {l.model} {l.year||''}
              </span>
              <span style={{fontWeight:'var(--weight-semibold)',color:'var(--color-success)',marginLeft:10}}>
                €{l.priceEur?.toLocaleString() || '—'}
              </span>
              <span style={{fontSize:11,color:'var(--color-text-muted)',marginLeft:8}}>{l.location} ↗</span>
            </a>
          ))}
          {listings.length > 10 && (
            <p style={{padding:'8px 12px',fontSize:12,color:'var(--color-text-muted)',margin:0}}>
              +{listings.length - 10} more listings
            </p>
          )}
        </div>
      )}

      {/* Manual input toggle */}
      <button type="button" onClick={() => setShowManual(p => !p)}
        style={{fontSize:'var(--text-sm)',color:'var(--color-accent)',background:'none',
          border:'none',cursor:'pointer',padding:0,marginBottom:'var(--space-4)',textDecoration:'underline'}}>
        {showManual ? 'Hide manual prices' : 'Enter prices manually'}
      </button>

      {showManual && (
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'var(--space-3)',marginBottom:'var(--space-4)'}}>
          {[['min','Min'],['median','Median'],['avg','Avg'],['max','Max']].map(([k,l]) => (
            <div className="field" key={k}>
              <label className="field__label">{l} (€)</label>
              <input type="number" className="input"
                value={k==='min'?min:k==='avg'?avg:k==='max'?max:median}
                onChange={e => handleManualUpdate(k, e.target.value)} />
            </div>
          ))}
        </div>
      )}

      <div style={{display:'flex',gap:'var(--space-3)',alignItems:'center',marginTop:'var(--space-2)'}}>
        <a href={doneDealUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
          Open DoneDeal ↗
        </a>
      </div>

      {/* Compare bar */}
      <CompareBar
        uaAvg={uaStats?.median || uaStats?.avgFiltered || uaStats?.avg}
        ieAvg={Number(median) || Number(avg) || stats?.median || stats?.avg}
      />
    </div>
  );
}
