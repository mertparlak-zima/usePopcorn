import NavBar from "./components/NavBar";
import Box from "./components/Box";
import MyMovieList from "./components/MyMovieList";
import Summary from "./components/Summary";
import MovieList from "./components/MovieList";
import Main from "./components/Main";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";

const API_KEY = process.env.REACT_APP_API_KEY;

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(function () {
    async function fetchMovies() {
      if (!API_KEY) {
        console.error("API key is missing");
        setIsLoading(true);
        return <Loader />;
      }

      setIsLoading(true);
      const response = await fetch(`${API_KEY}&s=matrix`);
      const data = await response.json();
      setMovies(data.Search);
      setIsLoading(false);
    }
    fetchMovies();
  }, []);

  return (
    <>
      <NavBar movies={movies} />

      <Main>
        <Box>{isLoading ? <Loader /> : <MovieList movies={movies} />}</Box>
        <Box>
          <Summary watched={watched} />
          <MyMovieList watched={watched} />
        </Box>
      </Main>
    </>
  );
}
