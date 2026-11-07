import { useEffect, useId, useRef, useState } from "react";
import { searchPlaces } from "../api/geocode";

function normalizeQuery(value) {
  return value.trim().replace(/\s+/gu, " ");
}

function isAbortError(error) {
  return error?.name === "AbortError";
}

export default function SearchBar({
  onSearch,
  onSelectPlace,
  onUseLocation,
  loading,
}) {
  const [input, setInput] = useState("");
  const [places, setPlaces] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestionError, setSuggestionError] = useState("");
  const rootRef = useRef(null);
  const timerRef = useRef(null);
  const controllerRef = useRef(null);
  const requestIdRef = useRef(0);
  const listboxId = useId();
  const normalizedInput = normalizeQuery(input);
  const activeOptionId =
    isOpen && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;

  useEffect(() => {
    const handleOutsidePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
      clearTimeout(timerRef.current);
      controllerRef.current?.abort();
    };
  }, []);

  const selectPlace = (place) => {
    clearTimeout(timerRef.current);
    requestIdRef.current += 1;
    setInput(place.name);
    setPlaces([]);
    setActiveIndex(-1);
    setIsOpen(false);
    setSuggestionError("");
    controllerRef.current?.abort();
    onSelectPlace?.({
      name: place.name,
      region: place.region,
      countryCode: place.countryCode,
      lat: place.lat,
      lon: place.lon,
    });
  };

  const handleChange = (event) => {
    const value = event.target.value;
    const query = normalizeQuery(value);
    setInput(value);
    setPlaces([]);
    setActiveIndex(-1);
    setSuggestionError("");
    clearTimeout(timerRef.current);
    controllerRef.current?.abort();
    requestIdRef.current += 1;

    if (query.length < 2) {
      setIsSearching(false);
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
    setIsSearching(true);
    const requestId = requestIdRef.current;
    timerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      controllerRef.current = controller;
      try {
        const results = await searchPlaces(query, { signal: controller.signal });
        if (requestId !== requestIdRef.current || controller.signal.aborted) {
          return;
        }
        setPlaces(results);
        setIsSearching(false);
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }
        if (requestId !== requestIdRef.current) {
          return;
        }
        setSuggestionError(error.message || "Suggestions are unavailable.");
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (places.length > 0) {
      selectPlace(places[activeIndex >= 0 ? activeIndex : 0]);
      return;
    }

    if (normalizedInput) {
      clearTimeout(timerRef.current);
      requestIdRef.current += 1;
      controllerRef.current?.abort();
      setIsOpen(false);
      onSearch(normalizedInput);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (event.key === "Tab") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === "ArrowDown" && places.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current + 1) % places.length);
    } else if (event.key === "ArrowUp" && places.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current <= 0 ? places.length - 1 : current - 1));
    }
  };

  const liveMessage = isSearching
    ? "Searching for places."
    : suggestionError
      ? "Place suggestions are unavailable."
      : isOpen && places.length === 0 && normalizedInput.length >= 2
        ? "No matches found."
        : places.length > 0
          ? `${places.length} place suggestions available.`
          : "";

  return (
    <div
      ref={rootRef}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
        padding: "0 16px",
        boxSizing: "border-box",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", width: "100%", gap: "8px", alignItems: "center" }}
      >
        <div className="search-combobox">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (normalizedInput.length >= 2) setIsOpen(true);
            }}
            placeholder="Enter city name..."
            aria-label="City name"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={activeOptionId}
            autoComplete="off"
            disabled={loading}
            style={{
              flex: "1",
              width: "100%",
              minWidth: "0px",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              outline: "none",
              backgroundColor: "white",
              color: "black",
            }}
          />
          {isOpen && (
            <ul id={listboxId} className="search-suggestions" role="listbox" aria-label="City suggestions">
              {isSearching ? (
                <li className="search-suggestions__status" role="presentation">
                  Searching...
                </li>
              ) : suggestionError ? (
                <li className="search-suggestions__status" role="presentation">
                  Suggestions unavailable. Try Search.
                </li>
              ) : places.length === 0 ? (
                <li className="search-suggestions__status" role="presentation">
                  No matches found
                </li>
              ) : (
                places.map((place, index) => {
                  const label = [place.name, place.region, place.countryCode]
                    .filter(Boolean)
                    .join(", ");
                  return (
                    <li
                      id={`${listboxId}-option-${index}`}
                      key={`${place.id}-${place.lat}-${place.lon}`}
                      className="search-suggestion"
                      role="option"
                      aria-selected={index === activeIndex}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectPlace(place)}
                    >
                      {label}
                    </li>
                  );
                })
              )}
            </ul>
          )}
          <span className="visually-hidden" aria-live="polite">
            {liveMessage}
          </span>
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            flexShrink: 0,
            backgroundColor: "#2563eb",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          {loading ? "..." : "Search"}
        </button>
      </form>

      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <button
          type="button"
          className="location-btn"
          onClick={onUseLocation}
          disabled={loading}
        >
          📍 Use my location
        </button>
      </div>
    </div>
  );
}
