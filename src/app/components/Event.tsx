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
        <div className="bg-purple-950 mx-10 mb-5 max-w-screen-md rounded-3xl font-bold event p-5 ">
            <h2 className="text-xl mb-5 line-clamp-2">{title}</h2>
            <div className="flex flex-col md:flex-row">
                <div className="flex-grow md:pr-5">
                    <h2 className="mb-2 text-xs">{details}</h2>
                    <h2 className="mb-2 "><img src="./pinEmoji.svg" className="inline px-1" alt="Pin Emoji" />{clubName}</h2>
                </div>
                <p className="max-w-72  absolute ml-56">{description}</p>
                <Image src={imgSource} alt="Event Image" height={0} width={0} className="w-full md:w-auto md:max-w-xs md:ml-5 self-start -mt-12" />
            </div>
        </div>
    );
}
