import React from "react";

interface TimelineWrapperProps {
  children: React.ReactNode;
  date?: string;
}

export default function TimelineWrapper({ children, date }: TimelineWrapperProps) {
  return (
    <div className="flex items-start ml-[1.8%]">
      <div className="relative flex flex-col items-center">
        {date && (
          <div className="absolute w-3 h-3 bg-white rounded-full -left-2.5 top-0"></div>
        )}
        <div className="w-0.5 bg-gray-300 h-full"></div>
      </div>
      <div className="ml-4 w-full">
        {date && <h3 className="text-lg font-semibold mb-2">{date}</h3>}
        {children}
      </div>
    </div>
  );
}
