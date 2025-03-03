"use client";
import React, { useState } from "react";
import Image from "next/image";
import { usePortfolio } from "@/components/PortfolioContext";
import SliderPortofolio from "@/components/sliderPortofolio";
import ImageSlider from "@/components/ImageSlider";

const ServiceList: React.FC = () => {
  const { portfolioItems } = usePortfolio();
  const [selectedImages, setSelectedImages] = useState<string[] | null>(null);

  const handleImageClick = (
    mainImage: string,
    otherImages: string[] | string = [],
  ) => {
    console.log("Main Image:", mainImage);
    console.log("Other Images (raw):", otherImages);

    const otherImagesArray =
      typeof otherImages === "string"
        ? otherImages.split(",").filter(Boolean)
        : Array.isArray(otherImages)
          ? otherImages
          : [];

    console.log("Other Images (processed):", otherImagesArray);

    const allImages = [mainImage, ...otherImagesArray];
    console.log("All Images:", allImages);

    setSelectedImages(allImages);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-gray-900">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <p className="mx-auto mb-12 max-w-3xl text-center text-base leading-relaxed text-gray-300 sm:text-lg md:text-xl">
          Découvrez nos réalisations sur mesure pour transformer vos salles de
          bains en espaces uniques.
        </p>

        <div className="mb-16">
          <SliderPortofolio />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="group flex transform flex-col overflow-hidden rounded-xl border border-gray-700/30 bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-blue-400 sm:text-2xl">
                  {item.title}
                </h3>
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={item.mainImage}
                  alt={item.altText}
                  layout="fill"
                  objectFit="cover"
                  onClick={() =>
                    handleImageClick(item.mainImage, item.otherImage)
                  }
                  className="cursor-pointer transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="p-6">
                <p className="text-base leading-relaxed text-gray-300">
                  {item.description}
                </p>
                <button
                  onClick={() =>
                    handleImageClick(item.mainImage, item.otherImage)
                  }
                  className="mt-4 inline-flex items-center text-sm text-blue-400 transition-colors hover:text-blue-300"
                >
                  Voir plus
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImages && selectedImages.length > 0 && (
        <ImageSlider
          images={selectedImages}
          onClose={() => setSelectedImages(null)}
        />
      )}
    </div>
  );
};

export default ServiceList;
