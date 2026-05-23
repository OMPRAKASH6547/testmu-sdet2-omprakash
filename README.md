# testmu-sdet2-omprakash

Enterprise-grade test automation framework for the **TestMu AI SDET-2 Quality Engineering Challenge**, built with **Playwright**, **TypeScript**, **Axios**, and **Allure**.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Actions CI                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  Playwright Test Runner                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  UI Tests   │  │  API Tests  │  │ Integration Tests   │  │
│  │ (SauceDemo) │  │  (ReqRes)   │  │  API + UI flow      │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
└─────────┼────────────────┼────────────────────┼─────────────┘
          │                │                    │
┌─────────▼────────┐ ┌─────▼──────┐    ┌────────▼────────┐
│   Page Objects   │ │ API Layer  │    │ Shared Utils    │
│   (POM)          │ │ Services   │    │ Logger / Retry  │
└──────────────────┘ └────────────┘    └─────────────────┘
```

- **UI**: [Sauce Demo](https://www.saucedemo.com) — login, inventory, checkout validation
- **API**: [ReqRes](https://reqres.in) — auth, CRUD, schema validation, error handling
- **Integration**: API user creation correlated with UI session validation

## Prerequisites

- Node.js **18+**
- npm **9+**
- Java **8+** (required for Allure CLI)

## Setup

```bash
git clone <repository-url>
cd testmu-sdet2-omprakash
npm install
npx playwright install --with-deps
cp .env .env.local   # optional: override secrets locally
```

## Environment Configuration

Set `ENV` to `dev`, `qa`, or `prod`. Configuration is loaded from:

- `.env` — runtime secrets and overrides
- `src/config/env.{dev|qa|prod}.ts` — environment profiles

| Variable | Description | Default |
|----------|-------------|---------|
| `ENV` | Active environment | `qa` |
| `BASE_URL` | UI base URL | `https://www.saucedemo.com` |
| `API_BASE_URL` | API base URL | `https://reqres.in/api` |
| `API_KEY` | ReqRes API key from [app.reqres.in](https://app.reqres.in/api-keys) | — |
| `USE_API_MOCK` | Mock ReqRes when no API key (`true`/`false`) | `true` |
| `STANDARD_USER` | Valid Sauce Demo user | `standard_user` |
| `STANDARD_PASSWORD` | Valid password | `secret_sauce` |

## Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (all projects) |
| `npm run test:ui` | UI tests only |
| `npm run test:api` | API tests only |
| `npm run test:integration` | Integration tests |
| `npm run test:smoke` | Smoke tests (`@smoke`) |
| `npm run test:chromium` | Chromium UI tests |
| `npm run test:ci` | CI mode with retries |
| `npm run lint` | TypeScript type check |
| `npm run report` | Open Playwright HTML report |
| `npm run allure:generate` | Generate Allure report |
| `npm run allure:open` | Open generated Allure report |
| `npm run allure:serve` | Serve live Allure from results |

## Folder Structure

```
testmu-sdet2-omprakash/
├── .github/workflows/playwright.yml
├── src/
│   ├── api/           # HTTP client, services, schemas
│   ├── pages/         # Page Object Model
│   ├── fixtures/      # Playwright custom fixtures
│   ├── test-data/     # JSON-driven test data
│   ├── utils/         # Logger, retry, waits, assertions
│   └── config/        # Environment profiles
├── tests/
│   ├── ui/
│   ├── api/
│   └── integration/
├── reports/           # Custom report outputs
├── allure-results/
├── allure-report/
└── playwright.config.ts
```

## Reporting

### Playwright HTML

```bash
npm run report
```

### Allure

```bash
npm test
npm run allure:generate
npm run allure:open
```

Artifacts on failure: screenshots, traces, videos (on retry).

## CI/CD

The GitHub Actions workflow (`.github/workflows/playwright.yml`):

1. Matrix execution across **chromium**, **firefox**, **webkit**, **api**, **integration**
2. `npm ci` + Playwright browser install
3. TypeScript compile check
4. Parallel test execution with CI retries
5. Uploads HTML report, Allure results, and failure artifacts
6. Merges Allure results into a consolidated report job

## Scaling Strategy

- Add new pages under `src/pages/` extending `BasePage`
- Add API services under `src/api/services/`
- Extend JSON test data for data-driven cases
- Tag tests (`@smoke`, `@api`, `@ui`) for selective execution
- Shard Playwright in CI with `--shard=1/4`

## Future Improvements

- Visual regression (Percy / Playwright snapshot)
- API contract testing (Pact)
- Test management integration (TestRail / Zephyr)
- Dockerized test execution
- Performance testing (k6) in pipeline

## Author

**Omprakash** — TestMu AI SDET-2 Challenge Submission
