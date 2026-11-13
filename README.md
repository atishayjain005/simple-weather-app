# Current weather

A React weather dashboard using OpenWeather current conditions. Search by city (or city and country code, such as `London,GB`), choose Celsius or Fahrenheit, and see observation date, sunrise and sunset in the city's local time. Wind remains in metres per second.

## Local setup

Use a current supported Node.js LTS release and npm.

```sh
npm ci
cp .env.example .env.local
# Set VITE_OPENWEATHER_API_KEY in .env.local
npm run dev
```

Supply your own OpenWeather key under your existing plan. Without a key, the UI explains that search is unavailable. Requests time out after ten seconds; errors can be retried by searching again. A failed replacement search retains the last successful result and labels it as previous data.

**Client-side API keys are visible to browser users.** A key was historically committed in this repository. Removing the tracked file does not revoke it: rotate/restrict that key before public deployment. Do not commit local configuration or credentials.

## Verification

```sh
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Browser tests intercept weather requests and use a placeholder key, so no live API quota or paid API is needed. They cover recovery, malformed data, blank searches, overlapping requests, keyboard unit selection and desktop/320px layouts. Unit tests cover temperature conversion and city-local time. There is no separate TypeScript check in this JavaScript project.

## Build and deployment

`npm run build` produces `dist/`; `npm run preview` serves it locally. The API key is embedded at build time. No public hosting target is configured or deployment claimed. Use only an existing free hosting plan after credential review; subdirectory hosting also requires setting Vite's base path. Known dependency audit findings remain; a breaking build-tool upgrade is tracked separately from this scoped UI change.

See [the improvement log](docs/improvement-log.md) for scope and remaining work.
