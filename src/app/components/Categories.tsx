import React from "react";
import Image from "next/image";

interface CategoryItemProps {
  name: string;
  onSelectCategory: (name: string) => void;
}

function CategoryItem({
  name,
  onSelectCategory,
}: CategoryItemProps) {
  const lowName = name.toLowerCase();

  return (
    <div>
    <div
      className="flex hover:bg-purple-900 rounded-3xl"
      onClick={() => onSelectCategory(name)}
    >
      <button className="flex items-center space-x-4 ml-5 sm:p-5">
        <Image
          src={`/categoryIcons/${lowName}.svg`}
          alt={`${name} icon`}
          width={1000}
          height={1000}
          className="w-14 sm:w-1/2"
        />
        <div className="flex-col">
          <p className="text-lg sm:text-2xl font-semibold text-left text-white">{name} </p>
        </div>
      </button>
    </div>
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
  const categories: string[] = ["Tech","Design","Culture","Social","Sports","Gaming","Music","Network"];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 px-0 sm:px-10">
      {categories.map((category, index) => (
        <CategoryItem
          key={index}
          name={category}
          onSelectCategory={onSelectCategory}
        />
      ))}
    </div>
  );
}
