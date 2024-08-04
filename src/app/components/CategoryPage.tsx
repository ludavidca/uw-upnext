import React from "react";
import Image from "next/image";

interface CategoryPageProps {
  name: string;
  main: string;
  onSelectMain: (main: string) => void;
}

export default function CategoryPage({name, main, onSelectMain}: CategoryPageProps) {
    const lowName = name.toLowerCase();
    return (
      <div className="flex-col sm:flex sm:flex-row items-center mt-[2%] ml-[10%] mr-[10%] sm:mr-0 space-y-0">
        <div className="w-full sm:w-[30%] flex-col space-y-2 my-[5%] sm:my-0">
          <div className="flex items-center space-x-2">
            <Image
              src={`/categoryIcons/${lowName}.svg`}
              alt={`Image of E7`}
              width={40}
              height={40}
            />
            <div className="flex items-baseline space-x-1">
              <p className="text-2xl font-bold">{name}</p>
              <p className="text-m font-semibold text-gray-300">at UW</p>
            </div>
          </div>
          <div className=" sm:w-full border-t-2 border-gray-300" />

          <p className="text-m font-small text-gray-300 text-ellipsis">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation
          </p>
          <div className="w-full align-middle">
            <button
              className="px-4 py-2 w-full bg-gray-300 rounded-3xl font-regular text-sm my-[5%]"
              style={{ color: "rgb(133,0,205)" }}
              onClick={()=>onSelectMain(main)}
            >
              Back to Main Menu
            </button>
          </div>
        </div>

        <Image
          src={`/categoryImages/${lowName}.svg`}
          alt={`Image of E7`}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full sm:w-1/2 ml-0 sm:ml-[15%] "
        />
      </div>
    );
    }
