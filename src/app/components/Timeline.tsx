import { events } from "./types/eventType";
import { CreateTimeline } from "./functions/createTimeline";
import Event from "./Event";
import { formatUnixTime } from "./functions/gettime";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import FeaturedEvent from "./FeaturedEvent";


interface TimelineProps {
  events: events[];
  onClick: (event: events) => void;
  eventsPerPage?: number;
  scrollOnPageChange?: boolean;
  scrollOffset?: number;
}


const Timeline: React.FC<TimelineProps> = ({ events, onClick, eventsPerPage = 20, scrollOnPageChange = false, scrollOffset = 80 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const timelineRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.max(1, Math.ceil(events.length / eventsPerPage));
  const [inputValue, setInputValue] = useState(currentPage.toString());

  useEffect(() => {
    if (scrollOnPageChange && timelineRef.current) {
      const y = timelineRef.current.getBoundingClientRect().top + window.scrollY - scrollOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [currentPage, scrollOnPageChange, scrollOffset]);

  // Paginate events
  const paginatedEvents = events.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage);
  const timelineData = CreateTimeline(paginatedEvents);  useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  return (
    <div ref={timelineRef} className="sm:flex flex-col">
    <div className="flex flex-col ml-0 sm:ml-20 sm:border-l-4 sm:border-gray-200">
      {timelineData.map(([date, eventsForDate], index) => (
        <div className="transform -translate-x-[0.7%]" key={index}>
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
                <div className="w-full" onClick={() => onClick(event)} key={index}>
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
      
      {/* Pagination Controls */}
      <div className="flex flex-col items-center">
      <div className="flex justify-center items-center gap-4 py-4">
        <button
          className="p-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          aria-label="Previous Page"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span className="text-white flex items-center gap-2">
          Page
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onBlur={() =>{
              let val = Number(inputValue);
              if (isNaN(val) || val < 1) val = 1;
              if (val > totalPages) val = totalPages;
              setCurrentPage(val); 
            }}
            className="w-12 px-2 py-1 rounded bg-transparent text-white border-2 border-gray-300 focus:outline-none"
            style={{ textAlign: "center" }}
          />
          of {totalPages}
        </span>
        <button
          className="p-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          aria-label="Next Page"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
        </button>
      </div>
    </div>
        </div>

  );
};

export default Timeline;
