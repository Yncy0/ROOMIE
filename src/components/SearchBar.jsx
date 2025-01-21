import React from "react";
import { useState } from "react";

export function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search room name..."
        className="p-2 border rounded-l-md w-64"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded-r-md">
        Search
      </button>
    </form>
  );
}
