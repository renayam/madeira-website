"use client";
import React from "react";
import { useServiceContext } from "./ServiceContext";
import Image from "next/image";
import useImageExpand from "@/hook/useImageExpand";

const ServiceList: React.FC = () => {
  const { services, deleteService } = useServiceContext();
  const { expandedImage, openImage, closeImage } = useImageExpand(); // Use the custom hook

  return (
    <div className="flex w-1/2 flex-col justify-center">
      <h2 className="text-center text-xl font-bold">Liste des Services</h2>
      <ul className="h-[70vh] overflow-auto">
        {services.map((service) => (
          <li
            key={service.id}
            className="mb-2 flex w-full flex-col justify-start border-b p-4 shadow-sm"
          >
            <div className="flex justify-start gap-1">
              <h3 className="underline">Nom: </h3>
              <p className="text-center font-semibold">{service.name}</p>
            </div>
            {service.bannerImage && (
              <div
                className="relative m-10 mb-2 h-24 w-24 cursor-pointer"
                onClick={() => openImage(service.bannerImage as string)}
              >
                <Image
                  src={service.bannerImage}
                  alt="Aperçu de la Bannière"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            )}
            <div className="flex justify-start gap-1">
              <h3 className="underline">Description: </h3>
              <p className="text-center">{service.description}</p>
            </div>

            {/* Display other images */}
            {service.otherImage && service.otherImage.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                <h3 className="underline">Autres Images:</h3>
                {service.otherImage.map((image, index) => (
                  <div
                    key={index}
                    className="relative h-24 w-24 cursor-pointer"
                    onClick={() => openImage(image)}
                  >
                    <Image
                      src={image}
                      alt={`Aperçu de l'Autre Image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => deleteService(service.id)} // Call deleteService with the service id
              className="mt-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Supprimer Service
            </button>
          </li>
        ))}
      </ul>

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

export default ServiceList;
