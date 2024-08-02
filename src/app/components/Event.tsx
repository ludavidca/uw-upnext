// src/app/components/Event.tsx

interface EventProps {
  title: string;
  details: string;
  clubName: string;
  description: string;
  imgSource: string;
}


export default function Event({ title, details, clubName, description, imgSource }: EventProps) {
    return (
        <div className="bg-purple-950 mx-10 my-10 max-w-screen-md rounded-3xl font-bold event p-5 ">
            <h2 className="text-xl mb-5">{title}</h2>
            <div className="flex flex-col md:flex-row">
                <div className="flex-grow md:pr-5">
                    <h2 className="mb-2 text-xs">{details}</h2>
                    <h2 className="mb-2 flex items-center"><img src="./pinEmoji.svg" className="inline px-1" alt="Pin Emoji" />{clubName}</h2>
                    
                    
                </div>
                <p className="max-w-72">{description}</p>
                <img src={imgSource} alt="Event Image" className="w-full md:w-auto md:max-w-xs md:ml-5 self-start -mt-12" />
            </div>
        </div>
    );
}
