"use client";
import React from "react";
import Image from "next/image";
import useImageExpand from "@/hook/useImageExpand";
import { useServiceContext } from "@/components/ServiceContext";

const ServiceList: React.FC = () => {
  const { services } = useServiceContext(); // Fetch services from context
  const { expandedImage, openImage, closeImage } = useImageExpand();

  return (
    <div className="flex flex-col items-center justify-center bg-primary p-4">
      <p className="mb-6 text-center text-lg text-white">
        Découvrez nos réalisations sur mesure pour transformer vos salles de
        bains en espaces uniques.
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="portfolio-item rounded-lg bg-white shadow-md"
          >
            <Image
              src={service.bannerImage as string} // Assuming bannerImage is the main image
              alt={"Image de service"} // Provide a fallback alt text
              width={600} // Adjust width as needed
              height={400} // Adjust height as needed
              className="cursor-pointer rounded-t-lg"
              onClick={() => openImage(service.bannerImage as string)} // Open main image in modal
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{service.name}</h3>
              <p className="text-gray-700">{service.description}</p>
              {/* Gallery Section */}
              {service.otherImage && service.otherImage.length > 0 && (
                <div className="gallery mt-2 flex flex-wrap gap-2">
                  {service.otherImage.map((galleryImage, idx) => (
                    <div
                      key={idx}
                      className="relative h-24 w-24 cursor-pointer"
                      onClick={() => openImage(galleryImage)} // Open gallery image in modal
                    >
                      <Image
                        src={galleryImage}
                        alt={`${service.name} image ${idx + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Expanded Image Modal */}
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
