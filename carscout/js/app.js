/* ═══════════════════════════════════════════════
   UA → IE Car Scout — App Logic
   ═══════════════════════════════════════════════ */

'use strict';

// ── Navbar scroll behaviour ──
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 8);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ── Tab switching ──
(function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabsEl => {
    tabsEl.addEventListener('click', e => {
      const tab = e.target.closest('.tab-item');
      if (!tab) return;

      tabsEl.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;
      if (!target) return;
      document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.hidden = panel.id !== target;
      });
    });
  });
})();

// ── Checkbox source toggles ──
(function initCheckboxes() {
  document.querySelectorAll('.checkbox-wrapper').forEach(wrapper => {
    const box = wrapper.querySelector('.checkbox-box');
    if (!box) return;

    wrapper.addEventListener('click', () => {
      const isChecked = wrapper.classList.toggle('checked');
      wrapper.setAttribute('aria-checked', String(isChecked));

      // Update the visual check mark
      if (isChecked) {
        box.innerHTML = '<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      } else {
        box.innerHTML = '';
      }
    });
  });
})();

// ── Quick pick pills ──
(function initPills() {
  document.querySelectorAll('.pill-btn[data-query]').forEach(pill => {
    pill.addEventListener('click', () => {
      const input = document.querySelector('#keyword-input');
      if (input) {
        input.value = pill.dataset.query;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
      }
    });
  });
})();

// ── Import Cost Calculator ──
(function initCalculator() {
  const calc = document.querySelector('.calc-form');
  if (!calc) return;

  const VRT_RATES = {
    classic: 0.14,   // 30+ years (capped at 14% of OMSP ≈ car price)
    old:     0.215,  // 20-29 years
    modern:  0.25,   // under 20 years (simplified)
  };

  const CUSTOMS_RATE = 0.065; // 6.5% — waived for 30+ year classics from UA

  function getCarAge(year) {
    return new Date().getFullYear() - Number(year);
  }

  function classify(year) {
    const age = getCarAge(year);
    if (age >= 30) return 'classic';
    if (age >= 20) return 'old';
    return 'modern';
  }

  function calculate() {
    const price    = parseFloat(document.getElementById('calc-price')?.value)    || 0;
    const year     = parseInt(document.getElementById('calc-year')?.value)       || 2005;
    const shipping = parseFloat(document.getElementById('calc-shipping')?.value) || 900;
    const other    = parseFloat(document.getElementById('calc-other')?.value)    || 0;

    const cls      = classify(year);
    const age      = getCarAge(year);

    // VRT (simplified: % of car price as OMSP proxy)
    const vrtRate  = VRT_RATES[cls];
    const vrt      = Math.round(price * vrtRate);

    // Customs: 6.5% on car price + shipping; exempt for 30y+ classics
    const customsBase = price + shipping;
    const customs  = cls === 'classic' ? 0 : Math.round(customsBase * CUSTOMS_RATE);

    // VAT: 23% on (price + shipping + customs)
    const vatBase  = price + shipping + customs;
    const vat      = Math.round(vatBase * 0.23);

    // NOx: €0 for classics (pre-emissions era); approximate flat for others
    const nox      = cls === 'classic' ? 0 : 150;

    const total    = price + vrt + customs + vat + nox + shipping + other;

    // Update UI
    setCalcRow('calc-row-price',    price,    false);
    setCalcRow('calc-row-vrt',      vrt,      true,  `${Math.round(vrtRate * 100)}%`);
    setCalcRow('calc-row-customs',  customs,  customs > 0, customs === 0 ? '✓ exempt' : '6.5%');
    setCalcRow('calc-row-vat',      vat,      true,  '23%');
    setCalcRow('calc-row-nox',      nox,      false);
    setCalcRow('calc-row-shipping', shipping, false);
    setCalcRow('calc-row-other',    other,    false);
    setCalcRow('calc-row-total',    total,    false, null, true);

    // Age badge
    const ageBadgeEl = document.getElementById('calc-age-badge');
    if (ageBadgeEl) {
      if (cls === 'classic') {
        ageBadgeEl.textContent = '30+ years (classic)';
        ageBadgeEl.className = 'badge badge--success';
      } else if (cls === 'old') {
        ageBadgeEl.textContent = `${age} years old`;
        ageBadgeEl.className = 'badge badge--warning';
      } else {
        ageBadgeEl.textContent = `${age} years old`;
        ageBadgeEl.className = 'badge badge--default';
      }
    }

    // Customs note
    const customsNote = document.getElementById('calc-customs-note');
    if (customsNote) {
      customsNote.hidden = cls !== 'classic';
    }
  }

  function setCalcRow(id, value, isTax, label, isTotalRow) {
    const row = document.getElementById(id);
    if (!row) return;
    const valEl = row.querySelector('.calc-value');
    if (!valEl) return;

    const formatted = '€\u202F' + value.toLocaleString('de-DE');
    valEl.textContent = formatted;
    valEl.style.color = isTax ? 'var(--color-danger)' : isTotalRow ? 'var(--color-accent)' : '';
    if (value === 0 && isTax) valEl.style.color = 'var(--color-success-text)';

    if (label !== null && label !== undefined) {
      const labelEl = row.querySelector('.calc-rate');
      if (labelEl) labelEl.textContent = label;
    }
  }

  calc.addEventListener('input', calculate);
  calculate(); // initial run
})();

// ── Favourites (localStorage) ──
const Favourites = {
  KEY: 'carscout_favourites',

  getAll() {
    try { return JSON.parse(localStorage.getItem(this.KEY) || '[]'); }
    catch { return []; }
  },

  save(listings) {
    localStorage.setItem(this.KEY, JSON.stringify(listings));
  },

  add(listing) {
    const all = this.getAll();
    if (!all.find(l => l.id === listing.id)) {
      all.unshift(listing);
      this.save(all);
    }
  },

  remove(id) {
    this.save(this.getAll().filter(l => l.id !== id));
  },

  has(id) {
    return this.getAll().some(l => l.id === id);
  }
};

// ── Heart/save buttons ──
(function initSaveButtons() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-save-id]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();

    const id = btn.dataset.saveId;
    const icon = btn.querySelector('svg, .heart-icon');

    if (Favourites.has(id)) {
      Favourites.remove(id);
      btn.classList.remove('saved');
      btn.setAttribute('aria-label', 'Save to favourites');
    } else {
      // Build minimal listing object from closest card
      const card = btn.closest('[data-listing]');
      const listing = card
        ? JSON.parse(card.dataset.listing || '{}')
        : { id };
      listing.id = id;
      Favourites.add(listing);
      btn.classList.add('saved');
      btn.setAttribute('aria-label', 'Remove from favourites');
    }
  });
})();

// ── Number formatting helper ──
window.CarScout = {
  formatPrice(n, currency = '€') {
    return currency + '\u202F' + Math.round(n).toLocaleString('de-DE');
  },
  Favourites,
};
