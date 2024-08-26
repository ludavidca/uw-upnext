"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import SectionHeading from "./components/SectionHeading";
import Event from "./components/Event";
import FeaturedEvent from "./components/FeaturedEvent";
import Categories from "./components/Categories";
import CategoryPage from "./components/CategoryPage";
import EventCarousel from './components/EventCarousel';
import EventMain from "./components/EventMain";
import { events } from "./components/types/eventType";
import { formatUnixTime } from "./components/functions/gettime";
import Timeline from "./components/Timeline"
// import { Calendar } from "@/app/components/ui/calendar";

export default function SingleButtonPage() {
  const [selectedCategory, setSelectedCategory] = useState("main");
  const [index, setIndex] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<events[]>([]);
  const [categoryEvents, setCategoryEvents] = useState<events[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<events[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };


    handleResize();

    window.addEventListener("resize", handleResize); }
  )
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
        <div className="flex-row sm:flex-row-reverse">
          <div className="hidden sm:flex justify-center w-screen">
            <div className="w-2/3 items-center">
              {searchEvents.map((event: events) => (
                <div key={event._id} onClick={() => fetchEventInfo(event)}>
                  <Event
                    key={index}
                    title={event.event_details.event_name}
                    details={formatUnixTime(event.event_details.start_time)}
                    clubName={event.account}
                    description={event.event_details.event_description}
                    imgSource={event.display_photo}
                    url={event.url}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full sm:hidden">
            {searchEvents.map((event: events) => (
              <div
                key={event._id}
                onClick={() => fetchEventInfo(event)}
                className="py-5"
              >
                <FeaturedEvent
                  title={event.event_details.event_name}
                  details={formatUnixTime(event.event_details.start_time)}
                  clubName={event.account}
                  imgSource={event.display_photo}
                  url={event.url}
                  isMobile={true}
                />
              </div>
            ))}
          </div>
          <button
            className="sm:hidden py-2 bg-gray-300 rounded-3xl w-[94%] sm:w-[20%] ml-[3%] sm:ml-[20%] mb-10"
            style={{ color: "rgb(76,34,104)" }}
            onClick={() => {
              setSearchEvents([]);
              setSelectedCategory("main");
              setIndex("");
            }}
          >
            Back to Homepage
          </button>
        </div>
      )}
      {selectedCategory === "main" && searchEvents.length === 0 && (
        <div>
          {isSmallScreen ? (
            // If screen size is less than 640px
            <div>
              <SectionHeading text="Popular Events" />
              <EventCarousel>
                {events.map((event: events) => (
                  <div key={event._id} onClick={() => fetchEventInfo(event)}>
                    <FeaturedEvent
                      title={event.event_details.event_name}
                      details={formatUnixTime(event.event_details.start_time)}
                      clubName={event.account}
                      imgSource={event.display_photo}
                      url={event.url}
                      isMobile={false}
                    />
                  </div>
                ))}
              </EventCarousel>
            </div>
          ) : (
            // If screen size is more than 640px
            <div className="hidden sm:flex flex-row  mx-[2.7%] rounded-3xl py-5 gradient_border justify-center items-center ">
              <h1 className="text-4xl font-medium align-middle mx-auto">
                Finding Events. <br /> Made Better.
              </h1>

              <EventCarousel>
                {events.map((event: events) => (
                  <div key={event._id} onClick={() => fetchEventInfo(event)}>
                    <FeaturedEvent
                      title={event.event_details.event_name}
                      details={formatUnixTime(event.event_details.start_time)}
                      clubName={event.account}
                      imgSource={event.display_photo}
                      url={event.url}
                      isMobile={false}
                    />
                  </div>
                ))}
              </EventCarousel>
            </div>
          )}

          <SectionHeading text="Categories" />
          <div>
            <Categories onSelectCategory={setSelectedCategory} />
          </div>

          <div>
            <SectionHeading text="Upcoming Events" />
          </div>
          <div className="ml-[5%]">
          <Timeline events={upcomingEvents} onClick={fetchEventInfo} />
          </div>
          {/* <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="hidden h-[40%] gradient_border"
            /> */}
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
          imgUrl={selectedEvent.display_photo}
        />
      )}
      <div className="px-[10%] py-[2%] text-xs font-light mt-10 text-slate-500">
        <p>
          ⚠️ Legal Disclaimer: The events listed are curated by Language
          Learning Models (LLMs) based on Instagram posts and are subject to
          change. UW UpNext does not assume legal responsibility for any damages
          arising from the use of our services. We strongly recommend verifying
          details with the respective clubs to ensure you have the most current
          information. If you notice any inaccuracies, please contact our
          support team.
        </p>
      </div>
    </div>
  );
}
