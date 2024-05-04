import { useEffect, useState } from "react";
import StarRating from "../StarRating";
import Loader from "../Loader";
import ErrorMessage from "../Error/ErrorMessage";

export default function SelectedMovie({
  selectedMovieId,
  handleCloseMovie,
  API_KEY,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      async function fetchSelectedMovie() {
        try {
          setIsLoading(true);
          const response = await fetch(`${API_KEY}&i=${selectedMovieId}`);
          const data = await response.json();
          setIsLoading(false);
          console.log(data);

          if (data.Response === "False") throw new Error(`Movie is not found`);

          setMovie(data);
        } catch (err) {
          console.error(err.message);
          setError(err.message);
          setIsLoading(false);
        }
      }
      fetchSelectedMovie();
    },
    [selectedMovieId]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
