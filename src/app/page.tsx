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
import { events } from "./components/types/eventType";
import { formatUnixTime } from "./components/functions/gettime";
import Image from "next/image";

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
  const [searchEvents, setSearchEvents] = useState<events[]>([]);;

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
      <Navbar
        setCategory={setSelectedCategory}
        onSearch={setSearchEvents}
        onLogoClick={setSearchEvents}
      />
      {searchEvents.length > 0 && (
        <div className="flex mt-[5%] max-w-[100%]">
          {searchEvents.map((event: events) => (
            <div
              key={event._id}
              onClick={() => fetchEventInfo(event)}
              className="w-1/3"
            >
              <FeaturedEvent
                title={event.event_details.event_name}
                details={formatUnixTime(event.event_details.start_time)}
                clubName={event.account}
                imgSource={event.url}
              />
            </div>
          ))}
        </div>
      )}
      {selectedCategory === "main" && searchEvents.length === 0 && (
        <div>
          <SectionHeading text="Featured Events" />

          <EventCarousel>
            {events.map((event: events) => (
              <div key={event._id} onClick={() => fetchEventInfo(event)}>
                <FeaturedEvent
                  title={event.event_details.event_name}
                  details={formatUnixTime(event.event_details.start_time)}
                  clubName={event.account}
                  imgSource={event.url}
                />
              </div>
            ))}
          </EventCarousel>

          <SectionHeading text="Categories" />
          <Categories onSelectCategory={setSelectedCategory} />

          <SectionHeading text="Upcoming Events" />
          {/* Render this on screens wider than 640px */}
          <div className="">
            <div className="">
              <div className="flex flex-row ">
                <div className="w-2/3">
                  {upcomingEvents.map((event: events) => (
                    <div key={event._id} onClick={() => fetchEventInfo(event)}>
                      <Event
                        key={index}
                        title={event.event_details.event_name}
                        details={formatUnixTime(event.event_details.start_time)}
                        clubName={event.account}
                        description={event.event_details.event_description}
                        imgSource={event.url}
                      />
                    </div>
                  ))}
                </div>
                <div className="ml-[5%] text-center">
                  <Image
                    src="./bigmap.svg"
                    alt="Map of Events"
                    width={400}
                    height={1000}
                  />
                  <p className="font-semibold text-center text-white">
                    Finding Events. Reimagined.
                  </p>
                </div>
              </div>
            </div>

            {/* Render this on screens smaller than 640px */}
            <div className="block sm:hidden">
              {upcomingEvents.map((event: events) => (
                <div key={event._id} onClick={() => fetchEventInfo(event)}>
                  <FeaturedEvent
                    title={event.event_details.event_name}
                    details={formatUnixTime(event.event_details.start_time)}
                    clubName={event.account}
                    imgSource={event.url}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedCategory !== "main" && searchEvents.length === 0 && (
        <CategoryPage
          name={selectedCategory}
          main="main"
          onSelectMain={setSelectedCategory}
        />
      )}

      {showEventMain && selectedEvent && (
        <EventMain
          title={selectedEvent.event_details.event_name}
          details={selectedEvent.event_details.event_description}
          clubName={selectedEvent.account}
          description={selectedEvent.caption}
          location={selectedEvent.event_details.location}
          start_time={selectedEvent.event_details.start_time}
          end_time={selectedEvent.event_details.end_time}
          postUrl={selectedEvent.url}
          onClose={() => setShowEventMain(false)}
        />
      )}
      <div className="px-[10%] py-[2%] text-xs font-light text-slate-500">
        <p>
          ⚠️Legal Disclaimer: The events listed are curated by Language Learning
          Models (LLMs) based on Instagram posts and are subject to change. UW
          UpNext does not assume legal responsibility for any damages arising
          from the use of our services. We strongly recommend verifying details
          with the respective clubs to ensure you have the most current
          information. If you notice any inaccuracies, please contact our
          support team.
        </p>
      </div>
    </div>
  );
}
