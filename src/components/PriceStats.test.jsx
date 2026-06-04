import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PriceStats from './PriceStats';
import React from 'react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// Recharts components rely on ResizeObserver which isn't in jsdom by default
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('PriceStats Component', () => {
  it('renders nothing when no stats provided', () => {
    const { container } = render(<PriceStats stats={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders metrics correctly with provided stats', () => {
    const mockStats = {
      count: 10,
      min: 1000,
      max: 5000,
      median: 3000,
      avgFiltered: 3100,
      avg: 3000,
      outliers: [10000]
    };

    render(<PriceStats stats={mockStats} title="Test Market Stats" />);
    
    expect(screen.getByText('Test Market Stats')).toBeInTheDocument();
    expect(screen.getByText(/10 listings analysed/)).toBeInTheDocument();
    expect(screen.getByText(/1 outlier\(s\) excluded from avg/)).toBeInTheDocument();
    
    expect(screen.getByText(/€\s*1[\s,\xA0]*000/)).toBeInTheDocument(); // Min
    expect(screen.getByText(/€\s*3[\s,\xA0]*000/)).toBeInTheDocument(); // Median
    expect(screen.getByText(/€\s*3[\s,\xA0]*100/)).toBeInTheDocument(); // AvgFiltered
    expect(screen.getByText(/€\s*5[\s,\xA0]*000/)).toBeInTheDocument(); // Max
  });

  it('calculates stats dynamically if listings are provided instead of precomputed stats', () => {
    const listings = [
      { priceEur: 1000 },
      { priceEur: 2000 },
      { priceEur: 3000 },
    ];
    render(<PriceStats listings={listings} title="Dynamic Stats" />);
    
    expect(screen.getByText('Dynamic Stats')).toBeInTheDocument();
    expect(screen.getByText(/3 listings analysed/)).toBeInTheDocument();
    expect(screen.getByText(/€\s*1[\s,\xA0]*000/)).toBeInTheDocument(); // Min
    expect(screen.getAllByText(/€\s*2[\s,\xA0]*000/)).toHaveLength(2); // Median and Avg are both 2000
    expect(screen.getByText(/€\s*3[\s,\xA0]*000/)).toBeInTheDocument(); // Max
  });
});
