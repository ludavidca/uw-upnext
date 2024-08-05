// src/app/components/FeaturedEvent.tsx

interface EventProps {
    title: string;
    details: string;
    clubName: string;
    imgSource: string;
}

export default function FeaturedEvent({ title, details, clubName, imgSource}: EventProps) {
    
    return (
      <div className=" rounded-xl flex flex-row mx-10 featuredevent">
        <img src={imgSource} className="w-[30%] m-2 ml-3"></img>
        <div className="my-auto mx-4">
          <p className="text-lg font-medium line-clamp-2">{title}</p>
          <p className="text-sm">{details}</p>
          <h2 className="mb-2 text-sm text-gray-300">
            <img src="./pinEmoji.svg" className="inline px-1" alt="Pin Emoji" />
            {clubName}
          </h2>
        </div>
      </div>
    );
}
