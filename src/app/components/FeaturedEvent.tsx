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
<<<<<<< HEAD
      <div className=" rounded-2xl flex flex-row mx-10 featuredevent">
        <Image
          src={`https://www.instagram.com/p/${imgSource}/media/?size=l`}
          alt="featured event image"
          width={1000}
          height={1000}
          className="w-[30%] m-2 ml-3 rounded-2xl"
        />
        <div className="my-auto mx-4">
          <p className="text-lg font-medium line-clamp-2">{title}</p>
          <p className="text-sm">{details}</p>
          <h2 className="mb-2 text-sm text-gray-300">
            @
=======
      <div className=" my-5 rounded-xl flex flex-row mx-10 featuredevent">
        <img src={imgSource} className="w-[30%] m-2 ml-3"></img>
        <div className="my-auto mx-4">
          <p className="text-lg font-medium line-clamp-2">{title}</p>
          <p className="text-sm">{details}</p>
          <h2 className="mb-2 text-sm text-gray-300 inline">
            <img src="./pinEmoji.svg" className="inline px-1 pinimage" alt="Pin Emoji" />
>>>>>>> 7c8ae5b6720e5ea8f2e0823e9e9fb22f2c25b698
            {clubName}
          </h2>
          
        </div>
      </div>
    );
}
