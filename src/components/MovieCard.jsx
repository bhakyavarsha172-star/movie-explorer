import { Link } from "react-router-dom";
import { IMG } from "../api/tmdb";
import RatingBadge from "./RatingBadge.jsx";

export default function MovieCard({ movie }) {
  const poster = IMG.poster(movie.poster_path);
  const year = movie.release_date?.slice(0, 4);

  return (
    <Link to={`/movie/${movie.id}`} className="card">
      <div className="card__poster">
        {poster ? (
          <img src={poster} alt={`${movie.title} poster`} loading="lazy" />
        ) : (
          <div className="card__noposter">No poster</div>
        )}
        <RatingBadge value={movie.vote_average} votes={movie.vote_count} />
      </div>
      <h3 className="card__title">{movie.title}</h3>
      {year && <p className="card__year">{year}</p>}
    </Link>
  );
}
