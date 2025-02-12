"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the Prestation type
export type Prestation = {
  id: number;
  name: string;
  bannerImage: string;
  otherImage: string[];
  description: string;
};

// Define the context type
type PrestationContextType = {
  prestations: Prestation[];
  addPrestation: (prestation: Prestation) => void;
  removePrestation: (id: number) => void;
  updatePrestation: (prestation: Prestation) => void;
};

// Create the context
const PrestationContext = createContext<PrestationContextType | undefined>(
  undefined,
);

// Provider component
export const PrestationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [prestations, setPrestations] = useState<Prestation[]>([]);

  const addPrestation = (prestation: Prestation) => {
    setPrestations((prevPrestations) => [...prevPrestations, prestation]);
  };

  const removePrestation = (id: number) => {
    setPrestations((prevPrestations) =>
      prevPrestations.filter((prestation) => prestation.id !== id),
    );
  };

  const updatePrestation = (updatedPrestation: Prestation) => {
    setPrestations((prevPrestations) =>
      prevPrestations.map((prestation) =>
        prestation.id === updatedPrestation.id ? updatedPrestation : prestation,
      ),
    );
  };

  return (
    <PrestationContext.Provider
      value={{
        prestations,
        addPrestation,
        removePrestation,
        updatePrestation,
      }}
    >
      {children}
    </PrestationContext.Provider>
  );
};

// Custom hook to use the Prestation context
export const usePrestationContext = () => {
  const context = useContext(PrestationContext);

  if (context === undefined) {
    throw new Error(
      "usePrestationContext must be used within a PrestationProvider",
    );
  }

  return context;
};
