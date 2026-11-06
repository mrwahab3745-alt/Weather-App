# Atmosphere.io

A React weather app powered by the OpenWeatherMap Current Weather and 5-day
Forecast APIs.

[View the live demo](https://atmosphereio.netlify.app/)

## Quick start

```bash
git clone https://github.com/mrwahab3745-alt/Weather-App.git
cd Weather-App
npm install
```

Copy `.env.example` to `.env` and set your OpenWeatherMap API key:

```env
VITE_WEATHER_API_KEY=your_key_here
```

Start the development server:

```bash
npm run dev
```

Vite prints the local URL (usually `http://localhost:5173`).

## Features

- Search weather by city or use geolocation for local weather.
- View current conditions and a 5-day forecast, including daily high and low.
- Daylight-aware sun, moon, and star effects.
- Rain, storm, and transition effects.
- Loading indicators and clear error states for API and network failures.
- Responsive layout.

The app loads Lahore by default. In development, sample weather is used only
when the API key is missing or still set to the placeholder. Production builds
require a usable key.

## Project structure

```
Weather-App/
├── .env.example
├── index.html
├── package.json
└── src/
    ├── App.css
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── api/
    │   └── weather.js
    ├── assets/
    │   ├── hero.png
    │   ├── react.svg
    │   └── vite.svg
    ├── components/
    │   ├── ErrorMessage.jsx
    │   ├── Forecast.jsx
    │   ├── Loader.jsx
    │   ├── MoonEffect.jsx
    │   ├── RainEffect.jsx
    │   ├── SearchBar.jsx
    │   ├── StormScatter.jsx
    │   ├── SunEffect.jsx
    │   ├── TrainTransition.jsx
    │   └── WeatherCard.jsx
    └── utils/
        └── daylight.js
```

## Scripts

- `npm run dev` — start the development server
- `npm run build` — build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run the linter

## Security note

Vite bundles environment variables prefixed with `VITE_` into browser
JavaScript, so this API key is visible to users. A planned improvement is to
proxy OpenWeatherMap requests through a Netlify Function so the key can remain
server-side.
