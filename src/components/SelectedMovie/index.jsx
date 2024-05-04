import { useEffect, useState } from "react";
import StarRating from "../StarRating";

export default function SelectedMovie({
  selectedMovieId,
  handleCloseMovie,
  API_KEY,
  setError,
  error,
}) {
  const [movie, setMovie] = useState({});
  useEffect(
    function () {
      async function fetchSelectedMovie() {
        try {
          const response = await fetch(`${API_KEY}&i=${selectedMovieId}`);
          const data = await response.json();
          console.log(data);

          if (data.Response === "True") {
            setMovie(data);
          }
        } catch (err) {
          console.error(err.message);
        }
      }
      fetchSelectedMovie();
    },
    [selectedMovieId]
  );
  return (
    <>
      <div className="details">
        <header>
          <button className="btn-back" onClick={handleCloseMovie}>
            &larr;
          </button>

          <img src={movie.Poster} alt={`Poster of ${movie.Title} movie`} />

          <div className="details-overview">
            <h2>{movie.Title}</h2>
            <p>{movie.Director}</p>
            <p>
              {movie.Released} <strong>-</strong> {movie.Runtime}
            </p>
            <p>{movie.Genre}</p>
            <p>
              <span>⭐</span>
              {movie.imdbRating} IMDb Rating
            </p>
          </div>
        </header>
        <section>
          <div className="rating">
            <StarRating
              maxRatings={10}
              starSize="24px"
              starNumberFontSize="24px"
            />
          </div>
          <p>
            <em>{movie.Plot}</em>
          </p>
          <p>Starring {movie.Actors}</p>
          <p>
            Directing by <strong>{movie.Director}</strong>
          </p>
        </section>
      </div>
      ;
    </>
  );
}
