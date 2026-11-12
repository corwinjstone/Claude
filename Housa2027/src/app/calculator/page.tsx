import { EquityCalculator, type Sample } from '@/features/calculator/EquityCalculator';
import { db, typicalHousaPercent } from '@/lib/data';

export const metadata = { title: 'Home value calculator' };

// Screen 1: Home Equity Calculator. Public, no login, server-rendered for search.
export default function CalculatorPage() {
  const samples: Sample[] = ['prop-001', 'prop-007', 'prop-014', 'prop-017'].map((id) => {
    const p = db.properties.find((x) => x.id === id)!;
    return { id: `housa:${p.id}`, label: `${p.address.street}, ${p.address.city}`, secondary: `TX ${p.address.zip}` };
  });
  return <EquityCalculator typical={typicalHousaPercent()} samples={samples} />;
}
