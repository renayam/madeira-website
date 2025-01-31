"use client";

import { Service, useServiceContext } from "@/components/ServiceContext";
import Image from "next/image";
import React, { useState } from "react";
import ServiceList from "@/components/ServiceList";
import useImageExpand from "@/hook/useImageExpand";

const CreateService: React.FC = () => {
  const { addService } = useServiceContext();
  const [serviceName, setServiceName] = useState<string>("");
  const [bannerImage, setBannerImage] = useState<string | null>(null); // Single banner image
  const [otherImages, setOtherImages] = useState<string[]>([]); // Array for multiple other images
  const [description, setDescription] = useState<string>("");

  // Use the custom hook
  const { expandedImage, openImage, closeImage } = useImageExpand();

  const handleBannerImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files[0]) {
      setBannerImage(URL.createObjectURL(event.target.files[0])); // Set single banner image
    }
  };

  const handleOtherImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files).map((file) =>
        URL.createObjectURL(file),
      );
      setOtherImages((prev) => [...prev, ...newImages]); // Append new images to the array
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newService = {
      id: Date.now(), // Simple unique ID based on timestamp
      name: serviceName,
      bannerImage, // Store single banner image
      otherImage: otherImages, // Store array of other images
      description,
    } as Service;
    addService(newService);
    // Reset form fields
    setServiceName("");
    setBannerImage(null);
    setOtherImages([]);
    setDescription("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary">
      <div className="mx-auto max-w-lg rounded-lg bg-gray-950 p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Créer un Service</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nom du Service :
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Image de Bannière :
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerImageChange}
                required
                className="mt-1 block w-full cursor-pointer rounded-md border border-gray-300 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            {bannerImage && (
              <Image
                src={bannerImage}
                alt="Aperçu de la Bannière"
                width={600} // Set your desired width
                height={400} // Set your desired height
                className="mt-2 h-auto w-full rounded-md shadow-sm"
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Autres Images :
              <input
                type="file"
                accept="image/*"
                onChange={handleOtherImageChange}
                multiple // Allow multiple files
                className="mt-1 block w-full cursor-pointer rounded-md border border-gray-300 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              <h3 className="underline">Autres Images:</h3>
              {otherImages.map((image, index) => (
                <div key={index} className="relative h-24 w-24">
                  <Image
                    src={image}
                    alt={`Aperçu de l'Autre Image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="cursor-pointer rounded-md"
                    onClick={() => openImage(image)} // Use the hook to open the image
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description :
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Créer un Service
          </button>
        </form>
      </div>
      {/* Display the list of services */}
      <ServiceList />

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeImage} // Use the hook to close the image
        >
          <Image
            src={expandedImage}
            alt="Image Agrandie"
            width={800} // Set your desired width for the expanded image
            height={600} // Set your desired height for the expanded image
            className="h-auto max-h-full w-auto max-w-full"
          />
        </div>
      )}
    </div>
  );
};

export default CreateService;
