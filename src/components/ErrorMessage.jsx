export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error" role="alert">
      <p>⚠️ {message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="retry-btn">
          Try again
        </button>
      )}
    </div>
  );
}
