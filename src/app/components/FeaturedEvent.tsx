// src/app/components/FeaturedEvent.tsx
import Image from "next/image";

interface EventProps {
  title: string;
  details: string;
  clubName: string;
  imgSource: string;
  url: string;
  isMobile: boolean;
}

export default function FeaturedEvent({
  title,
  details,
  clubName,
  imgSource,
  url,
  isMobile,
}: EventProps) {
  return (
    <div>
      <div className="rounded-2xl flex sm:mx-10 sm:p-0 featuredevent h-28 sm:h-36 m-4 ${isMobile ? 'w-full' : 'border-l-2 w-[80%]'} cursor-pointer">
        {clubName === "WUSA" ? (
          <Image
            src={imgSource}
            alt="featured event image"
            width={1000}
            height={1000}
            className="w-24 h-24 sm:h-[90%] sm:w-[30%]  m-2 ml-3 rounded-2xl object-cover"
          />
        ) : (
          <Image
            src={`/InstagramImages/${url}.pdf`}
            alt="featured event image"
            width={1000}
            height={1000}
            className="w-24 h-24 sm:h-[90%] sm:w-[30%]  m-2 ml-3 rounded-2xl object-cover"
          />
        )}
        <div className="my-auto mx-4">
          <p className="text-lg font-medium line-clamp-2 text-white">{title}</p>
          <p className="text-sm text-white">{details}</p>
          <h2 className="mb-2 text-sm text-gray-300">@{clubName}</h2>
        </div>
      </div>
    </div>
  );
}
