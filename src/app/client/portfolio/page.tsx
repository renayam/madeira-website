"use client";
import React from "react";
import Image from "next/image";
import useImageExpand from "@/hook/useImageExpand";
import { usePortfolio } from "@/components/PortfolioContext";
import SliderPortofolio from "@/components/sliderPortofolio";

const ServiceList: React.FC = () => {
  const { portfolioItems } = usePortfolio();
  const { expandedImage, openImage, closeImage } = useImageExpand();

  return (
    <div className="flex flex-col items-center justify-around gap-10 bg-primary p-4">
      <p className="m-10 text-center text-lg text-white">
        Découvrez nos réalisations sur mesure pour transformer vos salles de
        bains en espaces uniques.
      </p>
      <SliderPortofolio />
      <div className="grid h-full w-full grid-cols-1 gap-6 md:grid-cols-3">
        {portfolioItems.map((item) => (
          <div key={item.id} className="flex h-[80vh] w-full flex-col rounded-lg">
            <div className="relative h-[50vh] w-full overflow-hidden rounded-lg">
              <Image
                src={item.mainImage}
                alt={item.altText}
                layout="fill"
                objectFit="cover"
                onClick={() => openImage(item.mainImage)}
                className="cursor-pointer transition-transform duration-300 hover:scale-105"
              />
            </div>
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-white">{item.description}</p>
          </div>
        ))}
      </div>

      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeImage}
        >
          <div className="relative flex h-[90vh] w-[90vw] items-center justify-center">
            <Image
              src={expandedImage}
              alt="Image Agrandie"
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 top-4 text-2xl text-white"
              onClick={closeImage}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
