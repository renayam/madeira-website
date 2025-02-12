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
    <div className="container mx-auto bg-primary px-4 py-8">
      <h2 className="mb-6 text-center text-3xl font-bold text-white">
        Notre Processus de Travail
      </h2>

      <div className="relative py-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`mb-8 flex flex-col items-center md:flex-row ${
              index % 2 === 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="w-full p-4 md:w-1/3">
              <Image
                src={step.image}
                alt={`Illustration de ${step.title}`}
                width={200}
                height={200}
                className="aspect-square rounded-lg object-cover shadow-md"
              />
            </div>

            <div
              className={`w-full rounded-lg bg-white p-6 shadow-md md:w-1/2 ${
                index % 2 === 0 ? "text-right md:mr-4" : "text-left md:ml-4"
              }`}
            >
              <h3 className="mb-4 text-xl font-semibold text-primary">
                {step.title}
              </h3>
              {step.description.map((desc, descIndex) => (
                <p key={descIndex} className="mb-2 text-gray-700">
                  {desc}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
