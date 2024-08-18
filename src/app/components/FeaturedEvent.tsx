// src/app/components/FeaturedEvent.tsx
import Image from "next/image";

interface EventProps {
    title: string;
    details: string;
    clubName: string;
    imgSource: string;
}

export default function FeaturedEvent({ title, details, clubName, imgSource}: EventProps) {
    
    return (
      <div className=" rounded-2xl flex mx-4 sm:mx-10 featuredevent">
        <Image
          src={`https://www.instagram.com/p/${imgSource}/media/?size=l`}
          alt="featured event image"
          width={1000}
          height={1000}
          className="w-[30%] m-2 ml-3 rounded-2xl"
        />
        <div className="my-auto mx-4">
          <p className="text-lg font-medium line-clamp-2 text-white">{title}</p>
          <p className="text-sm text-white">{details}</p>
          <h2 className="mb-2 text-sm text-gray-300">@{clubName}</h2>
        </div>
      </div>
    );
}
