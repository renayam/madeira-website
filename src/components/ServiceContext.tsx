"use client";
import React, { createContext, useContext, useState } from "react";

export interface Service {
  id: number;
  name: string;
  bannerImage: string | null; // Single banner image
  otherImage: string[]; // Array of other images
  description: string;
}

const ServiceContext = createContext<
  | {
      services: Service[];
      addService: (service: Service) => void;
      deleteService: (id: number) => void; // Add deleteService to context
    }
  | undefined
>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [services, setServices] = useState<Service[]>([]);

  const addService = (service: Service) => {
    setServices((prevServices) => [...prevServices, service]);
  };

  const deleteService = (id: number) => {
    setServices((prevServices) =>
      prevServices.filter((service) => service.id !== id),
    );
  };

  return (
    <ServiceContext.Provider value={{ services, addService, deleteService }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServiceContext = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServiceContext must be used within a ServiceProvider");
  }
  return context;
};
