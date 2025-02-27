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
  addPrestation: (prestation: Prestation) => Promise<Prestation | null>;
  removePrestation: (id: number) => Promise<boolean>;
  updatePrestation: (prestation: Prestation) => Promise<Prestation | null>;
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

  const addPrestation = async (prestation: Prestation) => {
    try {
      const response = await fetch("/api/prestation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prestation),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newPrestation = await response.json();
      setPrestations((prevPrestations) => [
        ...prevPrestations,
        newPrestation.prestation,
      ]);
      return newPrestation.prestation;
    } catch (error) {
      console.error("Error adding prestation:", error);
      return null;
    }
  };

  const removePrestation = async (id: number) => {
    try {
      const response = await fetch(`/api/prestation/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setPrestations((prevPrestations) =>
        prevPrestations.filter((prestation) => prestation.id !== id),
      );
      return true;
    } catch (error) {
      console.error("Error removing prestation:", error);
      return false;
    }
  };

  const updatePrestation = async (updatedPrestation: Prestation) => {
    try {
      // Validate that the prestation has an ID
      if (!updatedPrestation.id) {
        throw new Error("Prestation must have an ID to update");
      }

      const response = await fetch(`/api/prestation/${updatedPrestation.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPrestation),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const serverUpdatedPrestation = result.prestation;

      // Update the prestations state with the server-confirmed prestation
      setPrestations((prevPrestations) =>
        prevPrestations.map((prestation) =>
          prestation.id === updatedPrestation.id
            ? serverUpdatedPrestation
            : prestation,
        ),
      );

      return serverUpdatedPrestation;
    } catch (error) {
      console.error("Error updating prestation:", error);
      return null;
    }
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
