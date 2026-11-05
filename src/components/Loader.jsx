export default function Loader({ message = "Loading weather..." }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
}
