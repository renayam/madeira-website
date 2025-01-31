"use client";

import { Service, useServiceContext } from "@/components/ServiceContext";
import Image from "next/image";
import React, { useState } from "react";
import ServiceList from "@/components/ServiceList";
import useImageExpand from "@/hook/useImageExpand";

type Data = {
  serviceName: string;
  bannerImage: string | null;
  otherImages: string[];
  description: string;
};

function NewEmptyData() {
  return {
    serviceName: "",
    bannerImage: null,
    otherImages: [], // Explicitly set to an empty array
    description: "",
  };
}

const CreateService: React.FC = () => {
  const { addService } = useServiceContext();
  const [data, setData] = useState<Data>({
    serviceName: "",
    bannerImage: null,
    otherImages: [],
    description: "",
  });

  // Use the custom hook
  const { expandedImage, openImage, closeImage } = useImageExpand();

  const handleBannerImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    const f = files[0];
    setData((prevData) => ({
      ...prevData,
      bannerImage: URL.createObjectURL(f),
    }));
  };

  const handleOtherImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file),
    );
    setData((prevData) => ({
      ...prevData,
      otherImages: [...prevData.otherImages, ...newImages],
    }));
  };

  const handleDeleteImage = (index: number) => {
    setData((prevData) => ({
      ...prevData,
      otherImages: prevData.otherImages.filter((_, i) => i !== index), // Remove the image at the specified index
    }));
  };

  const handleDeleteBannerImage = () => {
    setData((prevData) => ({
      ...prevData,
      bannerImage: null, // Clear the banner image
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if banner image is present
    if (!data.bannerImage) {
      alert("Une image de bannière est requise pour créer un service.");
      return;
    }

    // Check if other images are present
    if (data.otherImages.length === 0) {
      alert("Au moins une autre image est requise pour créer un service.");
      return;
    }

    const newService: Service = {
      id: Date.now(),
      name: data.serviceName,
      bannerImage: data.bannerImage,
      otherImage: data.otherImages,
      description: data.description,
    };
    addService(newService);
    // Reset form fields
    setData(NewEmptyData());
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
                value={data.serviceName}
                onChange={(e) =>
                  setData((prevData) => ({
                    ...prevData,
                    serviceName: e.target.value,
                  }))
                }
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
            {data.bannerImage && (
              <div className="relative mt-2">
                <Image
                  src={data.bannerImage}
                  alt="Aperçu de la Bannière"
                  width={600} // Set your desired width
                  height={400} // Set your desired height
                  className="h-auto w-full rounded-md shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleDeleteBannerImage}
                  className="absolute right-0 top-0 mr-2 mt-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  X
                </button>
              </div>
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
              {data.otherImages.map((image, index) => (
                <div key={index} className="relative h-24 w-24">
                  <Image
                    src={image}
                    alt={`Aperçu de l'Autre Image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="cursor-pointer rounded-md"
                    onClick={() => openImage(image)} // Use the hook to open the image
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)} // Delete the specific image
                    className="absolute right-0 top-0 mr-1 mt-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description :
              <textarea
                value={data.description}
                onChange={(e) =>
                  setData((prevData) => ({
                    ...prevData,
                    description: e.target.value,
                  }))
                }
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
