// src/app/components/Event.tsx
import { useEffect, useState } from "react";
import { events } from "./types/eventType";
import { formatUnixTime } from "./functions/gettime";
import Image from "next/image";
import { isNull } from "util";

interface EventProps {
  title: string;
  start_time: number;
  end_time: number | null;
  details: string;
  clubName: string;
  description: string;
  location: string | null;
  postUrl: string;
  imgUrl: string;
  onClose: () => void;
}

export default function EventMain({ title, details, start_time, end_time, clubName, description, location, postUrl, onClose, imgUrl }: EventProps) {
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      };

    const mapsUrl = (inputString: string | null) => {
      if (inputString === null) {
        return "https://www.google.ca/maps/search/university+of+waterloo";
      }
      const baseUrl = "https://www.google.ca/maps/search/";
      const encodedString = inputString.replace(/ /g, "+");
      const universitycoords = "/@43.4738936,-80.5445333,14.78z";
      return baseUrl + encodedString + universitycoords;
    };


    return (
      <div
        className="flex bottom-0 fixed overflow-y-auto h-full inset-0 z-50 items-center justify-center bg-black bg-opacity-50  overscroll-none"
        onClick={handleBackdropClick}
      >
        <div className="mx-auto my-auto  w-full sm:w-11/12 max-w-4xl sm:rounded-[4rem] eventMain bg-white">
          <div className="flex flex-col md:flex-row mx-auto sm:mt-0">
            <div className="w-full md:w-1/2 my-8 ml-0 md:ml-10">
              <div className="flex flex-col w-full">
                <img
                  className="mb-[2%] w-6 mr-16 inline sm:hidden self-end -translate-y-[-250%]"
                  src="./crossbutton.svg"
                  onClick={onClose}
                ></img>
              </div>

              {/* Side 1 */}
              {clubName === "WUSA" ? (
                <Image
                  src={imgUrl}
                  height={1000}
                  width={1000}
                  alt="Event Image"
                  className="w-[85%] h-[65%] mx-auto sm:mt-0 md:mx-0 rounded-3xl mb-5 object-cover"
                />
              ) : (
                <Image
                  src={`https://www.instagram.com/p/${postUrl}/media/?size=l`}
                  height={1000}
                  width={1000}
                  alt="Event Image"
                  className="w-[85%] mx-auto sm:mt-0 md:mx-0 rounded-3xl mb-5"
                />
              )}
              <div className="ml-[10%] sm:ml-0">
                <a
                  href={
                    clubName === "WUSA"
                      ? `https://www.instagram.com/yourwusa`
                      : `https://www.instagram.com/${clubName}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center">
                    <img
                      src="./uw_ux_logo.svg"
                      className="inline w-10 h-8 ml-1 "
                    ></img>
                    <p className="inline text-xl ml-2 text-white">
                      {" "}
                      {clubName}{" "}
                    </p>
                  </div>
                </a>
                <div className="mb-8 mt-2 flex items-center">
                  <img
                    src="./calendarImage.svg"
                    className="inline ml-3 mr-2 w-6 h-6"
                  ></img>
                  <p className="inline text-white"> Add to Calendar </p>
                </div>
              </div>
              <a
                href={
                  clubName === "WUSA"
                    ? `${postUrl}`
                    : `https://www.instagram.com/p/${postUrl}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex flex-col w-full">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-3xl w-[85%] sm:w-[90%] ml-[3%] sm:ml-0 self-center"
                  style={{ color: "rgb(76,34,104)" }}
                >
                  View Post
                </button>
                </div>
              </a>
            </div>
            <div className="flex-row w-full ml-[10%] md:w-1/2 my-8">
              {" "}
              {/* Side 2 */}
              <div className="flex flex-row">
                <p className="text-3xl mb-1 inline max-w-[70%] text-white">
                  {" "}
                  {title}{" "}
                </p>
                <img
                  className="mb-[2%] ml-[10%] hidden sm:flex"
                  src="./crossbutton.svg"
                  onClick={onClose}
                ></img>{" "}
              </div>
              <img className="w-full mb-3"></img>
              <p className="text-lg mb-5 text-white">
                {formatUnixTime(start_time)}
                {start_time && end_time ? " - " : ""}
                {end_time !== null && formatUnixTime(end_time)}
              </p>
              <hr className="w-[80%] mb-3"></hr>
              <p className="w-[80%] md:w-[80%] text-xs mb-8 line-clamp-6 text-white">
                {" "}
                {description}{" "}
              </p>
              <a
                href={mapsUrl(location)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="./map.svg" className="w-[80%] mb-2"></img>
                <h2 className="mb-2 text-yellow-300 mt-2 underline underline-offset-4">
                  <img
                    src="./pinEmoji.svg"
                    className="inline px-1 w-6 h-6"
                    alt="Pin Emoji"
                  />
                  {location}
                  {!location && "University of Waterloo"}
                </h2>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
}
