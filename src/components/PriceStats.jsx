import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { calcPriceStats } from '../services/priceService';

export default function PriceStats({ stats, listings = [], externalListings = [], title }) {
  const { t } = useTranslation();

  const allListings    = [...listings, ...externalListings];
  const mergedStats    = allListings.length > 0 ? calcPriceStats(allListings) : stats;

  if (!mergedStats) return null;

  const displayTitle = title || `🇺🇦 ${t('stats.title') || 'Ukraine market — price stats'}`;

  const metrics = [
    { key: 'min',    label: 'Min',    value: mergedStats.min,                       color: 'var(--color-success-text)' },
    { key: 'median', label: 'Median', value: mergedStats.median,                    color: 'var(--color-accent)' },
    { key: 'avg',    label: 'Avg',    value: mergedStats.avgFiltered || mergedStats.avg, color: 'var(--color-text-primary)' },
    { key: 'max',    label: 'Max',    value: mergedStats.max,                       color: 'var(--color-danger-text)' },
  ];

  // Histogram bins
  const prices = allListings.map(l => l.priceEur).filter(p => p > 0).sort((a, b) => a - b);
  const chartData = [];
  if (prices.length >= 2) {
    const lo   = prices[0];
    const hi   = prices[prices.length - 1];
    const step = Math.max((hi - lo) / 10, 1);
    const bins = Array(10).fill(0);
    prices.forEach(p => {
      let b = Math.floor((p - lo) / step);
      if (b >= 10) b = 9;
      bins[b]++;
    });
    bins.forEach((count, i) => {
      chartData.push({
        label: `€${Math.round(lo + i * step).toLocaleString()}`,
        count,
      });
    });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{background:'var(--color-bg-elevated)',border:'1px solid var(--color-border)',
        padding:'6px 12px',borderRadius:'var(--radius-md)',fontSize:'var(--text-sm)'}}>
        <p style={{margin:0,fontWeight:600}}>{payload[0].value} listings</p>
        <p style={{margin:0,color:'var(--color-text-muted)',fontSize:11}}>{label}</p>
      </div>
    );
  };

  return (
    <div className="search-main" style={{marginBottom:'var(--space-6)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'var(--space-4)'}}>
        <div>
          <h3 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',margin:0}}>
            {displayTitle}
          </h3>
          <p style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)',margin:'4px 0 0'}}>
            {mergedStats.count} listings analysed
            {mergedStats.outliers?.length > 0 && ` · ${mergedStats.outliers.length} outlier(s) excluded from avg`}
          </p>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'var(--space-3)',marginBottom:'var(--space-5)'}}>
        {metrics.map(m => (
          <div key={m.key} style={{background:'var(--color-bg-subtle)',borderRadius:'var(--radius-lg)',padding:'var(--space-3)'}}>
            <p style={{fontSize:'var(--text-xs)',color:'var(--color-text-muted)',marginBottom:4,textTransform:'uppercase',letterSpacing:'0.05em'}}>{m.label}</p>
            <p style={{fontSize:'var(--text-xl)',fontWeight:'var(--weight-semibold)',color:m.color,margin:0}}>
              €{m.value?.toLocaleString() || '—'}
            </p>
          </div>
        ))}
      </div>

      {chartData.length >= 2 && (
        <div style={{height:140}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{top:0,right:0,left:-25,bottom:0}}>
              <XAxis dataKey="label" tick={{fontSize:9,fill:'var(--color-text-muted)'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:10,fill:'var(--color-text-muted)'}} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{fill:'var(--color-bg-subtle)'}} />
              <Bar dataKey="count" radius={[4,4,0,0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill="var(--color-accent)" opacity={0.7 + 0.3 * (i / chartData.length)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
