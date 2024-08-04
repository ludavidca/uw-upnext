// src/app/components/SectionHeading.js
export default function SectionHeading({ text }) {
    return (
      <div className="px-5 sm:px-10 py-5">
        <h1 className="text-2xl font-semibold text-gray-100">{text}</h1>
      </div>
    );
  } 