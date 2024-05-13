import { useState, useEffect } from "react";

// burada eger localstagede bir deger varsa onu donecek yoksa initial state i donecek
export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    if (storedValue === "undefined") return initialState;
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    function () {
      if (value === undefined) {
        localStorage.removeItem(key);
      } else localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
