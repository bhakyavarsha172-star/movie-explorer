/** Circular rating dial. `value` is TMDB's 0-10 average. */
export default function RatingBadge({ value = 0, votes, size = 44 }) {
  const rated = votes === undefined || votes > 0;
  const pct = Math.round(value * 10);
  const r = 18;
  const circ = 2 * Math.PI * r;
  const tone = pct >= 70 ? "good" : pct >= 50 ? "mid" : "low";

  return (
    <div
      className={`rating rating--${rated ? tone : "none"}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={rated ? `Rated ${value.toFixed(1)} out of 10` : "Not rated yet"}
    >
      <svg viewBox="0 0 44 44" aria-hidden="true">
        <circle className="rating__track" cx="22" cy="22" r={r} />
        {rated && (
          <circle
            className="rating__value"
            cx="22"
            cy="22"
            r={r}
            strokeDasharray={`${(pct / 100) * circ} ${circ}`}
            transform="rotate(-90 22 22)"
          />
        )}
      </svg>
      <span>{rated ? value.toFixed(1) : "NR"}</span>
    </div>
  );
}
