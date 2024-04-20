import { useState } from "react";
import MyMovieList from "../MyMovieList";
import Summary from "../Summary";

export default function WatchedMovieListPart({ tempWatchedData, average }) {
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <Summary tempWatchedData={tempWatchedData} average={average} />
          <MyMovieList tempWatchedData={tempWatchedData} />
        </>
      )}
    </div>
  );
}
