import React, { useState } from "react";
import "../../styles/Search.css";

const Search = ({ data = [], placeholder = "Search..." }) => {
  const [query, setQuery] = useState("");

  const filteredData = data.filter(item =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="search-results">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div className="search-card" key={index}>
              {Object.entries(item).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}:</strong> {value}
                </p>
              ))}
            </div>
          ))
        ) : (
          <p className="no-results">No results found</p>
        )}
      </div>
    </div>
  );
};

export default Search;
