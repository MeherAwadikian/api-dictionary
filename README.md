# API Dictionary

A searchable, filterable dictionary of 150+ public APIs built with React + TypeScript + Vite + Tailwind CSS.

## Features

- Full-text search across name, category, description, auth, and CORS fields
- Category sidebar with entry counts
- Filter by auth type, HTTPS-only, and CORS support
- Copy API Info and Copy as Prompt buttons on every card
- Favorites saved to localStorage
- API detail modal with full metadata
- Dark mode (auto-detected, toggle in header)
- Mobile responsive layout

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Updating API data from the official README

The bundled `src/data/apis.json` has 150+ entries. To regenerate it from the latest public-apis README:

```bash
# 1. Download the README
curl -o README.md https://raw.githubusercontent.com/public-apis/public-apis/master/README.md

# 2. Run the parser
npm run parse

# 3. The updated src/data/apis.json is ready — commit it
```

The parser script is at `scripts/parseReadme.ts`.

## Project structure

```
src/
  components/
    ApiCard.tsx        — Card with copy buttons and favorite toggle
    ApiModal.tsx       — Detail modal (Esc to close)
    CategorySidebar.tsx
    CopyButton.tsx     — Animated copy-to-clipboard button
    FilterBar.tsx      — Auth / HTTPS / CORS filters
    SearchBar.tsx
  data/
    apis.json          — Parsed API entries
  hooks/
    useDarkMode.ts
    useFavorites.ts    — localStorage-backed favorites
  types/
    index.ts
  utils/
    copyUtils.ts       — Copy API Info and Copy as Prompt formatters
    generateUseCase.ts — Per-category use case templates
  App.tsx
  main.tsx
scripts/
  parseReadme.ts       — README → apis.json converter
```

## Copy formats

**Copy API Info:**
```
API Name: OpenWeatherMap
Category: Weather
Description: Weather
Auth: apiKey
HTTPS: Yes
CORS: Unknown
URL: https://openweathermap.org/api
Use Case: show current conditions and 7-day forecasts in a weather widget or travel app
```

**Copy as Prompt:**
```
Use OpenWeatherMap to build a feature that shows current conditions and 7-day forecasts in a weather widget or travel app.
API URL: https://openweathermap.org/api
Auth: apiKey
HTTPS: Yes
CORS: Unknown
```
