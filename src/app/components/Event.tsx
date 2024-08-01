// src/app/components/Event.tsx
export default function Event({ title, details, clubName, description, imgSource }) {
    return (
        <div className="bg-purple-950 mx-40">
            <h2 className="text-xl"> {title} </h2>
            <h2 className=""> {details} </h2>
            <h2 className=""> <img src="./pinEmoji.svg" className="inline px-2"></img>{clubName} </h2>
            <h2 className=""> {details} </h2>
            <h2 className=""> {description} </h2> <img src={imgSource}></img>
        </div>
    );
  } 