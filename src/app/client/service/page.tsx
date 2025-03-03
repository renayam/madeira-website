"use client";
import Image from "next/image";
import React from "react";

const ServiceList: React.FC = () => {
  const steps = [
    {
      title: "Étape 1 : Définir votre projet",
      description: [
        "Définir ensemble votre projet et vos besoins.",
        "Effectuer une visite de vos travaux afin de déterminer la faisabilité de votre projet.",
      ],
      image: "/images/service1.jpg", // Exemple d'image
    },
    {
      title: "Étape 2 : Sélection des produits",
      description: [
        "Nous vous accompagnons sur le choix de vos produits, avec nos partenaires.",
        "Établir une proposition chiffrée (fourniture et pose).",
      ],
      image: "/images/service2.jpg", // Exemple d'image
    },
    {
      title: "Étape 3 : Réalisation des travaux",
      description: [
        "Effectuer les travaux de votre chantier du début à la fin.",
      ],
      image: "/images/service3.jpg", // Exemple d'image
    },
  ];

  return (
    <div className="container mx-auto bg-primary px-4 sm:px-6 py-8 max-w-7xl">
      <h2 className="mb-6 text-center text-2xl sm:text-3xl font-bold text-white">
        Notre Processus de Travail
      </h2>

      <div className="relative py-4 sm:py-8 space-y-8 sm:space-y-12">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col gap-6 sm:gap-8 ${
              index % 2 === 0
                ? "md:flex-row-reverse"
                : "md:flex-row"
            }`}
          >
            <div className="w-full md:w-1/3 flex justify-center items-center">
              <div className="relative w-full max-w-[280px] aspect-square">
                <Image
                  src={step.image}
                  alt={`Illustration de ${step.title}`}
                  fill
                  className="rounded-lg object-cover shadow-md"
                />
              </div>
            </div>

            <div
              className={`w-full md:w-1/2 rounded-lg bg-white p-4 sm:p-6 shadow-md ${
                index % 2 === 0 
                  ? "md:text-right" 
                  : "text-left"
              }`}
            >
              <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-primary">
                {step.title}
              </h3>
              <div className="space-y-2">
                {step.description.map((desc, descIndex) => (
                  <p key={descIndex} className="text-sm sm:text-base text-gray-700">
                    {desc}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
