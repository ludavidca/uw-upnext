import React, { useEffect, useState } from "react";
import Image from "next/image";
import SectionHeading from "./SectionHeading";
import Event from "./Event";
import { formatUnixTime } from "./functions/gettime";
import { events } from "./types/eventType";
import FeaturedEvent from "./FeaturedEvent";
import EventMain from "./EventMain";
import Timeline from "./Timeline";

interface CategoryPageProps {
  name: string;
  main: string;
  onSelectMain: (main: string) => void;
}

export default function CategoryPage({name, main, onSelectMain}: CategoryPageProps) {
    const [categoryEvents, setCategoryEvents] = useState<events[]>([])
    const [noEvents, setNoEvents] = useState<boolean | null>(null)
    const lowName = name.toLowerCase();
    const allCapsCategory = name.toUpperCase();
    const [showEventMain, setShowEventMain] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<events | null>(null);

    const fetchEventInfo = (event: events) => {
      console.log(event);
      setSelectedEvent(event);
      setShowEventMain(true);
    };

    useEffect(()=>{
      const findSpecificEvent = async () => {
        try {
          const res = await fetch(
            `/api/categoryEvents?category=${allCapsCategory}`
          );
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          setNoEvents(false);
          const data = await res.json();
          setCategoryEvents(data.results)
        } catch (err) {
          setNoEvents(true);
          console.error("Fetch error:", err);
        }
      };

      findSpecificEvent();
    },[allCapsCategory])

    return (
      <div className="flex-row items-center">
        <div className="flex-col sm:flex sm:flex-row items-center mt-[2%] ml-[10%] mr-[10%] sm:mr-0 space-y-0">
          <div className="w-full sm:w-[30%] flex-col space-y-2 my-[5%] sm:my-0">
            <div className="flex items-center space-x-2">
              <Image
                src={`/categoryIcons/${lowName}.svg`}
                alt={`Image of E7`}
                width={40}
                height={40}
              />
              <div className="flex items-baseline space-x-1">
                <p className="text-2xl font-bold text-white">{name}</p>
                <p className="text-m font-semibold text-gray-300">at UW</p>
              </div>
            </div>
            <div className=" sm:w-full border-t-2 border-gray-300" />

            <p className="text-m font-small text-gray-300 text-ellipsis">
              Discover the latest {name} events offered by clubs at the
              University of Waterloo with UW UpNext. Details are subject to
              change.
            </p>
            <div className="w-full align-middle">
              <button
                className="px-4 py-2 w-full bg-gray-300 rounded-3xl font-regular text-sm my-[5%]"
                style={{ color: "rgb(133,0,205)" }}
                onClick={() => onSelectMain(main)}
              >
                Back to Main Menu
              </button>
            </div>
          </div>

          <Image
            src={`/categoryImages/${lowName}.svg`}
            alt={`Image of E7`}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full sm:w-1/2 ml-0 sm:ml-[15%] "
          />
        </div>
        <div className="ml-[5%] flex-col place-items-start">
          <SectionHeading text={`Upcoming ${name} Events`} />
          <div className="hidden sm:block  w-[100%]">
            {noEvents ? (
              <p className="px-5 sm:px-10 py-3 pt-2 font-medium text-white">
                No Events Found
              </p>
            ) : (
              <Timeline events={categoryEvents} onClick={fetchEventInfo} />
            )}
          </div>

        </div>
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
      </div>
    );
    }
