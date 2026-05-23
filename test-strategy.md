# Test Strategy — testmu-sdet2-omprakash

## 1. Objectives

Validate critical user journeys on Sauce Demo UI and ReqRes API contracts, with integration coverage proving API-to-UI workflow orchestration in a single automation codebase.

## 2. Test Pyramid

```
        /\
       /  \        E2E / Integration (~10%)
      /____\       createUser.integration.spec.ts
     /      \
    /________\     UI + API (~60%)
   /          \    login, dashboard, CRUD, schema
  /____________\
 /              \  Unit / Utils (~30%)
/________________\ schema validator, retry, env
```

| Layer | Scope | Tools |
|-------|-------|-------|
| Unit-ish | Schema validation, utilities | Ajv, custom helpers |
| API | Auth, CRUD, 4xx/5xx, response time | Axios + Playwright |
| UI | Login, inventory, checkout | Playwright POM |
| Integration | API create + UI session | Playwright + Axios |

## 3. Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| Flaky UI timing | High | Smart waits, Playwright auto-wait, retry utility |
| External API rate limits | Medium | Retry with backoff, API key header |
| Cross-browser variance | Medium | Dedicated smoke suite, matrix CI |
| Credential exposure | High | `.env` + gitignore, no secrets in repo |
| Slow CI feedback | Medium | Parallel workers, project-based matrix |

## 4. Coverage Rationale

### UI (Sauce Demo)

- **Login**: Revenue-critical path; invalid and locked-out users reduce support risk
- **Dashboard**: Inventory integrity ensures catalog availability
- **Forms**: Checkout validation prevents order processing defects
- **Cross-browser smoke**: Catches rendering/engine-specific failures

### API (ReqRes)

- **Auth**: Token issuance underpins dependent services
- **CRUD**: Core data lifecycle for user entities
- **Error handling**: 4xx paths guard client implementations
- **Schema**: Contract stability for consumer applications

### Integration

- Validates orchestration: API precondition → UI authentication → state correlation

## 5. Flaky Test Prevention

- No hard-coded `sleep()` in tests; use `waitUtils` and Playwright expectations
- `data-test` selectors only in Page Objects (no raw CSS in specs)
- Centralized environment config — no inline URLs
- CI retries (`retries: 2`) with trace/video on failure
- Idempotent API tests using ReqRes mock endpoints

## 6. Entry / Exit Criteria

**Entry**: Environment reachable, dependencies installed, `.env` configured

**Exit**: All projects green, Allure + HTML reports generated, zero P0 defects open

## 7. Future Roadmap

| Phase | Deliverable |
|-------|-------------|
| Q2 | Visual regression baseline |
| Q3 | Contract tests + API mocking layer |
| Q4 | Performance SLO gates in CI |
| Q5 | Mobile web (Playwright device emulation) |
