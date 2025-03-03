"use client";
import Image from "next/image";
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
    <div className="container mx-auto bg-primary px-4 sm:px-6 py-12 max-w-7xl">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center text-3xl sm:text-4xl font-bold text-white tracking-tight"
      >
        Notre Processus de Travail
      </motion.h1>

      <div className="relative py-4 sm:py-8">
        {/* Progress Line */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20" />

        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="mb-16 last:mb-0"
          >
            <div className="relative flex items-center mb-6">
              {/* Progress Number - Now centered and above the content */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center w-12 h-12 rounded-full bg-white text-primary font-bold shadow-lg">
                {index + 1}
              </div>
            </div>

            <div
              className={`flex flex-col gap-8 md:gap-12 ${
                index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div className="w-full md:w-1/3 flex justify-center items-center">
                <motion.div 
                  className="relative w-full max-w-[320px] aspect-square"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={step.image}
                    alt={`Illustration de ${step.title}`}
                    fill
                    className="rounded-xl object-cover shadow-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </motion.div>
              </div>

              <div
                className={`w-full md:w-1/2 rounded-xl bg-white p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow ${
                  index % 2 === 0 ? "md:text-right" : "text-left"
                }`}
              >
                <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-primary">
                  {step.title}
                </h2>
                <div className="space-y-3">
                  {step.description.map((desc, descIndex) => (
                    <p 
                      key={descIndex} 
                      className="text-base sm:text-lg text-gray-700 leading-relaxed"
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
