export default function SelectedMovie({ selectedMovieId, handleCloseMovie }) {
  return (
    <>
      <div className="details">{selectedMovieId}</div>;
      <button className="btn-back" onClick={handleCloseMovie}>
        &larr;
      </button>
    </>
  );
}
