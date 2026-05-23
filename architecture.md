# Architecture — testmu-sdet2-omprakash

## Design Principles

- **SOLID**: Single-responsibility page objects and API services; dependency injection via Playwright fixtures
- **DRY**: Shared `BasePage`, `HttpClient`, utilities, and JSON test data
- **Separation of concerns**: Tests orchestrate; pages/services implement behavior

## Why Playwright?

| Capability | Benefit |
|------------|---------|
| Auto-waiting | Reduces flaky UI tests |
| Multi-browser | Chromium, Firefox, WebKit from one API |
| API + UI in one runner | Unified reporting and CI |
| Trace/video/screenshot | Fast failure diagnosis |
| TypeScript-first | Strong typing for enterprise maintainability |

## Why Page Object Model (POM)?

- Encapsulates `data-test` selectors — **no raw locators in tests**
- UI changes require updates in one class, not N spec files
- Readable tests that express business intent: `loginPage.login(user, pass)`

```
Test Spec  →  Fixture  →  Page Object  →  Playwright Page
```

## Why Allure?

- Rich HTML reports with steps, attachments, and history
- Stakeholder-friendly output beyond developer-centric CLI logs
- Integrates with `allure-playwright` reporter with minimal config

## Why GitHub Actions?

- Native to GitHub repositories for SDET submissions
- Matrix parallelism across browsers and test types
- Artifact upload for HTML + Allure reports on every run
- `workflow_dispatch` for on-demand execution

## Layer Architecture

```
tests/
  └── uses fixtures & test-data
src/pages/          → UI abstraction (POM)
src/api/services/   → Business API operations
src/api/clients/    → HTTP transport (Axios)
src/api/schemas/    → Ajv JSON contracts
src/utils/          → Cross-cutting concerns
src/config/         → Environment profiles
```

## Scaling Approach

1. **Horizontal**: Add specs + data JSON rows without code duplication (parameterized tests)
2. **Vertical**: New domains get new `src/pages/{domain}` and `src/api/services/{domain}`
3. **CI**: Shard with `--shard=i/n`, tag-based grep (`@smoke`, `@regression`)
4. **Environments**: `ENV=prod npm test` switches `env.prod.ts` profile

## Maintainability

- Typed interfaces for API payloads and responses
- Centralized `env.ts` for all configuration access
- `retry.ts` for transient failures (network, rate limits)
- `logger.ts` with level control for CI vs local debug
- Schema validation prevents silent API contract drift

## Reporting Flow

```
Playwright Test
    ├── list reporter (console)
    ├── HTML → playwright-report/
    └── Allure → allure-results/ → allure generate → allure-report/
```

## Security

- Secrets in `.env` (gitignored patterns for local overrides)
- No credentials in test source files
- API key via environment variable `API_KEY`
