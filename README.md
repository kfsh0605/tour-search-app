# 🌴 Tour Search App

A React + TypeScript application for searching and browsing tours with real-time price updates.

## Features

- 🔍 **Smart Search** - Search by countries, cities, or hotels with autocomplete
- 🌍 **Country Flags** - Visual country identification
- ⚡ **Async Search** - Real-time price polling with 425 status handling
- 🎨 **Modern UI** - Clean, responsive design with SCSS modules
- ♿ **Accessible** - WCAG 2.1 AA compliant with ARIA attributes
- 🛡️ **Error Handling** - Error boundaries for graceful degradation
- 📦 **Type Safe** - Full TypeScript coverage

## Tech Stack

- **React 19** with hooks
- **TypeScript** - Strict mode
- **Vite** - Fast build tool
- **SCSS Modules** - Component-scoped styling
- **Custom Hooks** - Reusable logic

## Project Structure

```
src/
├── api/              # API client and error handling
├── components/
│   ├── features/     # Feature components (SearchForm, TourCard, etc.)
│   ├── ui/           # Reusable UI components (Button, Input, Loader)
│   └── ErrorBoundary/
├── contexts/         # React contexts (Services)
├── hooks/            # Custom hooks
├── services/         # Business logic layer
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Architecture Highlights

### Layered Architecture
- **API Layer** - HTTP client with error handling
- **Service Layer** - Business logic (singleton services wrapped in Context)
- **Hooks Layer** - React hooks for state management
- **Components Layer** - Presentational and feature components

### Key Patterns
- **Custom Hooks** - `useTourSearch`, `useCountries`, `useGeoSearch`, `useHotels`, `useIsMounted`
- **Service Pattern** - Singleton services for data management
- **Error Boundaries** - Global and component-level error handling
- **Accessibility** - ARIA patterns (combobox, listbox, live regions)

### Async Search Flow
1. User selects destination
2. `startSearchPrices()` returns token + `waitUntil` timestamp
3. Poll `getSearchPrices()` until ready (handles 425 status)
4. Display results with hotel details

## Browser Support

Modern browsers with ES2022 support.

## License

MIT
