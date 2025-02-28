"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { PortfolioItem } from "@/types/portfolio";

// Define the context type
interface PortfolioContextType {
  portfolioItems: PortfolioItem[];
  addPortfolioItem: (item: PortfolioItem) => void;
  updatePortfolioItem: (
    id: number,
    updatedItem: Partial<PortfolioItem>,
  ) => void;
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
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      id: 1,
      title: "Moderne",
      description: "Une salle de bain au design contemporain et épuré.",
      mainImage: "/images/20241121_150006.jpg",
      // gallery: [
      //   "/images/20241121_150006.jpg",
      //   "/images/20241121_150012.jpg",
      //   "/images/20241121_150017.jpg",
      //   "/images/20241121_150028.jpg",
      //   "/images/20241121_150043.jpg",
      // ],
      altText: "Salle de bain rénovée par Madeira.€co à Ballancourt",
    },
    {
      id: 2,
      title: "Classique",
      description: "Un style intemporel pour une salle de bain chaleureuse.",
      mainImage: "/images/20231010_140727.jpg",
      // gallery: [
      //   "/images/20231010_140727.jpg",
      //   "/images/20231010_140738.jpg",
      //   "/images/20231010_140754.jpg",
      //   "/images/20231010_140807.jpg",
      //   "/images/20231010_140833.jpg",
      // ],
      altText: "Salle de bain classique rénovée par Madeira.€co à Ballancourt",
    },
    {
      id: 3,
      title: "Minimaliste",
      description: "Un espace fonctionnel avec des lignes épurées.",
      mainImage: "/images/20231204_143732.jpg",
      // gallery: [
      //   "/images/20231204_143732.jpg",
      //   "/images/20231204_143745.jpg",
      //   "/images/20231204_143759.jpg",
      // ],
      altText:
        "Salle de bain minimaliste rénovée par Madeira.€co à Ballancourt",
    },
  ]);

  const addPortfolioItem = async (item: PortfolioItem) => {
    const res = await fetch("/api/portfolio", {
      method: "POST",
      body: JSON.stringify(item),
    });

    if (!res.ok) {
      console.error("Failed to add portfolio item");
      console.error(res);
      return null;
    }

    const data = await res.json();
    console.log("data", data);
    const typedItem = data as PortfolioItem;
    console.log(typedItem);
    setPortfolioItems((prevItems) => [...prevItems, typedItem]);
  };

  const updatePortfolioItem = async (
    id: number,
    updatedItem: Partial<PortfolioItem>,
  ) => {
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });

      if (!res.ok) {
        console.error("Failed to update portfolio item");
        return;
      }

      const updatedData = await res.json();
      setPortfolioItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? updatedData : item
        ),
      );
    } catch (error) {
      console.error("Error updating portfolio item:", error);
    }
  };

  const deletePortfolioItem = async (id: number) => {
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
  };

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      setPortfolioItems(data);
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
