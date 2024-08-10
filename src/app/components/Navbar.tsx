import React, { useState, KeyboardEvent } from "react";
import { FaArrowRight } from "react-icons/fa"; // Import an arrow icon from react-icons


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
      <div className="items-center hidden sm:flex">
        <img src="./logo.svg" alt="Logo" className="w-30 h-16 " />
      </div>

      {/* Search Bar */}

       <div className="relative flex w-full sm:w-auto">
  <input
    type="text"
    placeholder="Search Topics"
    className="flex-grow p-3 pl-10 pr-10 rounded-full bg-transparent transition-transform transform gradient-searchbar w-72 sm:hover:w-96 sm:hover:scale-110 text-center"
    onChange={handleIndexChange}
    onKeyPress={handleKeyPress}
    value={index}
  />
  {/* Arrow Icon */}
  <FaArrowRight
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 cursor-pointer sm:hidden"
    onClick={vectordbSearch} 
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
