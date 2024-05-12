import { useEffect, useRef } from "react";

export default function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (document.activeElement === inputEl.current) return;

      if (e.key === "Enter") {
        inputEl.current.focus();
      }
    });
  }, []);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
