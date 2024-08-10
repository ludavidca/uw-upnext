import React, { useEffect, useState } from "react";
import Image from "next/image";
import SectionHeading from "./SectionHeading";
import Event from "./Event";
import FeaturedEvent from "./FeaturedEvent";

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
  id: number;
  url: string;
  likes: number;
  display_photo: string;
  is_event: boolean;
  embedded: Float64Array;
  event_details: event_details
}

interface CategoryPageProps {
  name: string;
  main: string;
  onSelectMain: (main: string) => void;
}

export default function CategoryPage({name, main, onSelectMain}: CategoryPageProps) {
    const [categoryEvents, setCategoryEvents] = useState<events[]>([])
    const lowName = name.toLowerCase();
    const allCapsCategory = name.toUpperCase();

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

    
    useEffect(()=>{
      const findSpecificEvent = async () => {
        try {
          const res = await fetch(
            `/api/categoryEvents?category=${allCapsCategory}`
          );
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const data = await res.json();
          setCategoryEvents(data.results)
        } catch (err) {
          console.error("Fetch error:", err);
        }
      };

      findSpecificEvent();
    },[])

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
                <p className="text-2xl font-bold">{name}</p>
                <p className="text-m font-semibold text-gray-300">at UW</p>
              </div>
            </div>
            <div className=" sm:w-full border-t-2 border-gray-300" />

            <p className="text-m font-small text-gray-300 text-ellipsis">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation
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
        <div className="ml-[5%]">
          <SectionHeading text={`Upcoming ${name} Events`} />
           <div className="hidden sm:block">
        {categoryEvents.map((event: events) => (
          <Event
            
            title={event.event_details.event_name}
            details={formatUnixTime(event.event_details.start_time)}
            clubName={event.account}
            description={event.event_details.event_description}
            imgSource={"/eventImage.svg"}
          />
        ))}
      </div>

      {/* Render this on screens smaller than 640px */}
      <div className="block sm:hidden">
        {categoryEvents.map((event: events) => (
          <FeaturedEvent
            title={event.event_details.event_name}
            details={formatUnixTime(event.event_details.start_time)}
            clubName={event.account}
            imgSource={"/eventImage.svg"}
            
          />
        ))}
      </div>

        </div>
      </div>
    );
    }
