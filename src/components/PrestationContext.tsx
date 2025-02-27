"use client";

import { Prestation } from "@/types/prestation";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

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
    fetch("/api/prestation", {
      method: "POST",
      body: JSON.stringify(prestation),
    });
    // setPrestations((prevPrestations) => [...prevPrestations, prestation]);
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

  useEffect(() => {
    const controller = new AbortController();

    const fetchPrestations = async () => {
      try {
        const response = await fetch("/api/prestation", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Prestation[] = await response.json();
        setPrestations(data);
      } catch (error) {
        if (error instanceof Error)
          if (error.name !== "AbortError") {
            console.error("Error fetching prestations:", error.message);
            // Optional: Add user-friendly error state
            // setError('Failed to load prestations');
          }
      }
    };

    fetchPrestations();

    // Cleanup function to cancel ongoing fetch if component unmounts
    return () => {
      controller.abort();
    };
  }, []);

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
