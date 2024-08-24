// src/app/components/Event.tsx
import Image from "next/image";

interface EventProps {
  title: string;
  details: string;
  clubName: string;
  description: string;
  imgSource: string;
  url: string;
}


export default function Event({ title, details, clubName, description, url, imgSource }: EventProps) {
    return (
      <div className="bg-purple-750 mx-10 mb-5 w-[90%] rounded-3xl font-bold event p-5 ">
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
          <p className="w-1/2 mt-4 font-medium line-clamp-3 text-white">
            {description}
          </p>
          <Image
            src={clubName === "WUSA"? `${imgSource}` : `https://www.instagram.com/p/${url}/media/?size=l`}
            alt="Event Image"
            height={100}
            width={100}
            className="w-full md:w-auto md:max-w-xs md:ml-auto rounded-2xl object-cover"
          />
        </div>
      </div>
    );
}
