import React from "react";
import Image from "next/image";

interface CategoryPageProps {
  name: string;
}

export default function CategoryPage({name}: CategoryPageProps) {
    const lowName = name.toLowerCase();
    return (
        <div className="flex-col-reverse sm:flex sm:flex-row items-center gap-x-20 mx-48 ">
        <div className="flex-col w-56 space-y-2">
            <div className="flex items-center space-x-2">
                <Image
                    src={`/categoryIcons/${lowName}.svg`}
                    alt={`Image of E7`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: "25%", height: "auto" }}
                />
                <div className="flex items-baseline space-x-1">
                    <p className="text-2xl font-bold">{name}</p>
                    <p className="text-m font-semibold text-gray-300">at UW</p>
                </div>
            </div>
            <div className="w-full border-t-2 border-gray-300" />

            <p className="text-m font-small w-96 text-gray-300 overflow-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation
            </p>
        </div>

        <Image
            src="\categoryImages\tech.svg"
            alt={`Image of E7`}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full sm:w-1/2 mt-12 ml-[20%] "
        />
        </div>
    );
    }
