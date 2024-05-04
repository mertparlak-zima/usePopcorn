import { useEffect, useState } from "react";
import StarRating from "../StarRating";
import Loader from "../Loader";
import ErrorMessage from "../Error/ErrorMessage";

export default function SelectedMovie({
  selectedMovieId,
  handleCloseMovie,
  API_KEY,
  handleAddToWatched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0);

  useEffect(
    function () {
      async function fetchSelectedMovie() {
        try {
          setIsLoading(true);
          const response = await fetch(`${API_KEY}&i=${selectedMovieId}`);
          const data = await response.json();
          setIsLoading(false);

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

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAddWatchList() {
    const newWatchedMovie = {
      imdbID: selectedMovieId,
      title,
      poster,
      year,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    handleAddToWatched(newWatchedMovie);
    handleCloseMovie();
  }
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

            <img src={poster} alt={`Poster of ${title} movie`} />

            <div className="details-overview">
              <h2>{title}</h2>
              <p>{director}</p>
              <p>
                {released} <strong>-</strong> {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating
                maxRatings={10}
                starSize="24px"
                starNumberFontSize="24px"
                onSetRating={setUserRating}
              />
              {userRating > 0 && (
                <button className="btn-add" onClick={handleAddWatchList}>
                  + Add to list
                </button>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>
              Directing by <strong>{director}</strong>
            </p>
          </section>
        </>
      )}
    </div>
  );
}
