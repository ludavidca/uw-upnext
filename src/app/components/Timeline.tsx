import { events } from "./types/eventType";
import { CreateTimeline } from "./functions/createTimeline";
import Event from "./Event";
import { formatUnixTime } from "./functions/gettime";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import FeaturedEvent from "./FeaturedEvent";

interface timelineProps {
  events: events[];
  onClick: (event: events) => void;
}

export default function Timeline({ events, onClick }: timelineProps) {
  const timelineData = CreateTimeline(events);
  return (
    <div>
      <div className="mt-5"></div>
      <div className="container sm:mx-[5%] sm:border-l-4 sm:border-white">
        {timelineData.map((date, index) => (
          <div className="transform -translate-x-[0.65%]" key={index}>
            <div>
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
                      imgSource={event.url}
                    />
                  </div>
                ))}
              </div>
              <div className="w-full sm:hidden">
                {date[1].map((event: events, index) => (
                  <FeaturedEvent
                    key={index}
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
}

