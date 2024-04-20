import Search from "../Search";
import { useState } from "react";

export default function NavBar({ tempMovieData }) {
  const [movies, setMovies] = useState(tempMovieData);

  return (
    <nav className="nav-bar">
      <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>

      <Search />

      <p className="num-results">
        Found <strong>{movies.length ? movies.length : 0}</strong> results
      </p>
    </nav>
  );
}
