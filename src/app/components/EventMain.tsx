// src/app/components/Event.tsx
import { useEffect, useState } from "react";
import { events } from "./types/eventType";
import { formatUnixTime } from "./functions/gettime";

interface EventMainProps {
  index: string;
}

export default function EventMain({index}: EventMainProps) {
    const [eventDetails, setEventDetails] = useState<events | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const findSpecificIndex = async () => {
            try {
                const res = await fetch(`/api/findSpecificEvent?index=${index}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(`HTTP error! status: ${res.status}, message: ${errorData.error || "Unknown error"}`);
                }
                const data = await res.json();
                setEventDetails(data.results);
                console.log("Response data:", data.results);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setIsLoading(false);
            }
        };
        findSpecificIndex();
    }, [index]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!eventDetails) {
        return <div>No event details found.</div>;
    }

    return (
      <div>
        {isLoading && <div>Loading...</div>}
        {!isLoading && (
          <div className="mx-auto mt-[12%] w-11/12 max-w-4xl rounded-[4rem] eventMain">
            <div className="flex flex-col md:flex-row mx-auto mt-[12%]">
              <div className="w-full md:w-1/2 my-8 ml-0 md:ml-10">
                {" "}
                {/* Side 1 */}
                <img
                  src={`https://www.instagram.com/p/${eventDetails.url}/media/?size=l`}
                  className="w-[85%]  mx-auto md:mx-0"
                ></img>
                <div className="m-2 flex items-center">
                  <img
                    src="./uw_ux_logo.svg"
                    className="inline w-10 h-10"
                  ></img>
                  <p className="inline text-xl ml-2">
                    {" "}
                    {eventDetails.account}{" "}
                  </p>
                </div>
<<<<<<< HEAD
                <div className="ml-5 mb-8 flex items-center">
                  <img
                    src="./calendarImage.svg"
                    className="inline mr-2 w-6 h-6"
                  ></img>
                  <p className="inline"> Add to Calendar </p>
                </div>
                <div className="flex space-x-5">
                  <a
                    href={`https://www.instagram.com/p/${eventDetails.url}`}
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
                <p className="text-3xl mb-1">
                  {" "}
                  {eventDetails.event_details.event_name}{" "}
                  <img className="inline mb-[2%]" src="./crossbutton.svg"></img>{" "}
                </p>
                <img className="w-full mb-3"></img>
                <p className="text-lg mb-5">
                  {formatUnixTime(eventDetails.event_details.start_time)}
                  {eventDetails.event_details.start_time &&
                  eventDetails.event_details.end_time
                    ? " - "
                    : ""}
                  {formatUnixTime(eventDetails.event_details.end_time)}
                </p>
                <hr className="w-[80%] mb-3"></hr>
                <p className="w-full md:w-72 text-xs mb-8">
                  {" "}
                  {eventDetails.event_details.event_description}{" "}
                </p>
                <img src="./map.svg" className="w-[90%] mb-2"></img>
                <h2 className="mb-2 text-yellow-300 mt-2">
                  <img
                    src="./pinEmoji.svg"
                    className="inline px-1 w-6 h-6"
                    alt="Pin Emoji"
                  />{" "}
                  {eventDetails.event_details.location}
                </h2>
              </div>
=======
                <div className="w-full md:w-1/2 my-8"> {/* Side 2 */}
                    <p className="text-3xl mb-1"> {title} <img className="inline ml-[10%]" src="./crossbutton.svg"></img> </p> 
                    <img className="w-full mb-3"></img> 
                    <p className="text-lg mb-5"> {details} </p>
                    <hr className="w-[80%] mb-3"></hr>
                    <p className="w-full md:w-72 text-xs mb-8"> {description} </p>
                    <img src="./map.svg" className="w-[90%] mb-2"></img>
                    <h2 className="mb-2 text-yellow-300 mt-2 inline">
                        <img src="./pinEmoji.svg" className="inline px-1 w-6 h-6" alt="Pin Emoji" /> {location}
                        
                    </h2>
                </div> 
>>>>>>> 7c8ae5b6720e5ea8f2e0823e9e9fb22f2c25b698
            </div>
          </div>
        )}
      </div>
    );
}
