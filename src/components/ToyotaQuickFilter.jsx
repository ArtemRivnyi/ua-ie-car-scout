import { useTranslation } from 'react-i18next';
import { TOYOTA_FAVOURITES } from '../utils/toyotaModels';

export default function ToyotaQuickFilter({ onSelect, selected }) {
  const { t } = useTranslation();

  return (
    <div style={{ marginBottom: 'var(--space-6)' }}>
      <p style={{
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-semibold)',
        color: 'var(--color-text-muted)',
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        marginBottom: 'var(--space-3)',
      }}>
        {t('toyota.quickFilter') || 'Toyota favourites'}
      </p>
      <div className="quick-picks">
        {TOYOTA_FAVOURITES.map(preset => (
          <button
            key={preset.id}
            onClick={() => onSelect?.(preset)}
            className={`pill-btn ${selected === preset.id ? 'active' : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <img src={preset.icon} alt="" className="preset-icon" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
            {t(preset.i18nKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
