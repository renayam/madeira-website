"use client";
import React, { useState } from "react";
import Image from "next/image";
import { usePrestationContext } from "@/components/PrestationContext";
import { Prestation } from "@/types/prestation";
import ImageSlider from "@/components/ImageSlider";

const PrestationList: React.FC = () => {
  const { prestations, isLoading } = usePrestationContext();
  const [selectedImages, setSelectedImages] = useState<string[] | null>(null);

  const handleImageClick = (mainImage: string, otherImages: string[] | string = []) => {
    const otherImagesArray = typeof otherImages === 'string'
      ? otherImages.split(',').filter(Boolean)
      : Array.isArray(otherImages) ? otherImages : [];
    
    const allImages = [mainImage, ...otherImagesArray];
    setSelectedImages(allImages);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg text-gray-600">Chargement des prestations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-8">
        <p className="mb-8 text-center text-base sm:text-lg md:text-xl text-white max-w-3xl mx-auto">
          Découvrez nos prestations sur mesure pour transformer vos espaces en lieux uniques.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {prestations.map((prestation: Prestation) => (
            <div 
              key={prestation.id} 
              className="flex flex-col rounded-lg bg-gray-900 overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <div 
                className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden"
                onClick={() => handleImageClick(prestation.bannerImage || '', prestation.otherImage)}
              >
                <Image
                  src={prestation.bannerImage || '/placeholder-image.jpg'}
                  alt={`Image de ${prestation.name}`}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
                {prestation.otherImage && (
                  <div className="absolute bottom-2 right-2 flex items-center justify-center rounded-full bg-black/70 px-2 py-1">
                    <svg 
                      className="h-4 w-4 text-white" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 6h16M4 12h16m-7 6h7" 
                      />
                    </svg>
                    <span className="ml-1 text-xs text-white">
                      +{(Array.isArray(prestation.otherImage) 
                        ? prestation.otherImage 
                        : prestation.otherImage.split(',').filter(Boolean)
                      ).length}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{prestation.name}</h3>
                <p className="text-sm sm:text-base text-gray-300">{prestation.description}</p>
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

export default PrestationList;
