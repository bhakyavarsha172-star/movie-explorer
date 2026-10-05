export default function SearchBar({ value, onChange }) {
  return (
    <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="movie-search" className="sr-only">
        Search movies
      </label>
      <input
        id="movie-search"
        type="search"
        placeholder="Search by title, e.g. Inception"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
    </form>
  );
}
