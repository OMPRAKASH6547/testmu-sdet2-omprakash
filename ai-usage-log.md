# AI Usage Log

## Session: Framework Bootstrap

| Field | Detail |
|-------|--------|
| **Tool** | Cursor AI Agent (Claude) |
| **Date** | 2026-05-23 |
| **Purpose** | Generate enterprise Playwright + TypeScript automation framework for TestMu SDET-2 challenge |

### Why AI Was Used

- Accelerate boilerplate for folder structure, configs, and documentation
- Ensure consistent patterns across UI, API, and integration layers
- Produce senior-level architecture artifacts (test strategy, architecture doc) in parallel with code

### Output Generated

| Category | Artifacts |
|----------|-----------|
| Config | `package.json`, `tsconfig.json`, `playwright.config.ts`, `.env`, `.gitignore` |
| Framework | POM pages, API services, utilities, fixtures, JSON test data |
| Tests | 4 UI specs, 4 API specs, 1 integration spec |
| CI/CD | `.github/workflows/playwright.yml` |
| Docs | `README.md`, `test-strategy.md`, `architecture.md`, `ai-usage-log.md` |

### Human Decisions Made

1. **Demo applications**: Confirmed Sauce Demo (UI) and ReqRes (API) per challenge requirements
2. **Integration approach**: API creates ReqRes user; UI validates Sauce Demo session with sessionStorage correlation (different backends — documented pragmatic E2E pattern)
3. **Selector strategy**: `data-test` attribute mapping via Playwright `testIdAttribute`
4. **CI matrix**: Separate jobs per browser + api + integration for faster feedback and isolated artifacts
5. **Commit structure**: Six logical commits per submission guidelines

### Review Checklist (Human)

- [ ] Run `npm test` locally and verify green suite
- [ ] Review Allure report for step-level clarity
- [ ] Validate no real secrets committed in `.env`
- [ ] Confirm ReqRes API key header if rate-limited
