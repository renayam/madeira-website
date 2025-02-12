"use client";
import React, { useState } from "react";
import Image from "next/image";
import useImageExpand from "@/hook/useImageExpand";
import { usePortfolio } from "@/components/PortfolioContext";
import SliderPortofolio from "@/components/sliderPortofolio";

const ServiceList: React.FC = () => {
  const { portfolioItems } = usePortfolio();

  const { expandedImage, openImage, closeImage } = useImageExpand();
  const [currentGallery, setCurrentGallery] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const openGallery = (gallery: string[], index: number) => {
    setCurrentGallery(gallery);
    setCurrentIndex(index);
    openImage(gallery[index]);
  };

  const navigateGallery = (direction: "prev" | "next") => {
    let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0) newIndex = currentGallery.length - 1;
    if (newIndex >= currentGallery.length) newIndex = 0;
    setCurrentIndex(newIndex);
    openImage(currentGallery[newIndex]);
  };

  return (
    <div className="flex flex-col items-center justify-around gap-10 bg-primary p-4">
      <p className="m-10 text-center text-lg text-white">
        Découvrez nos réalisations sur mesure pour transformer vos salles de
        bains en espaces uniques.
      </p>
      <SliderPortofolio />
      <div className="grid h-full w-full grid-cols-1 gap-6 md:grid-cols-3">
        {portfolioItems.map((item, index) => (
          <div key={index} className="flex h-[80vh] w-full flex-col rounded-lg">
            <div className="relative h-[50vh] w-full overflow-hidden rounded-lg">
              <Image
                src={item.mainImage}
                alt={item.altText}
                layout="fill"
                objectFit="cover"
                onClick={() => openGallery(item.gallery, 0)}
              />
            </div>

            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-white">{item.description}</p>
          </div>
        ))}
      </div>

      {expandedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <button
            className="absolute left-4 text-7xl text-white"
            onClick={(e) => {
              e.stopPropagation();
              navigateGallery("prev");
            }}
          >
            ‹
          </button>
          <div className="relative flex h-[80vh] items-center">
            <Image
              src={expandedImage}
              alt="Image Agrandie"
              layout="intrinsic"
              width={800}
              height={600}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <button
            className="absolute right-4 text-7xl text-white"
            onClick={(e) => {
              e.stopPropagation();
              navigateGallery("next");
            }}
          >
            ›
          </button>
          <button
            className="absolute right-4 top-4 text-2xl text-white"
            onClick={closeImage}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
