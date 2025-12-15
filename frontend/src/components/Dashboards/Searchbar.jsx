import React from "react";
import '../../styles/Search.css';

const Search = ({ query, setQuery, placeholder }) => {
  return (
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      <h4>🔍 Search</h4>
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          border: "2px solid red",
          fontSize: "16px"
        }}
      />
    </div>
  );
};

export default Search;
