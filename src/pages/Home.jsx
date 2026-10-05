import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getGenres } from "../api/tmdb";
import useDebounce from "../hooks/useDebounce";
import useFetch from "../hooks/useFetch";
import useMovies from "../hooks/useMovies";
import SearchBar from "../components/SearchBar.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";
import MovieGrid, { SkeletonGrid } from "../components/MovieGrid.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loader from "../components/Loader.jsx";

export default function Home() {
  // The URL is the source of truth for search + genre, so results are shareable and survive refresh/back.
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const genre = params.get("genre") || "";

  const [text, setText] = useState(query);
  const debouncedText = useDebounce(text.trim());

  useEffect(() => {
    if (debouncedText === query) return;
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        debouncedText ? next.set("q", debouncedText) : next.delete("q");
        return next;
      },
      { replace: true }
    );
  }, [debouncedText]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectGenre = (id) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      id ? next.set("genre", id) : next.delete("genre");
      return next;
    });

  const { data: genreData } = useFetch((signal) => getGenres(signal), []);
  const genres = genreData?.genres ?? [];

  // Search endpoint can't filter by genre, so we filter those results here.
  const { movies, loading, loadingMore, error, hasMore, loadMore, retry } = useMovies({
    query,
    genre: query ? "" : genre,
  });
  const visible = useMemo(
    () => (query && genre ? movies.filter((m) => m.genre_ids?.includes(Number(genre))) : movies),
    [movies, query, genre]
  );

  const genreName = genres.find((g) => String(g.id) === genre)?.name;
  const heading = query ? `Results for “${query}”` : genreName ? `Popular in ${genreName}` : "Popular right now";

  return (
    <>
      <section className="hero">
        <h1>Find your next movie</h1>
        <SearchBar value={text} onChange={setText} />
        <CategoryFilter genres={genres} selected={genre} onSelect={selectGenre} />
      </section>

      <section aria-labelledby="results-heading">
        <h2 id="results-heading" className="section-title">
          {heading}
        </h2>

        {loading && <SkeletonGrid />}

        {!loading && error && movies.length === 0 && <ErrorMessage message={error} onRetry={retry} />}

        {!loading && !error && visible.length === 0 && (
          <div className="notice">
            <p>
              {query
                ? `No movies match “${query}”${genreName ? ` in ${genreName}` : ""}. Check the spelling or clear the genre filter.`
                : "No movies found for this genre."}
            </p>
          </div>
        )}

        {visible.length > 0 && <MovieGrid movies={visible} />}

        {movies.length > 0 && error && <ErrorMessage message={error} onRetry={loadMore} />}
        {loadingMore && <Loader label="Loading more movies…" />}
        {!loading && !loadingMore && hasMore && !error && movies.length > 0 && (
          <div className="center">
            <button type="button" className="btn" onClick={loadMore}>
              Load more
            </button>
          </div>
        )}
      </section>
    </>
  );
}
