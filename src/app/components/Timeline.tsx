import { events } from "./types/eventType";
import { CreateTimeline } from "./functions/createTimeline";
import Event from "./Event";
import { formatUnixTime } from "./functions/gettime";
import React from "react";
import Image from "next/image";
import FeaturedEvent from "./FeaturedEvent";

interface TimelineProps {
  events: events[];
  onClick: (event: events) => void;
}

export default function Timeline({ events, onClick }: TimelineProps) {
  const timelineData = CreateTimeline(events);

  return (
    <div className="sm:container ml-5 sm:ml-20 sm:border-l-4 sm:border-white">
      {timelineData.map(([date, eventsForDate], index) => (
        <div className="transform -translate-x-[3.2%]" key={index}>
          <div>
            <div className="flex items-center">
              <Image
                src={`timelinecircle.svg`}
                alt={``}
                width={20}
                height={20}
                className="w-0 sm:w-4 mb-3"
              />
              <p className="ml-5 sm:ml-5 sm:mb-3 sm:mt-7 mt-0 font-medium text-xl text-white">
                {date}
              </p>
            </div>
            <div className="hidden sm:flex flex-col">
              {eventsForDate.map((event, index) => (
                <div
                  className="w-full"
                  onClick={() => onClick(event)}
                  key={index}
                >
                  <Event
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
            <div className="w-full sm:hidden">
              {eventsForDate.map((event: events, index) => (
                <div onClick={() => onClick(event)} key={index}>
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
          </div>
        </div>
      ))}
    </div>
  );
}
