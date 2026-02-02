"use client";
import React from "react";
import { motion } from "framer-motion";

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
    <div className="container mx-auto max-w-7xl bg-primary px-4 py-12 sm:px-6">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
      >
        Notre Processus de Travail
      </motion.h1>

      <div className="relative py-4 sm:py-8">
        {/* Progress Line */}
        <div className="absolute bottom-0 left-1/2 top-0 hidden w-0.5 bg-white/20 md:block" />

        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="mb-16 last:mb-0"
          >
            <div className="relative mb-6 flex items-center">
              {/* Progress Number - Now centered and above the content */}
              <div className="absolute left-1/2 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-white font-bold text-primary shadow-lg md:flex">
                {index + 1}
              </div>
            </div>

            <div
              className={`flex flex-col gap-8 md:gap-12 ${
                index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div className="flex w-full items-center justify-center md:w-1/3">
                <motion.div
                  className="relative aspect-square w-full max-w-[320px]"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={step.image}
                    alt={`Illustration de ${step.title}`}
                    className="aspect-square w-full max-w-[320px] rounded-xl object-cover shadow-lg"
                  />
                </motion.div>
              </div>

              <div
                className={`w-full rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl sm:p-8 md:w-1/2 ${
                  index % 2 === 0 ? "md:text-right" : "text-left"
                }`}
              >
                <h2 className="mb-4 text-xl font-bold text-primary sm:mb-6 sm:text-2xl">
                  {step.title}
                </h2>
                <div className="space-y-3">
                  {step.description.map((desc, descIndex) => (
                    <p
                      key={descIndex}
                      className="text-base leading-relaxed text-gray-700 sm:text-lg"
                    >
                      {desc}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
