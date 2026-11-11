import { CalculatorV2 } from '@/features/calculator-v2/CalculatorV2';
import type { Sample } from '@/features/calculator/EquityCalculator';
import { db, typicalHousaPercent } from '@/lib/data';

export const metadata = { title: 'Home value calculator (design B)' };

// Screen 1, design B: a second take on the Home Equity Calculator, kept beside the original for comparison.
export default function Page() {
  const samples: Sample[] = ['prop-001', 'prop-007', 'prop-014', 'prop-017'].map((id) => {
    const p = db.properties.find((x) => x.id === id)!;
    return { id: `housa:${p.id}`, label: `${p.address.street}, ${p.address.city}`, secondary: `TX ${p.address.zip}` };
  });
  return <CalculatorV2 typical={typicalHousaPercent()} samples={samples} />;
}
