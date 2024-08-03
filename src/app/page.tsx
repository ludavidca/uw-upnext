"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import Navbar from "./components/Navbar";
import SectionHeading from "./components/SectionHeading";
import Event from "./components/Event";
import Categories from "./components/Categories";
import Image from "next/image";
import CategoryPage from "./components/CategoryPage";

export default function SingleButtonPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
      const res = await fetch(`/api/findEvents?index=${index}`);
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

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
  };

  return (
    <div>
      <Navbar />
      {!selectedCategory && (
        <div>
          <SectionHeading text="Featured Events"></SectionHeading>
          <SectionHeading text="Categories"></SectionHeading> <br></br><br></br><br></br>
          <SectionHeading text="Upcoming Events"></SectionHeading>
          <Event 
          title="Frame Designathon" 
          details="Jul 29th, 11:00am - 3pm" 
          clubName="Communitech" 
          description="A day-long event for students to design solutions to a given problem"
          imgSource="./eventImage.svg"></Event>
          <Event 
          title="Frame Designathon" 
          details="Jul 29th, 11:00am - 3pm" 
          clubName="Communitech" 
          description="A day-long event for students to design solutions to a given problem"
          imgSource="./eventImage.svg"></Event>
            </div>
       )}
      {!!selectedCategory && (
        <CategoryPage name={selectedCategory}/>
      )}
    </div>
  );
}
