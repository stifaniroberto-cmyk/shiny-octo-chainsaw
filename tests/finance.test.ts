import test from 'node:test';
import assert from 'node:assert/strict';
import { cashFlow, project, type City } from '../lib/finance.ts';
const city: City = { id: 'test', name: 'Test', country: '', currency: 'USD', color: '', salary: 100000, tax: 20, rent: 2000, living: 1000, fx: 1 };
test('annual cash flow includes taxes, monthly expenses and currency conversion', () => {
  assert.deepEqual(cashFlow(city), { gross: 100000, taxes: 20000, costs: 36000, savings: 44000, net: 80000 });
  assert.equal(cashFlow({ ...city, fx: 2 }).savings, 88000);
});
test('zero return adds annual savings at each horizon', () => {
  for (const years of [5, 10, 20]) assert.equal(project(city, years, 10000, 0, 0).at(-1)?.wealth, 10000 + years * 44000);
});
test('compounds starting wealth and contributes savings at year end', () => {
  assert.equal(project(city, 2, 10000, 10, 0)[2].wealth, 104500);
});
test('inflation increases expenses starting in year two', () => {
  const rows = project(city, 2, 0, 0, 10);
  assert.equal(rows[1].savings, 44000);
  assert.ok(Math.abs(rows[2].savings - 40400) < 1e-8);
});
test('preserves deficits and zero-year starting balance', () => {
  assert.equal(project(city, 0, 123, 5, 2)[0].wealth, 123);
  assert.equal(project({ ...city, salary: 0 }, 1, 0, 0, 0)[1].wealth, -36000);
});
test('rejects invalid horizons, nonfinite inputs and impossible rates', () => {
  assert.throws(() => project(city, -1, 0, 0, 0), RangeError);
  assert.throws(() => project(city, 1, NaN, 0, 0), RangeError);
  assert.throws(() => project(city, 1, 0, -100, 0), RangeError);
});
