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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '500px', margin: '0 auto', padding: '0 16px', boxSizing: 'border-box' }}>
      
      {/* Form Row */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter city name..."
          aria-label="City name"
          disabled={loading}
          // inline styles with max width settings to force full width override
          style={{ 
            flex: '1', 
            width: '100%', 
            minWidth: '0px', 
            padding: '12px', 
            borderRadius: '8px', 
            border: 'none', 
            outline: 'none', 
            backgroundColor: 'white', 
            color: 'black' 
          }} 
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          style={{ 
            flexShrink: 0, 
            backgroundColor: '#2563eb', 
            color: 'white', 
            padding: '12px 20px', 
            borderRadius: '8px', 
            border: 'none', 
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          {loading ? "..." : "Search"}
        </button>
      </form>

      {/* Location Button Row */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
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