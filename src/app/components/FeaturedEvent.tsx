// src/app/components/FeaturedEvent.tsx
import Image from "next/image";

interface EventProps {
    title: string;
    details: string;
    clubName: string;
    imgSource: string;
    url: string;
}

export default function FeaturedEvent({ title, details, clubName, imgSource, url}: EventProps) {
    
    return (
      <div>
        <div className=" rounded-2xl flex mx-4 sm:mx-10 sm:p-0 featuredevent min-h-40">
          {clubName === "WUSA" ? (
            <Image
              src={imgSource}
              alt="featured event image"
              width={1000}
              height={1000}
              className=" w-[35%] m-2 ml-3 rounded-2xl object-cover"
            />
          ) : (
            <Image
              src={`https://www.instagram.com/p/${url}/media/?size=l`}
              alt="featured event image"
              width={1000}
              height={1000}
              className="w-[35%]  m-2 ml-3 rounded-2xl object-cover"
            />
          )}
          <div className="my-auto mx-4">
            <p className="text-lg font-medium line-clamp-2 text-white">
              {title}
            </p>
            <p className="text-sm text-white">{details}</p>
            <h2 className="mb-2 text-sm text-gray-300">@{clubName}</h2>
          </div>
        </div>
      </div>
    );
}
