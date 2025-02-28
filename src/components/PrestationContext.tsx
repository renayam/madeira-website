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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const updatePrestation = async (formData: FormData): Promise<Prestation | null> => {
    try {
      const response = await fetch(`/api/prestation/${formData.get("id")}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update prestation");
      }

      const updatedPrestation = await response.json();
      setPrestations((prev) =>
        prev.map((p) =>
          p.id === updatedPrestation.id ? updatedPrestation : p
        )
      );
      return updatedPrestation;
    } catch (error) {
      console.error("Error updating prestation:", error);
      return null;
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchPrestations = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrestations();

    return () => {
      controller.abort();
    };
  }, [isLoading]);

  return (
    <PrestationContext.Provider
      value={{
        prestations,
        isLoading,
        AddPrestation,
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
