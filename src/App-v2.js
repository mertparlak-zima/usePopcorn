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

const API_KEY = process.env.REACT_APP_API_KEY;

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null);

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

  // set initial localstorage data on watched usestate
  useEffect(() => {
    const storagedMovies = localStorage.getItem("watchedMovies");

    if (storagedMovies) {
      setWatched(JSON.parse(storagedMovies));
    }
  }, []);

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

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          if (!API_KEY) {
            console.error("API key is missing");
            setError("API key is missing");
            error && <ErrorMessage message={error} />;
            return;
          }

          setIsLoading(true);
          setError("");

          const response = await fetch(`${API_KEY}&s=${query}`, {
            signal: controller.signal,
          });

          if (!response.ok) throw new Error("Failed to fetch movies data");

          const data = await response.json();

          if (data.Response === "False")
            throw new Error(`${query} is not found`);
          setMovies(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

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
