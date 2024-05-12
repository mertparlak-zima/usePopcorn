import { useState, useEffect } from "react";

export function useMovies(query, API_KEY, ErrorMessage, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      // if callback is exist, call it
      callback?.();

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
  return { movies, isLoading, error };
}
