// src/app/components/Event.tsx

interface EventProps {
    title: string
    details: string
    clubName: string
    description: string
    location: string
}

export default function EventMain({ title, details, clubName, description, location }: EventProps) {
    return (
        <div className="mx-auto mt-[12%] w-11/12 max-w-4xl rounded-[4rem] eventMain">
            <div className="flex flex-col md:flex-row mx-auto mt-[12%]">
                <div className="w-full md:w-1/2 my-8 ml-0 md:ml-10"> {/* Side 1 */}
                    <img src="./eventImage.svg" className="w-[85%]  mx-auto md:mx-0"></img>
                    <div className="m-2 flex items-center">
                        <img src="./uw_ux_logo.svg" className="inline w-10 h-10"></img>
                        <p className="inline text-xl ml-2"> {clubName} </p>
                    </div>
                    <div className="ml-5 mb-8 flex items-center">
                        <img src="./calendarImage.svg" className="inline mr-2 w-6 h-6"></img>
                        <p className="inline"> Add to Calendar </p>
                    </div>
                    <div className="flex space-x-5">
                        <button
                            className="px-4 py-2 bg-gray-300 rounded-3xl w-40"
                            style={{ color: "rgb(76,34,104)" }}
                        >
                            View Post
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-300 rounded-3xl w-40"
                            style={{ color: "rgb(76,34,104)" }}
                        >
                            Register
                        </button>
                    </div>
                </div>
                <div className="w-full md:w-1/2 my-8"> {/* Side 2 */}
                    <p className="text-3xl mb-1"> {title} <img className="inline ml-[10%]" src="./crossbutton.svg"></img> </p> 
                    <img className="w-full mb-3"></img> 
                    <p className="text-lg mb-5"> {details} </p>
                    <hr className="w-[80%] mb-3"></hr>
                    <p className="w-full md:w-72 text-xs mb-8"> {description} </p>
                    <img src="./map.svg" className="w-[90%] mb-2"></img>
                    <h2 className="mb-2 text-yellow-300 mt-2 inline">
                        <img src="./pinEmoji.svg" className="inline px-1 w-6 h-6" alt="Pin Emoji" /> {location}
                        
                    </h2>
                </div> 
            </div>
        </div>
    );
}
