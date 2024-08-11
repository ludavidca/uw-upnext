// src/app/components/Event.tsx
import { useEffect, useState } from "react";
import { events } from "./types/eventType";
import { formatUnixTime } from "./functions/gettime";
import Image from "next/image";

interface EventProps {
  title: string;
  start_time: number;
  end_time: number;
  details: string;
  clubName: string;
  description: string;
  location: string;
  postUrl: string;
  onClose: () => void;
}

export default function EventMain({ title, details, start_time, end_time, clubName, description, location, postUrl, onClose }: EventProps) {
    // const [eventDetails, setEventDetails] = useState<events | null>(null);
    // const [isLoading, setIsLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);

    // useEffect(() => {
    //     const findSpecificIndex = async () => {
    //         try {
    //             const res = await fetch(`/api/findSpecificEvent?index=${index}`);
    //             if (!res.ok) {
    //                 const errorData = await res.json();
    //                 throw new Error(`HTTP error! status: ${res.status}, message: ${errorData.error || "Unknown error"}`);
    //             }
    //             const data = await res.json();
    //             setEventDetails(data.results);
    //             console.log("Response data:", data.results);
    //         } catch (err) {
    //             console.error("Fetch error:", err);
    //             setError(err instanceof Error ? err.message : String(err));
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
    //     findSpecificIndex();
    // }, [index]);

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

    // if (error) {
    //     return <div>Error: {error}</div>;
    // }

    // if (!eventDetails) {
    //     return <div>No event details found.</div>;
    // }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-auto  w-11/12 max-w-4xl rounded-[4rem] eventMain bg-white ">
            <div className="flex flex-col md:flex-row mx-auto ">
              <div className="w-full md:w-1/2 my-8 ml-0 md:ml-10">
                {" "}
                {/* Side 1 */}
                <Image
                  src={`https://www.instagram.com/p/${postUrl}/media/?size=l`}
                  height={1000}
                  width={1000}
                  alt="Event Image"
                  className="w-[85%]  mx-auto md:mx-0"
                />
                <div className="m-2 flex items-center">
                  <img
                    src="./uw_ux_logo.svg"
                    className="inline w-10 h-10"
                  ></img>
                  <p className="inline text-xl ml-2">
                    {" "}
                    {clubName}{" "}
                  </p>
                </div>
                <div className="ml-5 mb-8 flex items-center">
                  <img
                    src="./calendarImage.svg"
                    className="inline mr-2 w-6 h-6"
                  ></img>
                  <p className="inline"> Add to Calendar </p>
                </div>
                <div className="flex space-x-5">
                  <a
                    href={`https://www.instagram.com/p/${postUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button
                      className="px-4 py-2 bg-gray-300 rounded-3xl w-40"
                      style={{ color: "rgb(76,34,104)" }}
                    >
                      View Post
                    </button>
                  </a>
                  <button
                    className="px-4 py-2 bg-gray-300 rounded-3xl w-40"
                    style={{ color: "rgb(76,34,104)" }}
                  >
                    Register
                  </button>
                </div>
              </div>
              <div className="flex-row w-full md:w-1/2 my-8">
                {" "}
                {/* Side 2 */}
                <div className="flex flex-row">
                <p className="text-3xl mb-1 inline max-w-[70%]">
                  {" "}
                  {title}{" "}
                  
                </p>
                <img className="inline mb-[2%] ml-[10%]" src="./crossbutton.svg" onClick={onClose}></img>{" "}
                </div>
                
                <img className="w-full mb-3"></img>
                <p className="text-lg mb-5">
                  {formatUnixTime(start_time)}
                  {start_time &&
                  end_time
                    ? " - "
                    : ""}
                  {formatUnixTime(end_time)}
                </p>
                <hr className="w-[80%] mb-3"></hr>
                <p className="w-full md:w-72 text-xs mb-8">
                  {" "}
                  {description}{" "}
                </p>
                <img src="./map.svg" className="w-[90%] mb-2"></img>
                <h2 className="mb-2 text-yellow-300 mt-2">
                  <img
                    src="./pinEmoji.svg"
                    className="inline px-1 w-6 h-6"
                    alt="Pin Emoji"
                  />{" "}
                  {location}
                </h2>
              </div>
            </div>
          </div>
      </div>
    );
}
