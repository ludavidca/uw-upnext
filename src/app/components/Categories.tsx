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
    <div className="flex items-center">
      <button
        className="flex items-center space-x-4 hover:bg-purple-900 rounded-xl pr-20 px-5"
        onClick={() => onSelectCategory(name)}
      >
        <Image
          src={`/categoryIcons/${lowName}.svg`}
          alt={`${name} icon`}
          width={64}
          height={64}
        />
        <div className="flex-col">
          <p className="text-xl font-bold">{name}</p>
          <p className="text-xs font-semibold text-gray-200">
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
    { name: "Arts", eventCount: 3 },
    { name: "Music", eventCount: 7 },
    { name: "Culture", eventCount: 4 },
    { name: "Social", eventCount: 6 },
    { name: "Sports", eventCount: 2 },
    { name: "Gaming", eventCount: 8 },
    { name: "Wellness", eventCount: 5 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 px-10">
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
