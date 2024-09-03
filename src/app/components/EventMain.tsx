// src/app/components/Event.tsx
import { useEffect, useState } from "react";
import { events } from "./types/eventType";
import { formatUnixTime } from "./functions/gettime";
import Image from "next/image";
import { isNull } from "util";
import * as ics from "ics"
import { EventAttributes } from "ics";

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
      if (inputString === null || inputString === "null") {
        return "https://www.google.ca/maps/search/university+of+waterloo";
      }
      const baseUrl = "https://www.google.ca/maps/search/";
      const encodedString = inputString.replace(/ /g, "+");
      const universitycoords = "/@43.4738936,-80.5445333,14.78z";
      return baseUrl + encodedString + universitycoords;
    };

    async function handleDownload() {
     const extractTimeArray = function (
       dateinUnix: number
     ): [number, number, number, number, number] {
       const date = new Date(dateinUnix * 1000 - 7200000);
       return [
         date.getFullYear(),
         date.getMonth() + 1,
         date.getDate(),
         date.getHours(),
         date.getMinutes(),
       ];
     };

     const findDuration = function (date1: number, date2: number | null) {
      if( date2 !== null) {
        const newdate1 = new Date(date1);
        const newdate2 = new Date(date2);
        const diffInMs = Math.abs(newdate2.getTime() - newdate1.getTime());
        const diffInHours = Math.floor(diffInMs / (60 * 60));
        const diffInMinutes = Math.floor(
          (diffInMs % (60 * 60)) / (60)
        );

        return { hours: diffInHours, minutes: diffInMinutes };
      } else {
       return { hours: 1, minutes: 30 };
      }
     };

     if (location !== null) {
      if (location !== "null") {
        var icslocation = location
      } else {
        var icslocation = "University of Waterloo";
      }
     } else {
      var icslocation = "University of Waterloo"
     }

     const icsfile: EventAttributes = {
       start: extractTimeArray(start_time),
       duration: findDuration(start_time, end_time),
       title: title,
       description:
         description +
         "Please check with clubs to finalize dates and register if necessary",
       location: icslocation,
       status: "TENTATIVE",
       url: `https://www.instagram.com/p/${postUrl}`,
       organizer: {
         name: clubName,
         email: "uwupnext@gmail.com",
       },
     };
     console.log(start_time);
    console.log(icsfile)
    const filename = title + '.ics';
    const file = await new Promise((resolve, reject) => {
      ics.createEvent(icsfile, (error, value) => {
        if (error) {
          reject(error);
        }

        resolve(new File([value], filename, { type: "text/calendar" }));
      });
    });
    const url = URL.createObjectURL(file as File);

    // trying to assign the file URL to a window could cause cross-site
    // issues so this is a workaround using HTML5
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
  }

    return (
      <div
        className="flex bottom-0 fixed overflow-y-auto h-full inset-0 z-50 items-center justify-center sm:py-10 bg-black bg-opacity-50 overflow-x-hidden overscroll-none"
        onClick={handleBackdropClick}
      >
        <div className="mx-auto my-auto  w-full sm:w-11/12 max-w-4xl sm:rounded-[4rem] eventMain bg-white">
          <img
            className="relative mr-[5%] hidden sm:flex float-end z-20 -translate-y-[-150%]"
            src="./crossbutton.svg"
            onClick={onClose}
          ></img>{" "}
          <div className="flex flex-col md:flex-row mx-auto my-5">
            <div className="w-full h-fit md:w-1/2 my-8 ml-0 md:ml-10">
              <div className="flex flex-col w-full">
                <img
                  className="mb-[2%] w-6 mr-16 inline sm:hidden self-end -translate-y-[-250%]"
                  src="./crossbuttonMobile.svg"
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
                  className="w-[80%] sm:w-[85%] mx-auto sm:mt-0 md:mx-0 rounded-3xl mb-5 object-cover"
                />
              ) : (
                <Image
                  src={`https://www.instagram.com/p/${postUrl}/media/?size=l`}
                  height={1000}
                  width={1000}
                  alt="Event Image"
                  className="w-[80%] sm:w-full h-2/3 mx-auto sm:mt-0 md:mx-0 rounded-3xl mb-5 object-cover"
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
                      className="inline w-10 h-8 sm:ml-4 "
                    ></img>
                    <p className="inline text-xl ml-2 text-white">
                      {" "}
                      {clubName}{" "}
                    </p>
                  </div>
                </a>
                <a
                  href={mapsUrl(location)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h2 className="sm:ml-5 mb-5 text-yellow-300 mt-2 underline underline-offset-4">
                    <img
                      src="./pinEmoji.svg"
                      className="inline px-1 w-6 h-6"
                      alt="Pin Emoji"
                    />
                    {location !== "null" && location}
                    {!location ||
                      (location === "null" && "University of Waterloo")}
                  </h2>
                </a>
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
                    className="px-4 py-2 bg-gray-300 rounded-3xl w-[80%] sm:w-[90%] self-center"
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
                <p className="text-3xl mb-1 inline w-[80%] sm:max-w-[100%] text-white">
                  {" "}
                  {title}{" "}
                </p>
              </div>
              <img className="w-full mb-3"></img>
              <p className="text-lg mb-2 text-white">
                {formatUnixTime(start_time)}
                {start_time && end_time && end_time > start_time ? " - " : ""}
                {end_time !== null &&
                  end_time > start_time &&
                  formatUnixTime(end_time)}
              </p>
              <div className="flex items-center mb-3">
                <img
                  src="./calendarImage.svg"
                  className="inline mr-2 w-6 h-6"
                ></img>
                <button onClick={handleDownload} className="inline text-white">
                  {" "}
                  Add to Calendar{" "}
                </button>
              </div>
              <hr className="w-[80%] sm:w-[100%] mb-3"></hr>
              <p className="w-[80%] sm:w-full h-[60%] text-base mb-8 text-white overflow-y-scroll hide-scrollbar">
                {" "}
                {description}{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
}
