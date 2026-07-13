import { useState } from "react";

export default function SearchBar({ onSearch, onUseLocation, loading }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter city name..."
          aria-label="City name"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? "..." : "Search"}
        </button>
      </form>
      <button
        type="button"
        className="location-btn"
        onClick={onUseLocation}
        disabled={loading}
      >
        📍 Use my location
      </button>
    </div>
  );
}
