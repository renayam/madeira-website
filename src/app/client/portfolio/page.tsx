"use client";
import React, { useState } from "react";
import Image from "next/image";
import { usePortfolio } from "@/components/PortfolioContext";
import SliderPortofolio from "@/components/sliderPortofolio";
import ImageSlider from "@/components/ImageSlider";

const ServiceList: React.FC = () => {
  const { portfolioItems } = usePortfolio();
  const [selectedImages, setSelectedImages] = useState<string[] | null>(null);

  const handleImageClick = (mainImage: string, otherImages: string[] | string = []) => {
    console.log('Main Image:', mainImage);
    console.log('Other Images (raw):', otherImages);
    
    // Convert otherImages to array if it's a string
    const otherImagesArray = typeof otherImages === 'string' 
      ? otherImages.split(',').filter(Boolean)
      : Array.isArray(otherImages) ? otherImages : [];
    
    console.log('Other Images (processed):', otherImagesArray);
    
    // Combine main image with other images for the slider
    const allImages = [mainImage, ...otherImagesArray];
    console.log('All Images:', allImages);
    
    setSelectedImages(allImages);
  };

  return (
    <div className="flex flex-col items-center justify-around gap-10 bg-primary p-4">
      <p className="m-10 text-center text-lg text-white">
        Découvrez nos réalisations sur mesure pour transformer vos salles de
        bains en espaces uniques.
      </p>
      <SliderPortofolio />
      <div className="grid h-full w-full grid-cols-1 gap-6 md:grid-cols-3">
        {portfolioItems.map((item) => (
          <div key={item.id} className="flex h-auto w-full flex-col rounded-lg bg-gray-900 p-4">
            <div className="relative h-[50vh] w-full overflow-hidden rounded-lg">
              <Image
                src={item.mainImage}
                alt={item.altText}
                layout="fill"
                objectFit="cover"
                onClick={() => handleImageClick(item.mainImage, item.otherImage)}
                className="cursor-pointer transition-transform duration-300 hover:scale-105"
              />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-gray-300">{item.description}</p>
          </div>
        ))}
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
