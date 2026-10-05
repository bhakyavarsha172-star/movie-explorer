import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <>
      <header className="topbar">
        <Link to="/" className="brand">
          Movie Explorer
        </Link>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
