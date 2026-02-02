"use client";

import { Prestation } from "@/types/prestation";
import * as Sentry from "@sentry/nextjs";
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
  removeOtherImage: (id: number, imageUrl: string) => Promise<boolean>;
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

  const AddPrestation = async (
    formData: FormData,
  ): Promise<Prestation | null> => {
    return Sentry.startSpan(
      {
        name: "prestation.context.AddPrestation",
        op: "http.request",
        attributes: {
          "http.method": "POST",
          "http.url": "/api/prestation",
        },
      },
      async (span) => {
        try {
          const bannerImage = formData.get("bannerImage");
          const otherImages = formData.getAll("otherImage");

          span.addEvent("api.request.started", {
            has_banner: bannerImage instanceof File,
            other_image_count: otherImages.filter(
              (f): f is File => f instanceof File,
            ).length,
          });

          const response = await fetch("/api/prestation", {
            method: "POST",
            body: formData,
          });

          span.addEvent("api.response.received", {
            status: response.status,
            status_text: response.statusText,
          });

          if (!response.ok) {
            span.setStatus({ code: 2, message: "HTTP error" });
            span.addEvent("api.response.error", {
              status: response.status,
            });
            Sentry.captureMessage("Failed to add prestation", {
              level: "error",
              extra: { status: response.status },
            });
            return null;
          }

          const newPrestation = await response.json();

          span.addEvent("api.response.success", {
            prestation_id: newPrestation.id,
            has_banner: !!newPrestation.bannerImage,
            name: newPrestation.name,
            otherImage: JSON.stringify(newPrestation.otherImage)?.substring(
              0,
              100,
            ),
          });

          span.setStatus({ code: 1 });
          span.addEvent("state.update.started", {
            previous_count: prestations.length,
          });

          setPrestations((prev) => {
            const newState = [...prev, newPrestation];
            span.addEvent("state.update.completed", {
              new_count: newState.length,
              all_ids: newState.map((p) => p.id),
            });
            return newState;
          });
          return newPrestation;
        } catch (error) {
          span.setStatus({
            code: 2,
            message: error instanceof Error ? error.message : "Unknown error",
          });
          span.addEvent("api.request.error", {
            error_message:
              error instanceof Error ? error.message : String(error),
          });
          Sentry.captureException(error, {
            tags: { operation: "AddPrestation" },
          });
          console.error("Error adding prestation:", error);
          return null;
        }
      },
    );
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

  const updatePrestation = async (
    formData: FormData,
  ): Promise<Prestation | null> => {
    const id = formData.get("id");

    return Sentry.startSpan(
      {
        name: "prestation.context.updatePrestation",
        op: "http.request",
        attributes: {
          "http.method": "PUT",
          "http.url": `/api/prestation/${id}`,
          "prestation.id": id as string | number | undefined,
        },
      },
      async (span) => {
        try {
          const bannerImage = formData.get("bannerImage");
          const otherImages = formData.getAll("otherImage");

          span.addEvent("api.request.started", {
            has_banner: bannerImage instanceof File,
            other_image_count: otherImages.filter(
              (f): f is File => f instanceof File,
            ).length,
          });

          const response = await fetch(`/api/prestation/${id}`, {
            method: "PUT",
            body: formData,
          });

          span.addEvent("api.response.received", {
            status: response.status,
            status_text: response.statusText,
          });

          if (!response.ok) {
            span.setStatus({ code: 2, message: "HTTP error" });
            span.addEvent("api.response.error", {
              status: response.status,
            });
            Sentry.captureMessage("Failed to update prestation", {
              level: "error",
              extra: { status: response.status },
            });
            return null;
          }

          const { prestation } = await response.json();

          span.addEvent("api.response.success", {
            prestation_id: prestation.id,
            has_banner: !!prestation.bannerImage,
          });

          span.setStatus({ code: 1 }); // OK
          setPrestations((prev) =>
            prev.map((p) => (p.id === prestation.id ? prestation : p)),
          );
          return prestation;
        } catch (error) {
          span.setStatus({
            code: 2,
            message: error instanceof Error ? error.message : "Unknown error",
          });
          span.addEvent("api.request.error", {
            error_message:
              error instanceof Error ? error.message : String(error),
          });
          Sentry.captureException(error, {
            tags: { operation: "updatePrestation" },
          });
          console.error("Error updating prestation:", error);
          return null;
        }
      },
    );
  };

  const removeOtherImage = async (id: number, imageUrl: string) => {
    try {
      const response = await fetch(
        `/api/prestation/${id}/other-image?imageUrl=${encodeURIComponent(imageUrl)}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { updatedImages } = await response.json();

      // Update the local state with the new images
      setPrestations((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, otherImage: updatedImages } : p,
        ),
      );

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

        await Sentry.startSpan(
          {
            name: "prestation.context.fetchPrestations",
            op: "http.request",
            attributes: {
              "http.method": "GET",
              "http.url": "/api/prestation",
            },
          },
          async (span) => {
            try {
              span.addEvent("fetch.started", {
                current_isLoading: true,
              });

              const response = await fetch("/api/prestation", {
                signal: controller.signal,
              });

              span.addEvent("api.response.received", {
                status: response.status,
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const data: Prestation[] = await response.json();
              span.addEvent("api.data.parsed", {
                items_count: data.length,
                first_item_id: data[0]?.id,
                all_ids: data.map((d) => d.id),
              });

              setPrestations(data);
              span.addEvent("state.updated", {
                count: data.length,
              });
            } catch (error) {
              if (error instanceof Error && error.name !== "AbortError") {
                console.error("Error fetching prestations:", error.message);
                span.addEvent("fetch.error", {
                  error: error.message,
                });
              }
            }
          },
        );
      } finally {
        setIsLoading(false);
      }

      return () => controller.abort();
    };

    fetchPrestations();
  }, []);

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
