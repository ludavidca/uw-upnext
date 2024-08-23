// src/app/components/SectionHeading.js

interface SectionHeadingProps {
  text: string;
}

export default function SectionHeading({ text }: SectionHeadingProps) {
    return (
      <div className="px-5 sm:px-10 py-3 pt-10">
        <h1 className="text-3xl font-semibold text-gray-100">{text}</h1>
      </div>
    );
  } 