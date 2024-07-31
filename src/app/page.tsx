"use client";
import React, { useState } from "react";

const SingleButtonPage = () => {
  const [index, setIndex] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleIndexChange = (e) => {
    e.preventDefault();
    setIndex(e.target.value);
  };

  const findSpecificEvent = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/findEvents?index=${index}`);
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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={findSpecificEvent} className="mb-4">
          <div className="mb-4">
            <label
              htmlFor="index"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Find Index:
            </label>
            <input
              type="text"
              id="index"
              name="index"
              value={index}
              onChange={handleIndexChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Find Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SingleButtonPage;
