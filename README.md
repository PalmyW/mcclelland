
# McClelland Trophy Ladder App

This is a Vite + Vue 3 app for visualizing and interacting with the McClelland Trophy Ladder, combining AFL and AFLW ladders using local JSON data. It features drag-and-drop reordering (via vue-smooth-dnd) and live combined scoring. 

## Features
- Local JSON data for AFL and AFLW ladders
- Drag-and-drop reordering for both ladders
- Live combined ladder updates
- Modern Vue 3 SFC codebase
- Ready for deployment to GitHub Pages

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Run the development server:
   ```sh
   npm run dev
   ```
3. Build for production:
   ```sh
   npm run build
   ```
4. Preview the production build:
   ```sh
   npm run preview
   ```

## Deploying to GitHub Pages
- Ensure `vite.config.js` has the correct `base` set (usually `base: '/REPO_NAME/'`)
- Deploy the `dist` folder to your `gh-pages` branch

## License
MIT
