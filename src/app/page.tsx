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
import { Switch } from "@/components/ui/switch";
// import { Calendar } from "@/app/components/ui/calendar";

export default function SingleButtonPage() {
  const upcomingRef = React.useRef<HTMLDivElement>(null);
  const EVENTS_PER_PAGE = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("main");
  const [index, setIndex] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [allEvents, setAllEvents] = useState<events[]>([]); // Raw events data
  const [events, setEvents] = useState<events[]>([]); // Featured events
  const [upcomingEvents, setUpcomingEvents] = useState<events[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [filterPastEvents, setFilterPastEvents] = useState<boolean>(true);
  const [filterWUSA, setfilterWUSA] = useState<boolean>(false);

  const [showEventMain, setShowEventMain] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<events | null>(null);
  const [searchEvents, setSearchEvents] = useState<events[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("events.json");
        const data = await res.json();
        const sortedEvents = [...data].sort((a, b) => b.event_details.start_time - a.event_details.start_time);
        console.log(sortedEvents);
        setAllEvents(sortedEvents);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!allEvents || allEvents.length === 0) return;
    const sortedEvents = [...allEvents].sort((a, b) => b.likes - a.likes);
    setEvents(sortedEvents.slice(0, 100));
  }, [allEvents]);

  useEffect(() => {
    if (!allEvents || allEvents.length === 0) return;
    let data = [...allEvents];
    const unixTimeAtMidnight = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000);
    if (!filterPastEvents) {
      data = data.filter((item: events) => item.event_details.start_time > unixTimeAtMidnight);
    }
    if (!filterWUSA) {
      data = data.filter((item: events) => item.account !== "WUSA");
    }
    setUpcomingEvents(data);
    setCurrentPage(1); // Reset to first page on filter change
  }, [allEvents, filterPastEvents, filterWUSA]);

  // Scroll to Upcoming Events section on page change
  useEffect(() => {
    if (upcomingRef.current) {
      const y = upcomingRef.current.getBoundingClientRect().top + window.scrollY - 80; // Offset for navbar
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [currentPage]);


  function getImage(url: string) {
    const thumbnail: string = `https://www.instagram.com/p/${url}/?size=l`;
    return thumbnail;
  }

  const fetchEventInfo = (event: events) => {
    console.log(event);
    setSelectedEvent(event);
    setShowEventMain(true);
  };


  return (
    <div className="overflow-x-hidden">
      <Navbar
        setCategory={setSelectedCategory}
        onSearch={setSearchEvents}
        onLogoClick={setSearchEvents}
      />
      {searchEvents.length > 0 && (
        <div className="flex-row sm:flex-row-reverse">
          <div className="hidden sm:flex justify-center w-screen">
            <div className="w-[80%] items-center">
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
                className="py-1"
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
                {events
                  // .filter((event: events) => {
                  //   const eventDate = new Date(
                  //     event.event_details.start_time * 1000
                  //   );
                  //   const today = new Date();
                  //   today.setHours(0, 0, 0, 0); // Set time to midnight
                  //   return eventDate >= today;
                  // })
                  .filter(
                    (event, index, self) =>
                      index ===
                      self.findIndex(
                        (e) =>
                          e.event_details.event_name ===
                          event.event_details.event_name
                      )
                  ) // Filter out duplicate titles
                  .map((event: events) => (
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
              <h1 className="text-4xl font-medium align-middle mx-auto text-white">
                Finding Events. <br /> Made Better.
              </h1>

              <EventCarousel>
                {events
                  // .filter((event: events) => {
                  //   const eventDate = new Date(
                  //     event.event_details.start_time * 1000
                  //   );
                  //   const today = new Date();
                  //   today.setHours(0, 0, 0, 0); // Set time to midnight
                  //   return eventDate >= today;
                  // })
                  .filter(
                    (event, index, self) =>
                      index ===
                      self.findIndex(
                        (e) =>
                          e.event_details.event_name ===
                          event.event_details.event_name
                      )
                  ) // Filter out duplicate titles

                  .map((event: events) => (
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

          <div className="flex flex-row justify-between items-end w-full" ref={upcomingRef}>
            <SectionHeading text="Upcoming Events" />
            <div className="flex flex-col items-left pr-[5%] gap-y-3">
              <div className="hidden sm:flex flex-row">
                <Switch
                  defaultChecked={false}
                  checked={filterPastEvents}
                  onCheckedChange={() => setFilterPastEvents(!filterPastEvents)}
                />
                <p className="text-white text-md ml-3">Past Events</p>
              </div>
              <div className="hidden sm:flex flex-row">
                <Switch
                  defaultChecked={false}
                  checked={filterWUSA}
                  onCheckedChange={() => setfilterWUSA(!filterWUSA)}
                />
                <p className="text-white text-md ml-3">WUSA Events</p>
              </div>
            </div>
          </div>
          <div className="flex sm:hidden flex-row w-full gap-x-5 items-center px-[4%] pb-8">
            <div className="flex flex-row">
              <Switch
                defaultChecked={false}
                checked={filterWUSA}
                onCheckedChange={() => setfilterWUSA(!filterWUSA)}
              />
              <p className="text-white text-md ml-3">WUSA Events</p>
            </div>
            <div className="flex flex-row">
              <Switch
                defaultChecked={false}
                checked={filterPastEvents}
                onCheckedChange={() => setFilterPastEvents(!filterPastEvents)}
              />
              <p className="text-white text-md ml-3">Past Events</p>
            </div>
          </div>
          {/* Timeline with built-in pagination */}
          <Timeline
            events={upcomingEvents}
            onClick={fetchEventInfo}
            eventsPerPage={EVENTS_PER_PAGE}
            scrollOnPageChange={true}
            scrollOffset={80}
          />
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
          key={`${selectedCategory}-${filterPastEvents}`}
          name={selectedCategory}
          main="main"
          onSelectMain={setSelectedCategory}
          showPast={filterPastEvents}
          onToggle={() => setFilterPastEvents(!filterPastEvents)}
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