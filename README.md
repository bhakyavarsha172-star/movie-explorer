# Movie Explorer

A React app for searching and browsing movies, built with Vite, React Router and the [TMDB API](https://developer.themoviedb.org/docs).

**Live demo:** _add your deployment link here_

## Features
- Search movies by title (debounced, so it doesn't fire on every keystroke)
- Filter by genre; search and genre live in the URL, so results are shareable and survive refresh
- Movie details page: overview, genres, runtime, director, cast, trailer link
- Ratings shown as a colour-coded dial (green 7+, amber 5-6.9, red below 5)
- Loading skeletons and spinners, plus friendly errors with a retry button
- Responsive layout from phone to desktop

## Setup
```bash
npm install
cp .env.example .env     # then paste your free TMDB API key
npm run dev
```
Get a key at https://www.themoviedb.org/settings/api (use the "API Key" value).

## Project structure
```
src/
  api/tmdb.js            all network calls + error mapping
  hooks/useFetch.js      generic fetch hook (abort + retry)
  hooks/useMovies.js     useReducer: search, genre filter, pagination
  hooks/useDebounce.js
  components/            SearchBar, CategoryFilter, MovieGrid, MovieCard,
                         RatingBadge, Loader, ErrorMessage
  pages/                 Home, MovieDetails, NotFound
```

## Deploy
**Vercel:** push to GitHub, import the repo, add `VITE_TMDB_API_KEY` under Environment Variables, deploy. `vercel.json` handles client-side routing.
**Netlify:** same steps; `public/_redirects` handles routing. Build command `npm run build`, publish directory `dist`.

## AI-assisted development log
Fill this in with your own prompts and results; your instructor will want to see it.
- **Generated components:** which components AI drafted, and the prompt you used.
- **Refactoring:** what you changed for reusability (e.g. one `useFetch` hook instead of repeated fetch code, a shared `RatingBadge`).
- **State troubleshooting:** a bug you hit (e.g. stale results after typing quickly) and how AI helped you fix it (request cancellation with `AbortController`).
