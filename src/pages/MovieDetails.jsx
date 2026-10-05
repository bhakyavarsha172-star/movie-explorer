import { useNavigate, useParams } from "react-router-dom";
import { IMG, getMovieDetails } from "../api/tmdb";
import useFetch from "../hooks/useFetch";
import RatingBadge from "../components/RatingBadge.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loader from "../components/Loader.jsx";

const formatRuntime = (min) => (min ? `${Math.floor(min / 60)}h ${min % 60}m` : null);

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: movie, loading, error, retry } = useFetch((signal) => getMovieDetails(id, signal), [id]);

  const back = (
    <button type="button" className="btn btn--ghost" onClick={() => navigate(-1)}>
      ← Back
    </button>
  );

  if (loading) return <Loader label="Loading movie details…" />;
  if (error)
    return (
      <>
        {back}
        <ErrorMessage message={error} onRetry={retry} />
      </>
    );

  const poster = IMG.poster(movie.poster_path);
  const backdrop = IMG.backdrop(movie.backdrop_path);
  const trailer = movie.videos?.results?.find((v) => v.site === "YouTube" && v.type === "Trailer");
  const cast = movie.credits?.cast?.slice(0, 8) ?? [];
  const director = movie.credits?.crew?.find((c) => c.job === "Director");
  const facts = [movie.release_date?.slice(0, 4), formatRuntime(movie.runtime), movie.original_language?.toUpperCase()].filter(Boolean);

  return (
    <article className="details">
      {back}
      {backdrop && <div className="details__backdrop" style={{ backgroundImage: `url(${backdrop})` }} />}

      <div className="details__main">
        {poster ? (
          <img className="details__poster" src={poster} alt={`${movie.title} poster`} />
        ) : (
          <div className="details__poster card__noposter">No poster</div>
        )}

        <div className="details__info">
          <h1>{movie.title}</h1>
          {movie.tagline && <p className="tagline">{movie.tagline}</p>}
          <div className="details__meta">
            <RatingBadge value={movie.vote_average} votes={movie.vote_count} size={56} />
            <div>
              <p>{facts.join(" | ")}</p>
              <p className="muted">{movie.vote_count.toLocaleString()} ratings</p>
            </div>
          </div>

          <ul className="tags">
            {movie.genres.map((g) => (
              <li key={g.id}>{g.name}</li>
            ))}
          </ul>

          <h2>Overview</h2>
          <p className="overview">{movie.overview || "No overview available yet."}</p>
          {director && (
            <p>
              <span className="muted">Directed by</span> {director.name}
            </p>
          )}
          {trailer && (
            <a className="btn" href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noreferrer">
              Watch trailer
            </a>
          )}
        </div>
      </div>

      {cast.length > 0 && (
        <section>
          <h2 className="section-title">Cast</h2>
          <ul className="cast">
            {cast.map((c) => (
              <li key={c.id}>
                {IMG.profile(c.profile_path) ? (
                  <img src={IMG.profile(c.profile_path)} alt="" loading="lazy" />
                ) : (
                  <div className="cast__blank" />
                )}
                <strong>{c.name}</strong>
                <span className="muted">{c.character}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
