import NavBar from "./components/NavBar";
import Box from "./components/Box";
import MyMovieList from "./components/MyMovieList";
import Summary from "./components/Summary";
import MovieList from "./components/MovieList";
import Main from "./components/Main";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import ErrorMessage from "./components/Error/ErrorMessage";
import Search from "./components/Search";
import SelectedMovie from "./components/SelectedMovie";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { useMovies } from "./customHooks/useMovies";

const API_KEY = process.env.REACT_APP_API_KEY;

export default function App() {
  const [query, setQuery] = useState("");

  // buradaki fonksiyon sadece initial renderde calisacak rerenderde calismayacak
  const [watched, setWatched] = useState(function () {
    const storagedMovies = JSON.parse(localStorage.getItem("watchedMovies"));

    if (storagedMovies) return storagedMovies;

    return [];
  });

  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const { movies, isLoading, error } = useMovies(query, API_KEY, ErrorMessage);

  function handleAddLocalStorageWatchedMovies(watchedMovie) {
    localStorage.setItem("watchedMovies", JSON.stringify(watchedMovie));
  }

  function handleSelectMovie(id) {
    setSelectedMovieId(id === selectedMovieId ? null : id);
  }

  function handleCloseMovie() {
    setSelectedMovieId(null);
  }

  function handleAddToWatched(movie) {
    setWatched((watched) => {
      handleAddLocalStorageWatchedMovies([...watched, movie]);
      return [...watched, movie];
    });
  }

  function handleDeleteWatchedMovies(watchedMovie) {
    localStorage.setItem("watchedMovies", JSON.stringify(watchedMovie));
  }

  function handleDeleteWatchedMovie(id) {
    setWatched((watched) => {
      const filteredData = watched.filter((movie) => movie.imdbID !== id);
      handleDeleteWatchedMovies(filteredData);
      return filteredData;
    });
  }

  function updateWatchedMovieRating(selectedMovieId, newRating) {
    if (!watched.length) return;

    const updatedWatched = watched.map((movie) => {
      if (movie.imdbID === selectedMovieId) {
        movie.userRating = newRating;
      }
      return movie;
    });

    setWatched(updatedWatched);
  }

  return (
    <>
      <NavBar movies={movies}>
        <Search query={query} setQuery={setQuery} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} handleSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedMovieId ? (
            <SelectedMovie
              selectedMovieId={selectedMovieId}
              handleCloseMovie={handleCloseMovie}
              API_KEY={API_KEY}
              handleAddToWatched={handleAddToWatched}
              watched={watched}
              updateWatchedMovieRating={updateWatchedMovieRating}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <MyMovieList
                watched={watched}
                handleDeleteWatchedMovie={handleDeleteWatchedMovie}
              />
            </>
          )}
        </Box>
      </Main>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
