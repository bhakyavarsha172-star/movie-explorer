import MovieCard from "./MovieCard.jsx";

export function SkeletonGrid({ count = 12 }) {
  return (
    <div className="grid" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton" />
      ))}
    </div>
  );
}

export default function MovieGrid({ movies }) {
  return (
    <div className="grid">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </div>
  );
}
