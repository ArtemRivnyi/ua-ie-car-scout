import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function CompareBar({ uaAvg, ieAvg }) {
  const { t } = useTranslation();

  if (!uaAvg || !ieAvg) return null;

  const data = [
    { name: t('compare.uaAvg') || 'UA Avg', price: uaAvg, fill: 'var(--color-ua)' },
    { name: t('compare.ieAvg') || 'IE Avg', price: ieAvg, fill: 'var(--color-ie)' }
  ];

  const diff = ieAvg - uaAvg;
  const isSaving = diff > 0;
  const diffPct = Math.abs(Math.round((diff / uaAvg) * 100));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', padding: '8px 12px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', boxShadow: 'var(--shadow-floating)' }}>
          <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-primary)' }}>{payload[0].payload.name}: €{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-border)' }}>
      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
        ⚖️ {t('compare.title') || 'Market Comparison'}
      </h4>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
        <div className={isSaving ? "alert alert--success" : "alert alert--danger"} style={{ width: '100%', display: 'block' }}>
          <p style={{ fontSize: 'var(--text-sm)', marginBottom: 2, fontWeight: 'var(--weight-medium)' }}>
            {isSaving ? t('compare.saving') || 'Potential savings' : t('compare.premium') || 'Premium paid'}
          </p>
          <p style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', margin: 0 }}>
            €{Math.abs(diff).toLocaleString()} <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>({diffPct}%)</span>
          </p>
        </div>
      </div>

      <div style={{ height: 100, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500, fill: 'var(--color-text-muted)' }} width={90} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(150,150,150,0.1)' }} />
            <Bar dataKey="price" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
