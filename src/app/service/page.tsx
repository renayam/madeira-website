import React from "react";
import { ServiceProvider } from "@/components/ServiceContext"; // Adjust the import path as necessary
import ServiceList from "@/components/ServiceList"; // Adjust the import path as necessary

export default function Service() {
  return (
    <ServiceProvider>
      <div className="flex flex-col items-center justify-center bg-primary p-6">
        <ServiceList />
      </div>
    </ServiceProvider>
  );
}
