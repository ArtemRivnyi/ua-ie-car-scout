import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ToyotaQuickFilter  from './components/ToyotaQuickFilter';
import SearchBar          from './components/SearchBar';
import ListingCard        from './components/ListingCard';
import ImportCalculator   from './components/ImportCalculator';
import PriceStats         from './components/PriceStats';
import IrishMarketPanel   from './components/IrishMarketPanel';
import i18n               from './i18n';

const PAGE_SIZE = 24;

export default function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('search');
  const [selectedPreset, setSelectedPreset] = useState(null);

  // Search results
  const [listings,          setListings]          = useState([]);
  const [stats,             setStats]             = useState(null);
  const [externalUaListings,setExternalUaListings] = useState([]);
  const [externalIeData,    setExternalIeData]     = useState({ listings: [], stats: null });
  const [searchStatus,      setSearchStatus]       = useState({});
  const [ieMarket,          setIeMarket]           = useState(null);

  // Pagination
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Favourites (persisted)
  const [favourites, setFavourites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('carscout_favs') || '[]'); }
    catch { return []; }
  });

  // Calc modal
  const [calcListing, setCalcListing] = useState(null);

  useEffect(() => {
    localStorage.setItem('carscout_favs', JSON.stringify(favourites));
  }, [favourites]);

  const handleSave = useCallback((listing) => {
    setFavourites(prev => {
      const exists = prev.find(f => f.id === listing.id);
      return exists ? prev.filter(f => f.id !== listing.id) : [...prev, listing];
    });
  }, []);

  const savedIds = favourites.map(f => f.id);

  // Reset pagination on new search
  const handleNewListings = useCallback((l) => {
    setListings(l);
    setVisibleCount(PAGE_SIZE);
  }, []);
  const handleNewExternalUa = useCallback((l) => {
    setExternalUaListings(l);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const toggleLanguage = () =>
    i18n.changeLanguage(i18n.language === 'en' ? 'ru' : 'en');

  // All UA results combined (AUTO.RIA + scrapers)
  const allUa = useMemo(() => [...listings, ...externalUaListings], [listings, externalUaListings]);
  // IE results
  const allIe = useMemo(() => externalIeData?.listings || [], [externalIeData]);
  // Combined for display
  const allResults = useMemo(() => [...allUa, ...allIe], [allUa, allIe]);
  const totalFound = allResults.length;

  return (
    <>
      {/* ══════════ NAVBAR ══════════ */}
      <nav className="navbar" role="navigation">
        <div className="container">
          <div className="navbar__inner">
            <a href="#" onClick={e => { e.preventDefault(); setActiveTab('search'); }} className="navbar__logo">
              <img src="/assets/icons/car_scout_logo.png" alt="Car Scout" className="navbar__logo-icon"
                style={{ width: 46, height: 46, objectFit: 'contain' }} />
              <div className="navbar__logo-text">
                <span className="navbar__logo-title">
                  <span style={{fontSize:10,fontWeight:600,color:'var(--color-ua)',marginRight:2}}>UA</span>
                  Car Scout
                  <span style={{fontSize:10,fontWeight:600,color:'var(--color-ie)',marginLeft:2}}>IE</span>
                </span>
                <span className="navbar__logo-sub">Find cars in Ukraine · Import to Ireland</span>
              </div>
            </a>

            <nav className="navbar__nav">
              {[['search','Search'],['calc','Import Calc'],['favs',`Favourites${favourites.length ? ` (${favourites.length})` : ''}`]].map(([tab, label]) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`navbar__nav-item ${activeTab===tab?'active':''}`}
                  style={{background:'none',border:'none',fontFamily:'inherit',cursor:'pointer'}}>
                  {label}
                </button>
              ))}
            </nav>

            <div className="navbar__actions">
              <button onClick={toggleLanguage} className="lang-badge">
                {i18n.language === 'en' ? 'EN 🇮🇪' : 'RU 🇺🇦'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ══════════ MAIN ══════════ */}
      <main className="page-content">
        <div className="container">

          {/* ── SEARCH TAB ── */}
          {activeTab === 'search' && (
            <section className="search-section">
              <div className="hero-route">
                <img src="/assets/icons/flag_ukraine.png" alt="UA"
                  style={{width:24,height:24,verticalAlign:'middle',marginRight:6}} /> Ukraine
                <span className="arrow">→</span>
                <img src="/assets/icons/flag_ireland.png" alt="IE"
                  style={{width:24,height:24,verticalAlign:'middle',margin:'0 6px'}} /> Ireland
              </div>
              <h1 className="search-section__title">Find your next car in Ukraine</h1>
              <p className="search-section__sub">Real-time listings. Accurate import cost to Ireland.</p>

              <ToyotaQuickFilter onSelect={setSelectedPreset} selected={selectedPreset?.id} />

              {/* Status banners */}
              {searchStatus.type && !['finish','error'].includes(searchStatus.type) && (
                <div className="alert alert--info" style={{marginBottom:'var(--space-4)'}}>
                  <p style={{fontSize:'var(--text-sm)',textAlign:'center'}}>
                    ⏳ Scraping data... (Please wait, up to 30s)
                  </p>
                </div>
              )}
              {searchStatus.type === 'error' && (
                <div className="alert alert--warning" style={{marginBottom:'var(--space-4)'}}>
                  <p style={{fontSize:'var(--text-sm)'}}>⚠️ {searchStatus.message}</p>
                </div>
              )}

              <SearchBar
                preset={selectedPreset}
                onResults={handleNewListings}
                onStats={setStats}
                onExternalUaResults={handleNewExternalUa}
                onExternalIeResults={setExternalIeData}
                onSearchStatusChange={setSearchStatus}
              />

              {/* UA Price Stats — show when we have UA data */}
              {(stats || allUa.length > 0) && (
                <div style={{marginTop:'var(--space-6)'}}>
                  <PriceStats
                    title="🇺🇦 Ukraine market — price stats"
                    stats={stats}
                    listings={listings}
                    externalListings={externalUaListings}
                  />
                </div>
              )}

              {/* IE Market Panel — show when we have IE data */}
              {(externalIeData?.stats || allIe.length > 0) && (
                <div style={{marginTop:'var(--space-6)'}}>
                  <IrishMarketPanel
                    irishData={externalIeData}
                    uaStats={stats}
                    modelName={selectedPreset ? `${selectedPreset.make} ${selectedPreset.searchTerms?.[0]||''}` : ''}
                    onChange={setIeMarket}
                  />
                </div>
              )}

              {/* Results */}
              {totalFound > 0 && (
                <div style={{marginTop:'var(--space-6)'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'var(--space-4)'}}>
                    <h3 style={{fontSize:'var(--text-lg)',fontWeight:'var(--weight-semibold)',margin:0}}>
                      {totalFound} {t('resultsFound','results found')}
                    </h3>
                    <span style={{fontSize:'var(--text-sm)',color:'var(--color-text-muted)'}}>
                      Showing {Math.min(visibleCount, totalFound)} of {totalFound}
                    </span>
                  </div>

                  <div className="results-grid" role="list">
                    {allResults.slice(0, visibleCount).map(l => (
                      <ListingCard
                        key={l.id}
                        listing={l}
                        onSave={handleSave}
                        onCalc={() => setCalcListing(l)}
                        saved={savedIds.includes(l.id)}
                        ieMarketAvg={ieMarket?.avg || ieMarket?.median}
                      />
                    ))}
                  </div>

                  {/* Load More button */}
                  {visibleCount < totalFound && (
                    <div style={{textAlign:'center',marginTop:'var(--space-8)'}}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
                        style={{minWidth:200}}
                      >
                        Load more ({totalFound - visibleCount} remaining)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* ── CALC TAB ── */}
          {activeTab === 'calc' && (
            <ImportCalculator ieMarketAvg={ieMarket?.avg || ieMarket?.median} />
          )}

          {/* ── FAVOURITES TAB ── */}
          {activeTab === 'favs' && (
            <section className="fav-section">
              <div className="fav-header">
                <div>
                  <h1 className="fav-title">Saved Vehicles</h1>
                  <p className="fav-sub">Review and compare import costs for your shortlisted cars.</p>
                </div>
                {favourites.length > 0 && (
                  <div style={{display:'flex',gap:'var(--space-3)'}}>
                    <button onClick={() => window.print()} className="btn btn-secondary">
                      🖨️ Print
                    </button>
                    <button onClick={() => setFavourites([])} className="btn btn-ghost"
                      style={{color:'var(--color-danger)'}}>
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              {favourites.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state__icon">
                    <img src="/assets/icons/heart_empty_icon.png" alt="" style={{width:64,height:64,margin:'0 auto'}}/>
                  </div>
                  <h2 className="empty-state__title">No cars saved yet</h2>
                  <p className="empty-state__text">Click the heart on any listing to save it here for comparison.</p>
                  <button onClick={() => setActiveTab('search')} className="btn btn-primary"
                    style={{marginTop:'var(--space-4)'}}>Go to Search</button>
                </div>
              ) : (
                <>
                  <div className="results-grid" role="list">
                    {favourites.map(l => (
                      <ListingCard
                        key={l.id}
                        listing={l}
                        onSave={handleSave}
                        onCalc={() => setCalcListing(l)}
                        saved={true}
                        ieMarketAvg={ieMarket?.avg || ieMarket?.median}
                      />
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

        </div>
      </main>

      {/* ── CALC MODAL ── */}
      {calcListing && (
        <div
          style={{position:'fixed',inset:0,background:'rgba(0,0,0,.65)',backdropFilter:'blur(4px)',
            display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'1rem'}}
          onClick={e => { if(e.target===e.currentTarget) setCalcListing(null); }}
        >
          <div style={{maxWidth:640,width:'100%',maxHeight:'90vh',overflowY:'auto',
            background:'var(--color-bg-surface)',borderRadius:'var(--radius-2xl)'}}>
            <ImportCalculator
              initialPrice={calcListing.priceEur}
              initialYear={calcListing.year}
              ieMarketAvg={ieMarket?.avg || ieMarket?.median}
              onClose={() => setCalcListing(null)}
            />
          </div>
        </div>
      )}

      {/* ══════════ FOOTER ══════════ */}
      <footer className="footer">
        <div className="container">
          <div className="footer__inner">
            <p className="footer__disclaimer">
              {t('footer.disclaimer') || 'Prices are indicative. Always verify VRT with Revenue Commissioners before purchase.'}
            </p>
            <p className="footer__credit">
              Built for Eddie's Toyota hunt
              <img src="/assets/icons/clover_footer_icon.png" alt="☘"
                style={{width:16,height:16,verticalAlign:'middle',marginLeft:4}} />
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
