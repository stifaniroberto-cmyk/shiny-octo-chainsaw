export type City = { id: string; name: string; country: string; currency: string; color: string; salary: number; tax: number; rent: number; living: number; fx: number };
// Illustrative annual gross salaries and monthly costs in local currency. fx = USD per local unit.
export const cities: City[] = [
  { id: 'zurich', name: 'Zürich', country: 'Switzerland', currency: 'CHF', color: '#a5c98c', salary: 125000, tax: 25, rent: 2400, living: 1700, fx: 1.13 },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', currency: 'JPY', color: '#a49bd6', salary: 10000000, tax: 28, rent: 180000, living: 140000, fx: 0.0067 },
  { id: 'dubai', name: 'Dubai', country: 'UAE', currency: 'AED', color: '#dfb575', salary: 360000, tax: 0, rent: 8500, living: 5500, fx: 0.2723 },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', currency: 'SGD', color: '#7cbcc4', salary: 150000, tax: 15, rent: 3500, living: 1900, fx: 0.745 },
];
export function cashFlow(city: City) {
  const gross = city.salary * city.fx;
  const taxes = gross * city.tax / 100;
  const costs = (city.rent + city.living) * 12 * city.fx;
  return { gross, taxes, costs, savings: gross - taxes - costs, net: gross - taxes };
}
export function project(city: City, years: number, initial: number, annualReturn: number, inflation: number) {
  if (!Number.isInteger(years) || years < 0 || years > 100) throw new RangeError('Years must be an integer between 0 and 100');
  if (![initial, annualReturn, inflation, ...Object.values(city).filter(v => typeof v === 'number')].every(Number.isFinite)) throw new RangeError('Inputs must be finite');
  if (annualReturn <= -100 || inflation <= -100) throw new RangeError('Rates must exceed -100%');
  const flow = cashFlow(city);
  let wealth = initial;
  const result = [{ year: 0, wealth, savings: 0 }];
  for (let year = 1; year <= years; year++) {
    // Salary and effective tax rate stay fixed; expenses grow with inflation.
    const savings = flow.net - flow.costs * (1 + inflation / 100) ** (year - 1);
    wealth = wealth * (1 + annualReturn / 100) + savings;
    result.push({ year, wealth, savings });
  }
  return result;
}
