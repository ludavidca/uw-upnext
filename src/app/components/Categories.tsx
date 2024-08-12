import React from "react";
import Image from "next/image";

interface CategoryItemProps {
  name: string;
  eventCount: number;
  onSelectCategory: (name: string) => void;
}

function CategoryItem({
  name,
  eventCount,
  onSelectCategory,
}: CategoryItemProps) {
  const lowName = name.toLowerCase();

  return (
    <div className="flex items-center pr-10">
      <button
        className="flex items-center space-x-4 hover:bg-purple-900 rounded-xl pl-5 sm:pl-0 pr-5 sm:pr-20"
        onClick={() => onSelectCategory(name)}
      >
        <Image
          src={`/categoryIcons/${lowName}.svg`}
          alt={`${name} icon`}
          width={0}
          height={0}
          className="w-2/5 sm:w-1/2 ml-0"
        />
        <div className="flex-col w-full">
          <p className="text-xl w-20 font-bold text-left text-white">{name} </p>
          <p className="text-xs font-semibold text-gray-200 text-left line-clamp-1">
            {eventCount} Events
          </p>
        </div>
      </button>
    </div>
  );
}

interface Category {
  name: string;
  eventCount: number;
}

interface CategoriesProps {
  onSelectCategory: (category: string) => void;
}

export default function Categories({ onSelectCategory }: CategoriesProps) {
  const categories: Category[] = [
    { name: "Tech", eventCount: 6 },
    { name: "Design", eventCount: 2 },
    { name: "Music", eventCount: 0 },
    { name: "Culture", eventCount: 1 },
    { name: "Social", eventCount: 0 },
    { name: "Sports", eventCount: 0 },
    { name: "Gaming", eventCount: 0 },
    { name: "Wellness", eventCount: 0 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 px-0 sm:px-10">
      {categories.map((category, index) => (
        <CategoryItem
          key={index}
          name={category.name}
          eventCount={category.eventCount}
          onSelectCategory={onSelectCategory}
        />
      ))}
    </div>
  );
}
