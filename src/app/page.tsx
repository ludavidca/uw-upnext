"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import Navbar from "./components/Navbar";
import SectionHeading from "./components/SectionHeading";
import Event from "./components/Event";
import FeaturedEvent from "./components/FeaturedEvent";
import Categories from "./components/Categories";
import CategoryPage from "./components/CategoryPage";
import EventCarousel from './components/EventCarousel';
import TimelineHeading from './components/TimelineHeading';
import TimelineWrapper from './components/TimelineWrapper';
import VerticalBar from './components/VerticalBar';

export default function SingleButtonPage() {
  const [selectedCategory, setSelectedCategory] = useState("main");
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

  const events = [
    { title: 'Frame Designathon', details: 'Jul 29th, 11:00am - 3pm', clubName: 'Communitech' },
    { title: 'Frame Designathon', details: 'Jul 29th, 11:00am - 3pm', clubName: 'Communitech' },
    { title: 'Frame Designathon', details: 'Jul 29th, 11:00am - 3pm', clubName: 'Communitech' },
    { title: 'Frame Designathon', details: 'Jul 29th, 11:00am - 3pm', clubName: 'Communitech' },
    { title: 'Frame Designathon', details: 'Jul 29th, 11:00am - 3pm', clubName: 'Communitech' },
    { title: 'Frame Designathon', details: 'Jul 29th, 11:00am - 3pm', clubName: 'Communitech' },
  ];

  return (
    <div>
      <Navbar />
      {selectedCategory == "main" && (
        <div>
          <SectionHeading text="Featured Events" />

          <EventCarousel>
            {events.map((event, index) => (
              <FeaturedEvent
                key={index}
                title={event.title}
                details={event.details}
                clubName={event.clubName}
              />
            ))}
          </EventCarousel>
          
          <SectionHeading text="Categories" />
          <Categories onSelectCategory={setSelectedCategory} />
          
          <SectionHeading text="Upcoming Events" />
          <VerticalBar height="100%" width="3px" />
          <TimelineWrapper date="Today">
            <Event
              title="Frame Designathon"
              details="Jul 29th, 11:00am - 3pm"
              clubName="Communitech"
              description="A day-long event for students to design solutions to a given problem"
              imgSource="./eventImage.svg"
            />
          </TimelineWrapper>
          <TimelineWrapper date="August 22, 2024">
            <Event
              title="Frame Designathon"
              details="Jul 29th, 11:00am - 3pm"
              clubName="Communitech"
              description="A day-long event for students to design solutions to a given problem"
              imgSource="./eventImage.svg"
            />
          </TimelineWrapper>
          <TimelineWrapper date="September 2, 2024">
            <Event
              title="Frame Designathon"
              details="Jul 29th, 11:00am - 3pm"
              clubName="Communitech"
              description="A day-long event for students to design solutions to a given problem"
              imgSource="./eventImage.svg"
            />
            <Event
              title="Frame Designathon"
              details="Jul 29th, 11:00am - 3pm"
              clubName="Communitech"
              description="A day-long event for students to design solutions to a given problem"
              imgSource="./eventImage.svg"
            />
          </TimelineWrapper>
        </div>
      )}
      {selectedCategory !== "main" && (
        <CategoryPage
          name={selectedCategory}
          main="main"
          onSelectMain={setSelectedCategory}
        />
      )}
    </div>
  );
}
