"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import Navbar from "./components/Navbar";
import SectionHeading from "./components/SectionHeading";
import Event from "./components/Event";


export default function SingleButtonPage() {
  const [index, setIndex] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleIndexChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIndex(e.target.value);
  };

  const findSpecificEvents = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/findEvents?index=${index}`
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorData.error || "Unknown error"}`
        );
      }
      const data = await res.json();
      console.log("Response data:", data);
      // Handle the successful response here (e.g., update state with the fetched data)
    } catch (err) {
      console.error("Fetch error:", err);
      // Handle the error here (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  const findFeaturedEvents = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/featuredEvents`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorData.error || "Unknown error"}`
        );
      }
      const data = await res.json();
      console.log("Response data:", data);
      // Handle the successful response here (e.g., update state with the fetched data)
    } catch (err) {
      console.error("Fetch error:", err);
      // Handle the error here (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={findSpecificEvents} className="mb-4">
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
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          onClick= {findFeaturedEvents}
        >
           Find Featured Events
        </button>
      </div>
      <SectionHeading text="Categories"></SectionHeading>
      <SectionHeading text="Upcoming Events"></SectionHeading>
      <Event 
      title="Frame Designathon" 
      details="Jul 29th, 11:00am - 3pm" 
      clubName="Communitech" 
      description="A day-long event for students to design solutions to a given problem"
      imgSource="./eventImage.svg"></Event>
      
      

    </div>
    
  );
};