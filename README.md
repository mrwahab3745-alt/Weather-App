# Atmosphere.io

A React weather app powered by the OpenWeatherMap Current Weather and 5-day
Forecast APIs.

[View the live demo](https://atmosphereio.netlify.app/)

## Quick start

Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env` and add your OpenWeatherMap API key to
`OPENWEATHER_API_KEY`. This key is server-side only; do not rename it with a
`VITE_` prefix.

```bash
cp .env.example .env
```

Run the app with Netlify Functions enabled:

```bash
npx netlify-cli dev
```

Open the URL printed by the command. Plain `npm run dev` starts only the Vite
development server and does not serve the Netlify Function.

To work locally with sample data and without an API key, set
`VITE_USE_MOCK=true` in `.env`.

## Features

- Search weather by city or use geolocation for local weather.
- View current conditions and a 5-day forecast, including daily high and low.
- Daylight-aware sun, moon, and star effects.
- Rain, storm, and transition effects.
- Loading indicators and clear error states for API and network failures.
- Responsive layout.

The app loads Lahore by default.

## Project structure

```
Atmosphere.io/
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── netlify.toml
├── netlify/
│   ├── functions/
│   │   └── weather.mjs
│   └── lib/
│       ├── validate.mjs
│       └── validate.test.mjs
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── api/
│   │   ├── mock.js
│   │   └── weather.js
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── ErrorMessage.jsx
│   │   ├── Forecast.jsx
│   │   ├── Loader.jsx
│   │   ├── MoonEffect.jsx
│   │   ├── RainEffect.jsx
│   │   ├── SearchBar.jsx
│   │   ├── StormScatter.jsx
│   │   ├── SunEffect.jsx
│   │   ├── TrainTransition.jsx
│   │   ├── WeatherCard.jsx
│   │   └── WeatherIcon.jsx
│   ├── hooks/
│   │   └── useWeather.js
│   └── utils/
│       ├── daylight.js
│       └── weather.js
├── tailwind.config.js
└── vite.config.js
```

## Scripts

- `npm run dev` — start the Vite development server (does not serve Netlify Functions)
- `npx netlify-cli dev` — run the app with Netlify Functions locally
- `npm run build` — build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run the linter
- `npm test` — run the validation tests

## Testing

Run the test suite with:

```bash
npm test
```

## Security note

The OpenWeatherMap API key lives only in Netlify environment variables and is
read server-side by the Netlify Function; it is never sent to the browser.
Requests are validated, cached, and error-sanitised by the function.
