"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the Portfolio Item type
export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  mainImage: string;
  gallery: string[];
  altText: string;
}

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
      gallery: [
        "/images/20241121_150006.jpg",
        "/images/20241121_150012.jpg",
        "/images/20241121_150017.jpg",
        "/images/20241121_150028.jpg",
        "/images/20241121_150043.jpg",
      ],
      altText: "Salle de bain rénovée par Madeira.€co à Ballancourt",
    },
    {
      id: 2,
      title: "Classique",
      description: "Un style intemporel pour une salle de bain chaleureuse.",
      mainImage: "/images/20231010_140727.jpg",
      gallery: [
        "/images/20231010_140727.jpg",
        "/images/20231010_140738.jpg",
        "/images/20231010_140754.jpg",
        "/images/20231010_140807.jpg",
        "/images/20231010_140833.jpg",
      ],
      altText: "Salle de bain classique rénovée par Madeira.€co à Ballancourt",
    },
    {
      id: 3,
      title: "Minimaliste",
      description: "Un espace fonctionnel avec des lignes épurées.",
      mainImage: "/images/20231204_143732.jpg",
      gallery: [
        "/images/20231204_143732.jpg",
        "/images/20231204_143745.jpg",
        "/images/20231204_143759.jpg",
      ],
      altText:
        "Salle de bain minimaliste rénovée par Madeira.€co à Ballancourt",
    },
  ]);

  const addPortfolioItem = (item: PortfolioItem) => {
    setPortfolioItems((prevItems) => [...prevItems, item]);
  };

  const updatePortfolioItem = (
    id: number,
    updatedItem: Partial<PortfolioItem>,
  ) => {
    setPortfolioItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item,
      ),
    );
  };

  const deletePortfolioItem = (id: number) => {
    setPortfolioItems((prevItems) =>
      prevItems.filter((item) => item.id !== id),
    );
  };

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
