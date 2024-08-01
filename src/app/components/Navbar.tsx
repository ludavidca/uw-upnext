import React, { useState, KeyboardEvent } from "react";

export default function Navbar() {
  const [index, setIndex] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIndex(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      vectordbSearch();
    }
  };

  const vectordbSearch = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/vectorEvents?index=${index}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Response data:", data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-transparent">
      {/* Logo */}
      <div className="flex items-center hidden sm:flex">
        <img src="./logo.svg" alt="Logo" className="w-30 h-16 " />
      </div>

      {/* Search Bar */}
      <div className="flex w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search Topics"
          style={{ textAlign: "center" }}
          className="flex-grow p-3 rounded-full bg-transparent transition-transform transform gradient-searchbar w-72 sm:hover:w-96 sm:hover:scale-110 "
          onChange={handleIndexChange}
          onKeyPress={handleKeyPress}
          value={index}
        />
      </div>

      {/* CTA Buttons */}
      <div className=" hidden sm:flex  items-center space-x-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded-3xl"
          style={{ color: "rgb(133,0,205)" }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
