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
    // Convert otherImages to array if it's a string
    const otherImagesArray = typeof otherImages === 'string'
      ? otherImages.split(',').filter(Boolean)
      : Array.isArray(otherImages) ? otherImages : [];
    
    // Combine main image with other images for the slider
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
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-6 text-center text-3xl font-bold">
        Liste des Prestations
      </h2>
      {prestations.length === 0 ? (
        <p className="text-center text-gray-500">Aucune prestation créée</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {prestations.map((prestation: Prestation) => (
            <div
              key={prestation.id}
              className="transform overflow-hidden rounded-lg bg-white shadow-md transition-all hover:scale-105"
            >
              {prestation.bannerImage && (
                <div className="relative h-48 w-full">
                  <Image
                    src={prestation.bannerImage}
                    alt={`Bannière de ${prestation.name}`}
                    layout="fill"
                    objectFit="cover"
                    className="cursor-pointer"
                    onClick={() => handleImageClick(prestation.bannerImage, prestation.otherImage)}
                  />
                </div>
              )}

              <div className="p-4">
                <h3 className="mb-2 text-xl font-semibold">
                  {prestation.name}
                </h3>
                <p className="mb-2 text-gray-600">{prestation.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {prestation.otherImage && (Array.isArray(prestation.otherImage) 
                    ? prestation.otherImage 
                    : prestation.otherImage.split(',').filter(Boolean)
                  ).map((image, index) => (
                    <div key={index} className="relative h-16 w-16">
                      <Image
                        src={image}
                        alt={`Image secondaire ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="cursor-pointer rounded-md"
                        onClick={() => handleImageClick(prestation.bannerImage || '', prestation.otherImage)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
