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
      <button className="flex items-center space-x-4 ml-5 sm:ml-0 sm:p-3">
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


// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { useRouter, usePathname } from "next/navigation";

// interface CategoryItemProps {
//   name: string;
//   onSelectCategory: (name: string) => void;
// }

// function CategoryItem({ name, onSelectCategory }: CategoryItemProps) {
//   const lowName = name.toLowerCase();

//   return (
//     <div>
//       <div
//         className="flex hover:bg-purple-900 rounded-3xl"
//         onClick={() => onSelectCategory(name)}
//       >
//         <button className="flex items-center space-x-4 ml-5 sm:ml-0 sm:p-3">
//           <Image
//             src={`/categoryIcons/${lowName}.svg`}
//             alt={`${name} icon`}
//             width={1000}
//             height={1000}
//             className="w-14 sm:w-1/2"
//           />
//           <div className="flex-col">
//             <p className="text-lg sm:text-2xl font-semibold text-left text-white">
//               {name}
//             </p>
//           </div>
//         </button>
//       </div>
//     </div>
//   );
// }

// interface CategoriesProps {
//   onCategoryChange: (category: string) => void;
// }

// export default function Categories({ onCategoryChange }: CategoriesProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const categories: string[] = [
//     "Tech",
//     "Design",
//     "Culture",
//     "Social",
//     "Sports",
//     "Gaming",
//     "Music",
//     "Network",
//   ];

//   const [currentCategory, setCurrentCategory] = useState<string>("main");

//   useEffect(() => {
//     // Initialize the category based on the current URL
//     const pathCategory = pathname.slice(1); // Remove the leading '/'
//     if (pathCategory) {
//       const category =
//         pathCategory.charAt(0).toUpperCase() + pathCategory.slice(1);
//       setCurrentCategory(category);
//       onCategoryChange(category);
//     } else {
//       setCurrentCategory("main");
//       onCategoryChange("main");
//     }
//   }, [pathname, onCategoryChange]);

//   const navigateTo = (newCategory: string) => {
//     const lowercaseCategory = newCategory.toLowerCase();
//     router.push(lowercaseCategory === "main" ? "/" : `/${lowercaseCategory}`);
//     setCurrentCategory(newCategory);
//     onCategoryChange(newCategory);
//   };

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 px-0 sm:px-10">
//       {categories.map((category, index) => (
//         <CategoryItem
//           key={index}
//           name={category}
//           onSelectCategory={navigateTo}
//         />
//       ))}
//     </div>
//   );
// }
