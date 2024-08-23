// src/app/components/SectionHeading.js

interface TimeLineHeadingProps {
  text: string;
}

export default function TimelineHeading({ text }: TimeLineHeadingProps) {
  return (
    <div className="px-5 sm:px-10 py-3">
      <h1 className="text-sm font-semibold text-gray-100">{text}</h1>
    </div>
  );
} 
