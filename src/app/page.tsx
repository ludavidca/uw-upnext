"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import SectionHeading from "./components/SectionHeading";
import Event from "./components/Event";
import FeaturedEvent from "./components/FeaturedEvent";
import Categories from "./components/Categories";
import CategoryPage from "./components/CategoryPage";
//import React from 'react';
import EventCarousel from './components/EventCarousel';
import internal from "stream";
import { IntegerType } from "mongodb";
import EventMain from "./components/EventMain";

interface event_details {
  return_id: string;
  is_event: boolean;
  event_name: string;
  event_description: string;
  categories: string;
  start_time: number;
  end_time: number;
  location: string;
}

interface events {
  _id: string;
  account: string;
  date: string;
  caption: string;
  hashtags: string;
  id: IntegerType;
  url: string;
  likes: IntegerType;
  display_photo: string;
  is_event: boolean;
  embedded: Float64Array;
  event_details: event_details
}


export default function SingleButtonPage() {
  const [selectedCategory, setSelectedCategory] = useState("main");
  const [index, setIndex] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<events[]>([]);
  const [categoryEvents, setCategoryEvents] = useState<events[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<events[]>([]);
  const handleIndexChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIndex(e.target.value);
  };
  const [showEventMain, setShowEventMain] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<events | null>(null);

  function formatUnixTime(unixTime: number) {
    const date = new Date(unixTime * 1000);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    function getDaySuffix(day: number) {
      if (day >= 11 && day <= 13) {
        return "th";
      }
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    }

    const month = months[date.getMonth()];
    const day = date.getDate();
    let hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const daySuffix = getDaySuffix(day);

    return `${month} ${day}${daySuffix} ${hours}${ampm}`;
  }


  function getImage(url: string) {
    const thumbnail:string = `https://www.instagram.com/p/${url}/?size=l`;
    return thumbnail
  }



  const fetchEventInfo = (event: events) => {
    console.log(event);
    setSelectedEvent(event);
    setShowEventMain(true);
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

    useEffect(() => {
    const findUpcomingEvents = async () => {
      try {
        const res = await fetch(`/api/upcomingEvents`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            `HTTP error! status: ${res.status}, message: ${errorData.error || "Unknown error"}`
          );
        }
        const data = await res.json();
        setUpcomingEvents(data.results);
        console.log(data);
      } catch (err) {
        console.error("Fetch error:", err);
        // Handle the error here (e.g., show an error message to the user)
      } finally {
        setIsLoading(false);
      }
    };

    findUpcomingEvents();

    const findFeaturedEvents = async () => {
      try {
        const res = await fetch(`/api/featuredEvents`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            `HTTP error! status: ${res.status}, message: ${errorData.error || "Unknown error"}`
          );
        }
        const data = await res.json();
        setEvents(data.results);
        console.log(data);
      } catch (err) {
        console.error("Fetch error:", err);
        // Handle the error here (e.g., show an error message to the user)
      } finally {
        setIsLoading(false);
      }
    };

    
    findFeaturedEvents();
    

  },
  []);

  
  return (
    <div>
      <Navbar />
      {selectedCategory == "main" && (
        <div>
          <SectionHeading text="Featured Events" />

          <EventCarousel>
            {events.map((event: events) => (
<<<<<<< HEAD
              <FeaturedEvent
                title={event.event_details.event_name}
                details={formatUnixTime(event.event_details.start_time)}
                clubName={event.account}
                imgSource={event.url}
              />
=======
              <div key={event._id} onClick={() => fetchEventInfo(event)}>
                <FeaturedEvent
                  title={event.event_details.event_name}
                  details={formatUnixTime(event.event_details.start_time)}
                  clubName={event.account}
                  imgSource={"/eventImage.svg"}
                />
              </div>
>>>>>>> 7c8ae5b6720e5ea8f2e0823e9e9fb22f2c25b698
            ))}
          </EventCarousel>

          <SectionHeading text="Categories" />
          <Categories onSelectCategory={setSelectedCategory} />

          <SectionHeading text="Upcoming Events" />
           {/* Render this on screens wider than 640px */}
      <div className="hidden sm:block">
        {upcomingEvents.map((event: events) => (
          <div key={event._id} onClick={() => fetchEventInfo(event)}>
            <Event
<<<<<<< HEAD
              key={index}
              title={event.event_details.event_name}
              details={formatUnixTime(event.event_details.start_time)}
              clubName={event.account}
              description={event.event_details.event_description}
              imgSource={event.url}
            />
          ))}
=======
            key={index}
            title={event.event_details.event_name}
            details={formatUnixTime(event.event_details.start_time)}
            clubName={event.account}
            description={event.event_details.event_description}
            imgSource={"/eventImage.svg"}
          />
          </div>
          
        ))}
      </div>

      {/* Render this on screens smaller than 640px */}
      <div className="block sm:hidden">
        {upcomingEvents.map((event: events) => (
          <div key={event._id} onClick={() => fetchEventInfo(event)}>
            <FeaturedEvent
            title={event.event_details.event_name}
            details={formatUnixTime(event.event_details.start_time)}
            clubName={event.account}
            imgSource={"/eventImage.svg"}
            
          />
          </div>
          
        ))}
      </div>


>>>>>>> 7c8ae5b6720e5ea8f2e0823e9e9fb22f2c25b698
        </div>
      )}
      {selectedCategory !== "main" && (
        <CategoryPage
          name={selectedCategory}
          main="main"
          onSelectMain={setSelectedCategory}
        />
      )}

      {showEventMain && selectedEvent && (
        <EventMain title={selectedEvent.event_details.event_name} />
      )}
    </div>
  );
}
