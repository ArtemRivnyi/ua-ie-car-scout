import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ListingCard from './ListingCard';
import React from 'react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe('ListingCard Component', () => {
  const mockListing = {
    make: 'Toyota',
    model: 'Corolla',
    year: 2010,
    priceEur: 5000,
    source: 'RST',
    sourceUrl: 'http://example.com',
    photos: []
  };

  it('renders listing basic info correctly', () => {
    render(<ListingCard listing={mockListing} onSave={() => {}} onCalc={() => {}} />);
    
    expect(screen.getByText(/Toyota Corolla/)).toBeInTheDocument();
    expect(screen.getByText(/€\s*5[\s,\xA0]*000/)).toBeInTheDocument();
    expect(screen.getAllByText(/2010/)).toHaveLength(2); // In title and in meta
    expect(screen.getByText('RST')).toBeInTheDocument();
  });

  it('displays landed cost when price is > 0', () => {
    render(<ListingCard listing={mockListing} onSave={() => {}} onCalc={() => {}} />);
    expect(screen.getByText(/landed:/)).toBeInTheDocument();
  });

  it('displays profitability badge if ieMarketAvg is provided', () => {
    render(<ListingCard listing={mockListing} ieMarketAvg={15000} onSave={() => {}} onCalc={() => {}} />);
    expect(screen.getByText(/Save/i)).toBeInTheDocument();
  });

  it('calls onCalc when Calc button is clicked', () => {
    const handleCalc = vi.fn();
    render(<ListingCard listing={mockListing} onSave={() => {}} onCalc={handleCalc} />);
    const calcBtn = screen.getByText('Calc');
    calcBtn.click();
    expect(handleCalc).toHaveBeenCalledWith(mockListing);
  });
});
