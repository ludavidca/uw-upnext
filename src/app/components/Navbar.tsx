// src/app/components/Navbar.tsx

import React, { useState } from "react";

export default function Navbar() {
    const [index, setIndex] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleIndexChange = (e) => {
      e.preventDefault();
      setIndex(e.target.value);
    };


    const vectordbSearch = async(e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const res = await fetch(`/api/vectorSearch?index=${index}`)
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
    }

    return (
        <div className="flex items-center justify-between p-3 bg-transparent">
      {/* Logo */}
      <div className="flex items-center">
        <img src="./logo.svg" alt="Logo" className="w-30 h-16 " />
      </div>

      {/* Search Bar */}
      <div className="flex">
        <input
          type="text"
          placeholder="Search Topics"
          style={{ textAlign: 'center' }}
          className="flex-grow p-3  rounded-full bg-transparent transition-transform transform gradient-searchbar w-72 hover:w-96 hover:scale-110"
        />
      </div>

      {/* CTA Buttons */}
      <div className="flex items-center space-x-4">
        <button className="px-4 py-2 bg-gray-300 rounded-3xl" style={{ color: 'rgb(133,0,205)' }}>
          Sign In
        </button>
        {/*<button className="px-4 py-2 bg-white text-blue-700 rounded-3xl">
          Register
    </button>*/}
      </div>
    </div>
    );
  } 

