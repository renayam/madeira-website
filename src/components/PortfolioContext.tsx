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

/**
 * Context for managing portfolio items throughout the application
 */
const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined,
);

/**
 * Provider component for portfolio management functionality
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  /**
   * Adds a new portfolio item
   * @param {FormData} formData - Form data containing portfolio item details
   * @returns {Promise<PortfolioItem | null>} Created portfolio item or null if failed
   */
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

  /**
   * Updates an existing portfolio item
   * @param {number} id - ID of the portfolio item to update
   * @param {FormData} formData - Form data containing updated details
   * @returns {Promise<PortfolioItem | null>} Updated portfolio item or null if failed
   */
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

  /**
   * Deletes a portfolio item
   * @param {number} id - ID of the portfolio item to delete
   */
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

/**
 * Custom hook to access the portfolio context
 * @returns {PortfolioContextType} Portfolio context value
 * @throws {Error} If used outside of PortfolioProvider
 */
export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
