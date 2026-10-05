import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notice">
      <p>That page doesn't exist.</p>
      <Link to="/" className="btn">
        Back to movies
      </Link>
    </div>
  );
}
