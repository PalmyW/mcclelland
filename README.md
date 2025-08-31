# McClelland Trophy Ladder App

This is a Vite + Vue 3 app for visualizing and interacting with the McClelland Trophy Ladder, combining AFL and AFLW ladders. It features live data fetching from the AFL API with automatic fallback to cached data, drag-and-drop reordering, and a modern responsive design.

## Features

### Core Functionality
- **Live AFL/AFLW ladder data** - Fetches current standings from official AFL API
- **Intelligent fallback system** - Uses cached data when API is unavailable
- **Drag-and-drop reordering** - Interactive ladder customization with vue3-smooth-dnd
- **Live combined ladder** - Real-time McClelland Trophy scoring
- **Responsive design** - Mobile-first layout with desktop enhancements

### Visual Design
- **Official AFL team logos** - Authentic branding with sprite sheet integration
- **Dark/light mode toggle** - System preference detection with manual override
- **Material Design icons** - Consistent iconography throughout
- **Professional styling** - Tailwind CSS with custom AFL-themed colors

### Data Management
- **Development mode**: Live API calls via proxy (bypasses CORS)
- **Production mode**: Cached data updated via GitHub Actions
- **Auto-refresh**: Scheduled updates every 4 hours during AFL season
- **Manual refresh**: User-triggered data updates

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```

2. Run the development server:
   ```sh
   npm run dev
   ```
   *Development mode uses live AFL API data via proxy*

3. Build for production:
   ```sh
   npm run build
   ```

4. Preview the production build:
   ```sh
   npm run preview
   ```
   *Preview mode uses cached data (simulates GitHub Pages)*

## GitHub Pages Deployment

### How it Works on GitHub Pages

**Data Strategy:**
- **GitHub Actions workflow** automatically fetches latest AFL data every 4 hours
- **Cached JSON files** are committed to the repository when data changes
- **Production app** uses these cached files (no API calls due to CORS)
- **Users see fresh data** without needing live API access

**Deployment Process:**
1. GitHub Actions runs `scripts/scrape-ladders.js` on schedule
2. New ladder data is committed to `public/data/afl.json` and `public/data/aflw.json`
3. GitHub Pages automatically rebuilds and deploys the site
4. Users get updated data within ~5 minutes of AFL results

### Manual Deployment

If you prefer manual deployment:

```sh
npm run build
git subtree push --prefix dist origin gh-pages
```

### Configuration

- **Vite base path**: Set to `/mcclelland/` for GitHub Pages
- **Repository**: Configured for `PalmyW/mcclelland`
- **Branch**: Deploys from `gh-pages` branch

If you fork or rename the repository:
1. Update the base path in `vite.config.js`
2. Or set the `BASE_PATH` environment variable
3. Update the repository name in the GitHub Actions workflow

## Development vs Production

| Feature | Development | Production (GitHub Pages) |
|---------|-------------|---------------------------|
| Data Source | Live AFL API (via proxy) | Cached JSON files |
| Updates | Real-time | Every 4 hours via GitHub Actions |
| CORS | Handled by Vite proxy | Not applicable (cached data) |
| Refresh Button | Fetches live data | Re-reads cached data |

## Manual Data Updates

To manually update the ladder data:

```sh
node scripts/scrape-ladders.js
```

This fetches the latest data from the AFL API and updates the JSON files.

## License

MIT
