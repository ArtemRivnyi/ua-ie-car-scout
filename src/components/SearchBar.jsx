import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { searchAutoRia, fetchAutoRiaListings } from '../services/autoRiaService';
import { calcPriceStats } from '../services/priceService';
import { AUTORIA_TOYOTA_MARK_ID, ALL_TOYOTA_MODELS_80S_90S } from '../utils/toyotaModels';
import { UA_SOURCES, IE_SOURCES, scrapeUkraine, scrapeIreland } from '../services/externalSearchService';

export default function SearchBar({ onResults, onStats, onIrishResults, onExternalUaResults, onExternalIeResults, onSearchStatusChange, preset }) {
  const { t } = useTranslation();
  const [query,       setQuery]       = useState('');
  const [yearFrom,    setYearFrom]    = useState('');
  const [yearTo,      setYearTo]      = useState('');
  const [priceFrom,   setPriceFrom]   = useState('');
  const [priceTo,     setPriceTo]     = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [resultCount, setResultCount] = useState(null);

  const [uaSources, setUaSources] = useState({ autoria: true, rst: true, carsua: false, olx: false });
  const [ieSources, setIeSources] = useState({ donedeal: true, carsireland: true, carzone: false });

  useEffect(() => {
    if (!preset) return;
    setQuery(preset.searchTerms?.[0] || preset.make || '');
    setYearFrom(preset.yearFrom || '');
    setYearTo(preset.yearTo || '');
    setPriceFrom('');
    setPriceTo('');
    setError(null);
    setResultCount(null);
  }, [preset]);

  const toggleUa = (id) => setUaSources(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleIe = (id) => setIeSources(prev => ({ ...prev, [id]: !prev[id] }));

  const handleSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    onSearchStatusChange?.({ type: 'start' });
    setLoading(true);
    setError('');
    setResultCount(null);

    let autoriaListings = [];
    let scrapedUaListings = [];

    try {
      const promises = [];

      // 1. AutoRIA via backend API proxy
      if (uaSources.autoria) {
        onSearchStatusChange?.({ type: 'scraping_autoria', status: 'fetching' });
        let q = query;
        let markId = null;
        let modelId = null;
        
        if (preset) {
          markId = preset.markId;
          modelId = preset.modelId;
          if (preset.make === 'Toyota') {
            markId = AUTORIA_TOYOTA_MARK_ID;
            if (!modelId) {
              const matched = ALL_TOYOTA_MODELS_80S_90S.find(m => preset.searchTerms?.includes(m.name));
              if (matched) modelId = matched.modelId;
            }
          }
          if (markId) {
            q = ''; // Don't use text search if we have exact markId, AutoRIA text search is buggy
          } else if (!q) {
            q = preset.searchTerms?.[0] || preset.make || '';
          }
        }

        promises.push(
          searchAutoRia({ query: q, yearFrom, yearTo, markId, modelId, priceFrom, priceTo, page: 0, count: 50 })
            .then(async data => {
              if (data && data.ids && data.ids.length > 0) {
                const listings = await fetchAutoRiaListings(data.ids);
                autoriaListings = listings;
                setResultCount(data.total || 0);
                onSearchStatusChange?.({ type: 'scraping_autoria', status: 'done', count: listings.length });
              } else {
                onSearchStatusChange?.({ type: 'scraping_autoria', status: 'done', count: 0 });
              }
            })
            .catch(err => console.error('[AutoRIA]', err))
        );
      }

      // 2. UA Scrapers (RST, OLX, CARS.ua)
      const activeUaSources = UA_SOURCES.filter(s => !s.hasApi && uaSources[s.id]).map(s => s.id);
      if (activeUaSources.length > 0) {
        onSearchStatusChange?.({ type: 'scraping_ua', status: 'fetching', sources: activeUaSources });
        promises.push(
          scrapeUkraine(activeUaSources, query || preset?.make || '', yearFrom, yearTo, priceFrom, priceTo)
            .then(uaResults => {
              scrapedUaListings = uaResults.listings || [];
              onSearchStatusChange?.({ type: 'scraping_ua', status: 'done', count: scrapedUaListings.length });
            })
            .catch(err => console.error('[UA Scrape]', err))
        );
      } else {
        onExternalUaResults?.([]);
      }

      // 3. IE Scrapers (DoneDeal, CarsIreland, Carzone)
      const activeIeSources = IE_SOURCES.filter(s => ieSources[s.id]).map(s => s.id);
      if (activeIeSources.length > 0) {
        onSearchStatusChange?.({ type: 'scraping_ie', status: 'fetching', sources: activeIeSources });
        const searchMake = preset?.make || (query ? query.split(' ')[0] : '');
        const searchModel = preset?.model || (query ? query.split(' ').slice(1).join(' ') : '');
        
        promises.push(
          scrapeIreland(activeIeSources, searchMake, searchModel, yearFrom, yearTo, priceFrom, priceTo)
            .then(ieResults => {
              onExternalIeResults?.(ieResults || { listings: [], stats: null });
              onSearchStatusChange?.({ type: 'scraping_ie', status: 'done', count: ieResults.listings?.length || 0 });
            })
            .catch(err => {
              console.error('[IE Scrape]', err);
              onExternalIeResults?.({ listings: [], stats: null });
            })
        );
      } else {
        onExternalIeResults?.({ listings: [], stats: null });
      }

      // Execute all search requests concurrently
      await Promise.allSettled(promises);

      // Distribute results to parent component
      onResults(autoriaListings);
      if (activeUaSources.length > 0) {
        onExternalUaResults?.(scrapedUaListings);
      }

      // 4. Compute COMBINED UA stats (AutoRIA + scraped UA)
      const allUaListings = [...autoriaListings, ...scrapedUaListings];
      if (allUaListings.length > 0) {
        const combinedStats = calcPriceStats(allUaListings);
        onStats(combinedStats);
      } else {
        onStats(null);
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
      onSearchStatusChange?.({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
      onSearchStatusChange?.({ type: 'finish' });
    }
  };

  const handleClear = () => {
    setQuery('');
    setYearFrom('');
    setYearTo('');
    setPriceFrom('');
    setPriceTo('');
    setError(null);
    setResultCount(null);
    onResults?.([]);
    onStats?.(null);
    onExternalUaResults?.([]);
    onExternalIeResults?.({ listings: [], stats: null });
  };

  return (
    <div className="search-main">
      <div className="sources-section">
        <div>
          <div className="section-label">
            <img src="/assets/icons/flag_ukraine.png" alt="UA" style={{ width: '24px', height: '24px', verticalAlign: 'middle', objectFit: 'contain' }} />
            <span className="section-label__text">{t('search.uaSources') || 'Ukraine sources'}</span>
          </div>
          <div className="sources-row">
            {UA_SOURCES.map(source => (
              <SourceCheckbox
                key={source.id}
                source={source}
                checked={uaSources[source.id]}
                onChange={() => toggleUa(source.id)}
                t={t}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="section-label">
            <img src="/assets/icons/flag_ireland.png" alt="IE" style={{ width: '24px', height: '24px', verticalAlign: 'middle', objectFit: 'contain' }} />
            <span className="section-label__text">{t('search.ieSources') || 'Ireland sources'}</span>
          </div>
          <div className="sources-row">
            {IE_SOURCES.map(source => (
              <SourceCheckbox
                key={source.id}
                source={source}
                checked={ieSources[source.id]}
                onChange={() => toggleIe(source.id)}
                t={t}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="search-bar" role="search">
        <svg className="search-bar__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          type="search"
          list="toyota-models-list"
          className="search-bar__input"
          placeholder={t('search.placeholder')}
          value={query}
          onChange={e => {
            const val = e.target.value;
            setQuery(val);
            if (ALL_TOYOTA_MODELS_80S_90S.includes(val)) {
              setYearFrom('1980');
              setYearTo('1995');
            }
          }}
          onKeyDown={e => { if (e.key === 'Enter') handleSearch(e); }}
          autoComplete="off"
          spellCheck="false"
        />
        <datalist id="toyota-models-list">
          {ALL_TOYOTA_MODELS_80S_90S.map(m => <option key={m} value={m} />)}
        </datalist>
      </div>

      <div className="filters-row" role="group">
        <div className="field">
          <label className="field__label">{t('search.yearFrom')}</label>
          <input type="number" className="input" value={yearFrom} onChange={e => setYearFrom(e.target.value)} placeholder="1980" min="1950" />
        </div>
        <div className="field">
          <label className="field__label">{t('search.yearTo')}</label>
          <input type="number" className="input" value={yearTo} onChange={e => setYearTo(e.target.value)} placeholder="2000" min="1950" />
        </div>
        <div className="field">
          <label className="field__label">{t('search.priceFrom')}</label>
          <input type="number" className="input" value={priceFrom} onChange={e => setPriceFrom(e.target.value)} placeholder="0" min="0" />
        </div>
        <div className="field">
          <label className="field__label">{t('search.priceTo')}</label>
          <input type="number" className="input" value={priceTo} onChange={e => setPriceTo(e.target.value)} placeholder="50000" min="0" />
        </div>
      </div>

      <div className="search-actions">
        <button className="btn-search" type="button" onClick={handleSearch} disabled={loading}>
          {loading ? (
             <span>⏳ Loading...</span>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              {t('search.search')}
            </>
          )}
        </button>
        <button className="btn-clear" type="button" onClick={handleClear}>
          {t('search.clear')}
        </button>

        {error && <span style={{ fontSize: 13, color: 'var(--color-danger)' }}>⚠️ {error}</span>}
      </div>
    </div>
  );
}

function SourceCheckbox({ source, checked, onChange, t }) {
  // Map source ID to CSS dot color class
  const dotClass = `source-dot source-dot--${source.id.toLowerCase()}`;
  
  return (
    <label 
      className={`checkbox-wrapper ${checked ? 'checked' : ''}`} 
      role="checkbox" 
      aria-checked={checked} 
      tabIndex="0"
      onClick={onChange}
      onKeyDown={e => { if(e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onChange(); } }}
    >
      <div className="checkbox-box">
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span className="checkbox-label">
        <span className={dotClass}></span>
        {t(source.i18nKey)}
        {!source.hasApi && (
          <span style={{fontSize:10, color:'var(--color-text-muted)'}}>↗</span>
        )}
        {source.hasApi && (
          <span className="api-badge">API</span>
        )}
      </span>
    </label>
  );
}
