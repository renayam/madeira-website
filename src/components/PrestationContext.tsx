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
  isLoading: boolean;
  AddPrestation: (formData: FormData) => Promise<Prestation | null>;
  removePrestation: (id: number) => Promise<boolean>;
  updatePrestation: (formData: FormData) => Promise<Prestation | null>;
  removeOtherImage: (id: number) => Promise<boolean>;
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
  const [isLoading, setIsLoading] = useState(true);

  const AddPrestation = async (formData: FormData): Promise<Prestation | null> => {
    try {
      const response = await fetch("/api/prestation", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add prestation");
      }

      const newPrestation = await response.json();
      setPrestations((prev) => [...prev, newPrestation]);
      return newPrestation;
    } catch (error) {
      console.error("Error adding prestation:", error);
      return null;
    }
  };

  const removePrestation = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/prestation/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setPrestations((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (error) {
      console.error("Error removing prestation:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePrestation = async (formData: FormData): Promise<Prestation | null> => {
    const id = formData.get("id");
    try {
      const response = await fetch(`/api/prestation/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update prestation");
      }

      const { prestation } = await response.json();
      setPrestations((prev) => prev.map((p) => 
        p.id === prestation.id ? prestation : p
      ));
      return prestation;
    } catch (error) {
      console.error("Error updating prestation:", error);
      return null;
    }
  };

  const removeOtherImage = async (id: number) => {
    try {
      const response = await fetch(`/api/prestation/${id}/other-image`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error removing other image:", error);
      return false;
    }
  };

  useEffect(() => {
    const fetchPrestations = async () => {
      const controller = new AbortController();
      
      try {
        setIsLoading(true);
        const response = await fetch("/api/prestation", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Prestation[] = await response.json();
        setPrestations(data);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error fetching prestations:", error.message);
        }
      } finally {
        setIsLoading(false);
      }

      return () => controller.abort();
    };

    fetchPrestations();
  }, []); // Removed isLoading dependency to prevent infinite loop

  const contextValue = {
    prestations,
    isLoading,
    AddPrestation,
    removePrestation,
    updatePrestation,
    removeOtherImage,
  };

  return (
    <PrestationContext.Provider value={contextValue}>
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
