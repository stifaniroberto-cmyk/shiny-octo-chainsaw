# Life Simulator

A responsive Next.js, TypeScript and Tailwind CSS dashboard comparing life in **Zürich, Tokyo, Dubai and Singapore**. Uses local sample data only; no API keys or external data services are needed.

## Run locally

Requires Node.js **22.18+** (Node 24 recommended) and npm.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000` in your browser. To run a production build:

```sh
npm run build
npm start
```

## Checks

```sh
npm test
npm run typecheck
npm run build
```

The calculation suite tests taxes, currency conversion, monthly-to-annual costs, the 5/10/20-year horizons, investment compounding, inflation, deficits and invalid inputs. Node's built-in test runner runs TypeScript directly, with no transpilation step.

## Explore

- Select any city card to edit its gross salary, effective tax, rent, other costs and exchange rate in local currency.
- Set starting wealth, annual investment return and expense inflation for all cities.
- Switch between 5, 10 and 20 years. Hover charts for exact values and toggle city series using the chart legend.
- Compare monthly income allocation and the milestone table; reset to restore the sample scenario.
- Assumptions live in memory and reset when you reload the page.

## Financial model

Sample inputs are illustrative, **not current salary, tax or market quotes**. `lib/finance.ts` contains the data and pure calculation functions. All comparisons use USD with fixed, editable conversion rates (USD per local unit).

Year-one annual savings = gross annual salary × (1 − effective tax rate) − 12 × (monthly rent + other monthly costs).

For year `t` (starting at 1):

```text
expenses[t] = yearOneExpenses × (1 + inflation)^ (t − 1)
savings[t] = fixedAnnualNetSalary − expenses[t]
wealth[t] = wealth[t − 1] × (1 + annualReturn) + savings[t]
```

Returns and inflation in these formulas are decimal fractions. Contributions happen at year end. Balances can become negative; negative balances accrue the same selected rate. Projections are nominal USD, not inflation-adjusted purchasing power. Salary and effective tax remain fixed. Pensions, social contributions, personal deductions, investment taxes and relocation costs are not separately modeled. This is an exploration tool, not financial advice.

## Structure

- `app/page.tsx`: interactive dashboard and Recharts visualizations
- `app/globals.css`: responsive layout and Tailwind entry point
- `lib/finance.ts`: sample data and financial model
- `tests/finance.test.ts`: financial calculation tests

Webpack is used for development and production builds for compatibility with restricted cloud environments that block Turbopack worker ports. The app serves its assets locally and does not download fonts or query external APIs.
