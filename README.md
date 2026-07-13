# CMD Weather

A clean, modern React weather app built with Vite. Uses the OpenWeatherMap
Current Weather Data API and includes a search bar, geolocation support,
loading/error states, and a glassmorphic UI.

## Quick start

```bash
cd weather-app
npm install
```

Add your OpenWeatherMap API key in one of two ways:

1. Copy `.env.example` to `.env` and set `VITE_OWM_API_KEY=your_key_here`, or
2. Edit `src/api/weather.js` and replace the placeholder string.

Then start the dev server:

```bash
npm run dev
```

The app will open at the URL printed by Vite (default `http://localhost:5173`).

## Features

- 🔎 City search with instant results
- 📍 One-click geolocation for local weather
- 🌡️ Current temperature, "feels like", humidity, wind, pressure, clouds,
  visibility, sunrise / sunset
- ⏳ Loading spinner and friendly error messages
- 📱 Fully responsive layout

## Project structure

```
weather-app/
├── index.html
├── package.json
├── .env.example
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── api/
    │   └── weather.js          # OpenWeatherMap fetch helpers
    └── components/
        ├── SearchBar.jsx
        ├── WeatherCard.jsx
        ├── Loader.jsx
        └── ErrorMessage.jsx
```

## Scripts

- `npm run dev` – start the dev server
- `npm run build` – build for production
- `npm run preview` – preview the production build locally
- `npm run lint` – run the linter

## Notes

- The first screen loads London by default. Once you supply a valid API key,
  replace the placeholder in `src/api/weather.js` (or use `.env`) and search
  for any city.
- Free OpenWeatherMap keys can take a few minutes to an hour to activate
  after creation.
