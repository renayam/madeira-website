"use client";
import React from "react";
import { useServiceContext } from "./ServiceContext";
import Image from "next/image";
import useImageExpand from "@/hook/useImageExpand";

const ServiceList: React.FC = () => {
  const { services, deleteService } = useServiceContext();
  const { expandedImage, openImage, closeImage } = useImageExpand();

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      deleteService(id);
    }
  };

  return (
    <div className="flex w-1/2 flex-col justify-center">
      <h2 className="text-center text-xl font-bold">Liste des Services</h2>
      <ul className="h-[70vh] overflow-auto">
        {services.map(({ id, name, description, bannerImage, otherImage }) => (
          <li
            key={id}
            className="mb-2 flex w-full flex-row items-center justify-between border-b p-4 shadow-sm"
          >
            <div className="flex flex-col">
              <div className="flex justify-start gap-1">
                <h3 className="underline">Nom: </h3>
                <p className="text-center font-semibold">{name}</p>
              </div>
              {bannerImage && (
                <div
                  className="relative m-10 mb-2 h-24 w-24 cursor-pointer"
                  onClick={() => openImage(bannerImage)}
                >
                  <Image
                    src={bannerImage}
                    alt="Aperçu de la Bannière"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                    onError={(e) => {
                      e.currentTarget.src = "/path/to/default-image.jpg"; // Default image on error
                    }}
                  />
                </div>
              )}
              <div className="flex justify-start gap-1">
                <h3 className="underline">Description: </h3>
                <p className="text-center">{description}</p>
              </div>

              {otherImage && otherImage.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {otherImage.map((image, index) => (
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
                        onError={(e) => {
                          e.currentTarget.src = "/path/to/default-image.jpg"; // Default image on error
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => handleDelete(id)}
              className="mt-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              aria-label={`Supprimer le service ${name}`}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>

      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeImage}
        >
          <Image
            src={expandedImage}
            alt="Image Agrandie"
            width={800}
            height={600}
            className="h-auto max-h-full w-auto max-w-full"
          />
        </div>
      )}
    </div>
  );
};

export default ServiceList;
