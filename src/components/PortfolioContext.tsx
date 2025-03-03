"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { PortfolioItem } from "@/types/portfolio";

// Define the context type
interface PortfolioContextType {
  portfolioItems: PortfolioItem[];
  addPortfolioItem: (formData: FormData) => Promise<PortfolioItem | null>;
  updatePortfolioItem: (id: number, formData: FormData) => Promise<PortfolioItem | null>;
  deletePortfolioItem: (id: number) => void;
}

// Create the context
const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined,
);

// Provider component
export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  const addPortfolioItem = async (formData: FormData): Promise<PortfolioItem | null> => {
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("Failed to add portfolio item");
        return null;
      }

      const data = await res.json();
      const newItem = data as PortfolioItem;
      setPortfolioItems((prevItems) => [...prevItems, newItem]);
      return newItem;
    } catch (error) {
      console.error("Error adding portfolio item:", error);
      return null;
    }
  };

  const updatePortfolioItem = async (
    id: number,
    formData: FormData,
  ): Promise<PortfolioItem | null> => {
    try {
      formData.append("id", id.toString());
      const res = await fetch(`/api/portfolio/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        console.error("Failed to update portfolio item");
        return null;
      }

      const updatedData = await res.json();
      setPortfolioItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? updatedData : item)),
      );
      return updatedData;
    } catch (error) {
      console.error("Error updating portfolio item:", error);
      return null;
    }
  };

  const deletePortfolioItem = async (id: number) => {
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        console.error("Failed to delete portfolio item");
        return;
      }
      setPortfolioItems((prevItems) =>
        prevItems.filter((item) => item.id !== id),
      );
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
    }
  };

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setPortfolioItems(data);
      } catch (error) {
        console.error("Error fetching portfolio items:", error);
      }
    };

    fetchPortfolioItems();
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        portfolioItems,
        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

// Custom hook to use the Portfolio context
export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
