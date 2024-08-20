'use client'
import { events } from "../components/types/eventType";
import { CreateTimeline } from "../components/functions/createTimeline";
import Event from "../components/Event";
import { formatUnixTime } from "../components/functions/gettime";
import { useState, useEffect } from "react";
import Image from "next/image";
import FeaturedEvent from "../components/FeaturedEvent";

export default function Timeline() {
  const [upcomingEvents, setUpcomingEvents] = useState<events[]>([]);

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
      }
    };

    findUpcomingEvents();},[]);
    const timelineData = CreateTimeline(upcomingEvents);

  return (
    <div>
      <div className="mt-10"></div>
      <div className="container sm:mx-[5%] sm:border-l-4 sm:border-white">
        {timelineData.map((date, index) => (
          <div className="transform -translate-x-[0.65%]">
            <div key={index}>
              <div className="flex items-center">
                <Image
                  src={`timelinecircle.svg`}
                  alt={``}
                  width={20}
                  height={20}
                  className="w-0 sm:w-4 mb-3"
                />
                <p className="ml-5 sm:ml-5 mb-3 mt-7 sm:mt-0 font-medium text-xl text-white">
                  {date[0]}
                </p>
              </div>
              <div className="hidden sm:flex">
              {date[1].map((event, index) => (
                <Event
                  key={event.id}
                  title={event.event_details.event_name}
                  details={formatUnixTime(event.event_details.start_time)}
                  clubName={event.account}
                  description={event.event_details.event_description}
                  imgSource={event.url}
                />
              ))}
              </div>
              <div className="w-full sm:hidden">
                {date[1].map((event: events) => (
  
                    <FeaturedEvent
                      title={event.event_details.event_name}
                      details={formatUnixTime(event.event_details.start_time)}
                      clubName={event.account}
                      imgSource={event.url}
                    />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};