// components/ClientSearchBar.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./ClientSearchbar.css"
export default function ClientSearchBar({
  searchText,
  setSearchText,
  suggestions,
  setSuggestions,
  onOpenFilter,
}) {
  const searchRef = useRef(null);

  return (
    <div className="header-search">
   

      <div className="search-input" ref={searchRef}>
        <input
          placeholder="Search jobs"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {searchText && (
          <button className="clear-btn" onClick={() => setSearchText("")}>
            ✕
          </button>
        )}

        {suggestions.length > 0 && searchText.trim() !== "" && (
          <div className="autocomplete-list">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="autocomplete-item"
                onClick={() => {
                  setSearchText(s);
                  setSuggestions([]);
                }}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="filter-btn" onClick={onOpenFilter}>
        ⚙️
      </button>
    </div>
  );
}
