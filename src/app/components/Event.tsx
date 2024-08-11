// src/app/components/Event.tsx
import Image from "next/image";

interface EventProps {
  title: string;
  details: string;
  clubName: string;
  description: string;
  imgSource: string;
}


export default function Event({ title, details, clubName, description, imgSource }: EventProps) {
    return (
      <div className="bg-purple-950 mx-10 mb-5 max-w-screen-md min-w-[100%] rounded-3xl font-bold event p-5 ">
        <h2 className="text-xl mb-5 line-clamp-2 w-3/4">{title}</h2>
        <div className="flex flex-col md:flex-row">
          <div className="flex-grow md:pr-5">
            <h2 className="mb-2 text-base font-medium">{details}</h2>
            <h2 className="mb-2 text-sm text-slate-200 font-medium">
              @{clubName}
            </h2>
          </div>
          <p className="max-w-[35%] font-medium absolute ml-56 line-clamp-3">{description}</p>
          <Image
            src={`https://www.instagram.com/p/${imgSource}/media/?size=l`}
            alt="Event Image"
            height={100}
            width={100}
            className="w-full md:w-auto md:max-w-xs md:ml-5 self-start -mt-12 rounded-2xl"
          />
        </div>
      </div>
    );
}
