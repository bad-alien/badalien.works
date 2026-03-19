# Testing

100% test coverage is the key to great vibe coding. Tests let you move fast, trust your instincts, and ship with confidence — without them, vibe coding is just yolo coding. With tests, it's a superpower.

## Framework

- **Unit/Integration:** Vitest 4 + @testing-library/react + jsdom
- **E2E:** Playwright (Chromium)

## Running Tests

```bash
npm test              # Run all unit/integration tests once
npm run test:watch    # Run in watch mode during development
npm run test:e2e      # Run Playwright e2e tests (requires dev server)
```

## Test Layers

### Unit Tests (`tests/`)
- Pure logic: data transforms, utilities, keyword matching
- Component rendering with @testing-library/react
- Run fast, no network or browser needed

### Integration Tests (`tests/`)
- Component interactions (user events, state changes)
- API route handlers with mocked dependencies

### E2E Tests (`e2e/`)
- Full page navigation and user flows via Playwright
- Run against the dev server on localhost:3001

## Conventions

- Test files: `tests/<name>.test.ts` or `tests/<name>.test.tsx`
- E2E files: `e2e/<name>.spec.ts`
- Use `describe` + `it` blocks with descriptive names
- Mock external dependencies (APIs, Resend, etc.) — never hit real services
- Path alias `@/*` maps to `./src/*` in vitest config
