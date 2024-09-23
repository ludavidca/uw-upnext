// src/app/components/Event.tsx
import { ErrorProps } from "next/error";
import Image from "next/image";
import { useState } from "react";

interface EventProps {
  title: string;
  details: string;
  clubName: string;
  description: string;
  imgSource: string;
  url: string;
}


export default function Event({ title, details, clubName, description, url, imgSource }: EventProps) {
    const [error, setError] = useState(false);

    const handleError = (error: any) => {
      console.error("Image loading failed:", {
        error: error.message,
        type: error.type,
        // Log additional properties of the error object
        errorDetails: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      });
      setError(true);
    };

    return (
      <div className="bg-purple-750 mx-10 mb-5 w-[90%] rounded-3xl font-bold event p-5 cursor-pointer">
        <div className="flex flex-col md:flex-row">
          <div className="w-1/4 md:pr-5">
            <h2 className="text-2xl mb-3 line-clamp-2 text-white">{title}</h2>
            <h2 className="mb-2 text-base font-medium text-gray-300">
              {details}
            </h2>
            <h2 className="mb-2 text-sm text-yellow-500 font-medium">
              @{clubName}
            </h2>
          </div>
          <p className="w-1/2 h-flex flex justify-center items-center font-medium line-clamp-3 text-white">
            {description}
          </p>
          <Image
            src={
              clubName === "WUSA"
                ? `${imgSource}`
                : `https://www.instagram.com/p/${url}/media/?size=l`
            }
            alt="Event Image"
            height={100}
            width={100}
            className="w-full md:w-auto md:max-w-xs md:ml-auto rounded-2xl object-cover"
            onError={handleError}
          />
        </div>
      </div>
    );
}

//unknown errors
