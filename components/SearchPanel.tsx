import React, { useState } from "react";

export default function SearchPanel() {
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Searching for: ${keyword}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Keyword Search Panel</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter keyword..."
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            marginRight: "10px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>
    </div>
  );
}

