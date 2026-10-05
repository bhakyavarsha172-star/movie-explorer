export default function CategoryFilter({ genres, selected, onSelect, disabled }) {
  return (
    <div className="chips" role="group" aria-label="Filter by genre">
      <button
        type="button"
        className={`chip ${!selected ? "chip--active" : ""}`}
        aria-pressed={!selected}
        onClick={() => onSelect("")}
      >
        All
      </button>
      {genres.map((g) => (
        <button
          key={g.id}
          type="button"
          disabled={disabled}
          className={`chip ${String(g.id) === selected ? "chip--active" : ""}`}
          aria-pressed={String(g.id) === selected}
          onClick={() => onSelect(String(g.id))}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
