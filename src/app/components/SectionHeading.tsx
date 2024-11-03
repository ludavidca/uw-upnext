// src/app/components/SectionHeading.js

interface SectionHeadingProps {
  text: string;
}

export default function SectionHeading({ text }: SectionHeadingProps) {
  return (
    <div className="my-4 px-4 sm:px-10 sm:pt-6 py-3">
      <h1 className="text-3xl font-semibold text-gray-100">{text}</h1>
    </div>
  );
}
