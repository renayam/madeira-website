"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import { usePrestationContext } from "../../../../components/PrestationContext";
import { Prestation, PrestationFormState } from "@/types/prestation";
import DragDropImageUpload from "@/components/DragDropImageUpload";
import * as Sentry from "@sentry/nextjs";

export default function PrestationCreateScreen() {
  const [pr, setPr] = useState<PrestationFormState>({
    name: "",
    bannerImage: "",
    otherImage: [],
    description: "",
    bannerImageFile: null,
    otherImageFiles: [],
    deletedImages: [],
  });

  // State for tracking which prestation is being edited
  const [editingPrestation, setEditingPrestation] = useState<Prestation | null>(
    null,
  );

  const { AddPrestation, updatePrestation, removeOtherImage } =
    usePrestationContext();

  const handleBannerImageUpload = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    Sentry.startSpan(
      {
        name: "prestation.create.uploadBanner",
        op: "file.upload",
        attributes: {
          "file.type": "banner",
          "file.name": file.name,
          "file.size": file.size,
          "file.type_mime": file.type,
        },
      },
      async (span) => {
        try {
          span.addEvent("upload.started", {
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
          });

          setPr({
            ...pr,
            bannerImageFile: file,
          });

          span.addEvent("upload.queued", {
            file_name: file.name,
            state: "waiting_for_form_submit",
          });
        } catch (error) {
          span.setStatus({
            code: 2,
            message: error instanceof Error ? error.message : "Unknown error",
          });
          span.addEvent("upload.failed", {
            file_name: file.name,
            error_message:
              error instanceof Error ? error.message : String(error),
          });
          Sentry.captureException(error, {
            tags: { operation: "banner_upload" },
          });
          console.error("Error uploading banner image:", error);
          alert("Erreur lors du téléchargement de l'image de bannière");
        }
      },
    );
  };

  const handleOtherImagesUpload = (files: File[]) => {
    if (files.length === 0) return;

    Sentry.startSpan(
      {
        name: "prestation.create.uploadOtherImages",
        op: "file.upload",
        attributes: {
          "file.type": "gallery",
          "file.count": files.length,
          "file.total_size": files.reduce((sum, f) => sum + f.size, 0),
        },
      },
      async (span) => {
        try {
          span.addEvent("upload.started", {
            file_count: files.length,
            file_names: files.map((f) => f.name).join(", "),
          });

          const otherImageUrls = files.map((file) => URL.createObjectURL(file));

          if (editingPrestation) {
            const existingUrls = Array.isArray(pr.otherImage)
              ? pr.otherImage
              : [];
            const existingFiles = pr.otherImageFiles || [];
            setPr({
              ...pr,
              otherImage: [...existingUrls, ...otherImageUrls],
              otherImageFiles: [...existingFiles, ...files],
            });
          } else {
            setPr({
              ...pr,
              otherImage: otherImageUrls,
              otherImageFiles: files,
            });
          }

          span.addEvent("upload.queued", {
            file_count: files.length,
            editing_mode: !!editingPrestation,
          });
        } catch (error) {
          span.setStatus({
            code: 2,
            message: error instanceof Error ? error.message : "Unknown error",
          });
          span.addEvent("upload.failed", {
            file_count: files.length,
            error_message:
              error instanceof Error ? error.message : String(error),
          });
          Sentry.captureException(error, {
            tags: { operation: "other_images_upload" },
          });
          console.error("Error uploading other images:", error);
          alert("Erreur lors du téléchargement des images");
        }
      },
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await Sentry.startSpan(
      {
        name: "prestation.create.submit",
        op: "http.request",
        attributes: {
          "http.method": "POST",
          "http.url": "/api/prestation",
          "form.has_banner": !!pr.bannerImageFile,
          "form.other_image_count": pr.otherImageFiles?.length || 0,
        },
      },
      async (span) => {
        try {
          if (!pr.name || !pr.description) {
            span.addEvent("validation.failed", {
              has_name: !!pr.name,
              has_description: !!pr.description,
            });
            alert("Veuillez remplir tous les champs correctement.");
            return;
          }

          span.addEvent("validation.passed", {
            has_name: !!pr.name,
            has_description: !!pr.description,
            has_banner: !!pr.bannerImageFile,
          });

          const formData = new FormData();
          formData.append("name", pr.name);
          formData.append("description", pr.description);

          if (pr.bannerImageFile instanceof File) {
            span.addEvent("api.request.banner_attached", {
              file_name: pr.bannerImageFile.name,
              file_size: pr.bannerImageFile.size,
            });
            formData.append("bannerImage", pr.bannerImageFile);
          }

          if (pr.otherImageFiles && Array.isArray(pr.otherImageFiles)) {
            span.addEvent("api.request.other_images_attached", {
              count: pr.otherImageFiles.length,
            });
            pr.otherImageFiles.forEach((file) => {
              formData.append("otherImage", file);
            });
          }

          span.addEvent("api.request.sending", {
            url: "/api/prestation",
            method: "POST",
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
            const errorData = await response.json().catch(() => ({}));
            span.setStatus({
              code: 2,
              message: errorData.error || "HTTP error",
            });
            span.addEvent("api.response.error", {
              status: response.status,
              error: errorData.error,
            });
            Sentry.captureMessage("Prestation creation failed", {
              level: "error",
              extra: { status: response.status, error: errorData },
            });
            return;
          }

          const newPrestation = await response.json();

          span.addEvent("creation.succeeded", {
            prestation_id: newPrestation.id,
            has_banner: !!newPrestation.bannerImage,
          });

          span.setStatus({ code: 1 });

          if (editingPrestation && editingPrestation.id) {
            formData.append("id", editingPrestation.id.toString());
            const updatedPrestation = await updatePrestation(formData);

            if (updatedPrestation) {
              if (pr.deletedImages && pr.deletedImages.length > 0) {
                for (const imageUrl of pr.deletedImages) {
                  await removeOtherImage(editingPrestation.id, imageUrl);
                }
              }

              setEditingPrestation(null);
              setPr({
                name: "",
                bannerImage: "",
                otherImage: [],
                description: "",
                bannerImageFile: null,
                otherImageFiles: [],
                deletedImages: [],
              });
            }
          } else {
            const createdPrestation = await AddPrestation(formData);

            if (createdPrestation) {
              setPr({
                name: "",
                bannerImage: "",
                otherImage: [],
                description: "",
                bannerImageFile: null,
                otherImageFiles: [],
                deletedImages: [],
              });
            }
          }
        } catch (error) {
          span.setStatus({
            code: 2,
            message: error instanceof Error ? error.message : "Unknown error",
          });
          span.addEvent("submission.error", {
            error_message:
              error instanceof Error ? error.message : String(error),
          });
          Sentry.captureException(error, {
            tags: { operation: "prestation_submit" },
          });
          console.error("Error creating prestation:", error);
          alert("Erreur lors de la création de la prestation");
        }
      },
    );
  };

  // Function to start editing a prestation
  const startEditing = (prestation: Prestation) => {
    setEditingPrestation(prestation);
    setPr({
      name: prestation.name,
      bannerImage: prestation.bannerImage || "",
      otherImage: Array.isArray(prestation.otherImage)
        ? prestation.otherImage
        : [],
      description: prestation.description,
      bannerImageFile: null,
      otherImageFiles: [],
      deletedImages: [],
    });
  };

  // Function to cancel editing
  const cancelEditing = () => {
    setEditingPrestation(null);
    setPr({
      name: "",
      bannerImage: "",
      otherImage: [],
      description: "",
      bannerImageFile: null,
      otherImageFiles: [],
      deletedImages: [],
    });
  };

  const handleRemoveOtherImage = async (index: number, imageUrl: string) => {
    if (editingPrestation?.id) {
      // Instead of deleting immediately, add to deletedImages array
      setPr((prev) => ({
        ...prev,
        otherImage: prev.otherImage.filter((_, i) => i !== index),
        otherImageFiles:
          prev.otherImageFiles?.filter((_, i) => i !== index) || null,
        deletedImages: [...(prev.deletedImages || []), imageUrl],
      }));
    } else {
      // For new prestations, just update local state
      setPr((prev) => ({
        ...prev,
        otherImage: prev.otherImage.filter((_, i) => i !== index),
        otherImageFiles:
          prev.otherImageFiles?.filter((_, i) => i !== index) || null,
      }));
    }
  };

  return (
    <div className="flex min-h-screen bg-primary">
      <div className="w-2/3 p-6">
        <div className="mx-auto max-w-lg rounded-lg bg-gray-950 p-6 shadow-md">
          <h1 className="mb-4 text-2xl font-bold text-white">
            {editingPrestation
              ? "Modifier une Realisation"
              : "Créer une Realisation"}
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Nom de la Realisation :
                <input
                  type="text"
                  value={pr.name}
                  onChange={(e) => setPr({ ...pr, name: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-800 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>

            <DragDropImageUpload
              label="Image de Bannière :"
              onImageUpload={handleBannerImageUpload}
              images={pr.bannerImage ? [pr.bannerImage] : []}
              onRemoveImage={() =>
                setPr((prev) => ({
                  ...prev,
                  bannerImage: "",
                  bannerImageFile: null,
                }))
              }
              multiple={false}
            />

            <DragDropImageUpload
              label="Autres Images :"
              onImageUpload={handleOtherImagesUpload}
              images={pr.otherImage}
              onRemoveImage={handleRemoveOtherImage}
              multiple={true}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Description :
                <textarea
                  value={pr.description}
                  onChange={(e) =>
                    setPr({ ...pr, description: e.target.value })
                  }
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-800 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="mt-4 w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {editingPrestation ? "Mettre à jour" : "Créer une Realisation"}
              </button>

              {editingPrestation && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="mt-4 w-full rounded-md bg-gray-600 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="w-1/3 bg-gray-900 p-6">
        <h2 className="mb-4 text-xl font-bold text-white">
          Liste des Realisations
        </h2>
        <PrestationList startEditing={startEditing} />
      </div>
    </div>
  );
}

function PrestationList({
  startEditing,
}: {
  startEditing: (prestation: Prestation) => void;
}) {
  const { prestations, removePrestation, isLoading } = usePrestationContext();

  useEffect(() => {
    console.log("update the data");
  }, [prestations, isLoading]);

  if (isLoading) {
    return <p className="text-gray-400">Chargement des prestations...</p>;
  }

  if (prestations.length === 0 || !prestations) {
    return <p className="text-gray-400">Aucune realisation créée</p>;
  }

  return (
    <>
      {prestations.length === 0 ? (
        <p className="text-gray-400">Aucune realisation créée</p>
      ) : (
        <>
          {prestations.map((prestation) => {
            if (!prestation?.id) {
              console.warn("Prestation missing ID:", prestation);
              return null;
            }
            return (
              <div
                key={prestation.id}
                className="flex items-center justify-between space-y-4 rounded-lg bg-gray-800 p-4"
              >
                <div className="flex items-center space-x-4">
                  {prestation?.bannerImage &&
                    (prestation.bannerImage.startsWith("http") ? (
                      <Image
                        src={prestation.bannerImage}
                        alt={prestation.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <img
                        src={prestation.bannerImage}
                        alt={prestation.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    ))}
                  <div>
                    <h3 className="font-semibold text-white">
                      {prestation.name}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEditing(prestation)}
                    className="text-blue-500 transition hover:text-blue-700"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => removePrestation(prestation.id as number)}
                    className="text-red-500 transition hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </>
      )}
    </>
  );
}
