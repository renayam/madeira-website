"use client";
import React, { useEffect } from "react";
import { useState, ChangeEvent } from "react";
import Image from "next/image";
import { usePrestationContext } from "../../../../components/PrestationContext";
import { Prestation, PrestationCreate } from "@/types/prestation";

export default function PrestationCreateScreen() {
  const [pr, setPr] = useState<PrestationCreate>({
    name: "",
    bannerImage: "",
    otherImage: [],
    description: "",
    deletedImages: [],
  });

  // State for tracking which prestation is being edited
  const [editingPrestation, setEditingPrestation] = useState<Prestation | null>(
    null,
  );

  const { AddPrestation, updatePrestation, removeOtherImage } =
    usePrestationContext();

  const handleBannerImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setPr({
          ...pr,
          bannerImage: URL.createObjectURL(file),
          bannerImageFile: file
        });
      } catch (error) {
        console.error("Error uploading banner image:", error);
        alert("Erreur lors du téléchargement de l'image de bannière");
      }
    }
  };

  const handleOtherImagesUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const otherImages = files.filter(file => file.type.startsWith('image/'));
    const otherImageUrls = otherImages.map(file => URL.createObjectURL(file));

    if (otherImages.length > 0) {
      try {
        // If we're editing, append new images to existing ones
        if (editingPrestation) {
          const existingUrls = Array.isArray(pr.otherImage) ? pr.otherImage : [];
          const existingFiles = pr.otherImageFile || [];
          setPr({
            ...pr,
            otherImage: [...existingUrls, ...otherImageUrls],
            otherImageFile: [...existingFiles, ...otherImages]
          });
        } else {
          // For new prestations, just set the new images
          setPr({
            ...pr,
            otherImage: otherImageUrls,
            otherImageFile: otherImages
          });
        }
      } catch (error) {
        console.error("Error uploading other images:", error);
        alert("Erreur lors du téléchargement des images");
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!pr.name || !pr.description) {
      alert("Veuillez remplir tous les champs correctement.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", pr.name);
      formData.append("description", pr.description);

      // Only append files if they exist
      if (pr.bannerImageFile instanceof File) {
        console.log("Appending banner image:", pr.bannerImageFile.name);
        formData.append("bannerImage", pr.bannerImageFile);
      }

      // Handle multiple other images
      if (pr.otherImageFile && Array.isArray(pr.otherImageFile)) {
        console.log("Appending other images:", pr.otherImageFile.map(f => f.name));
        pr.otherImageFile.forEach(file => {
          formData.append("otherImage", file);
        });
      }

      if (editingPrestation && editingPrestation.id) {
        formData.append("id", editingPrestation.id.toString());
        console.log("Updating prestation...");
        const updatedPrestation = await updatePrestation(formData);

        if (updatedPrestation) {
          // After successful update, delete the marked images
          if (pr.deletedImages && pr.deletedImages.length > 0) {
            for (const imageUrl of pr.deletedImages) {
              await removeOtherImage(editingPrestation.id, imageUrl);
            }
          }

          console.log("Prestation updated successfully:", updatedPrestation);
          setEditingPrestation(null);
          setPr({
            name: "",
            bannerImage: "",
            otherImage: [],
            description: "",
            bannerImageFile: null,
            otherImageFile: null,
            deletedImages: [],
          });
        }
      } else {
        console.log("Creating new prestation...");
        const newPrestation = await AddPrestation(formData);

        if (newPrestation) {
          console.log("Prestation created successfully:", newPrestation);
          setPr({
            name: "",
            bannerImage: "",
            otherImage: [],
            description: "",
            bannerImageFile: null,
            otherImageFile: null,
            deletedImages: [],
          });
        }
      }
    } catch (error) {
      console.error("Error submitting prestation:", error);
      alert("Erreur lors de la soumission de la prestation");
    }
  };

  // Function to start editing a prestation
  const startEditing = (prestation: Prestation) => {
    setEditingPrestation(prestation);
    setPr({
      name: prestation.name,
      bannerImage: prestation.bannerImage || "",
      otherImage: Array.isArray(prestation.otherImage) ? prestation.otherImage : [],
      description: prestation.description,
      bannerImageFile: null,
      otherImageFile: null,
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
      deletedImages: [],
    });
  };

  const handleRemoveOtherImage = async (index: number, imageUrl: string) => {
    if (editingPrestation?.id) {
      // Instead of deleting immediately, add to deletedImages array
      setPr(prev => ({
        ...prev,
        otherImage: prev.otherImage.filter((_, i) => i !== index),
        otherImageFile: prev.otherImageFile?.filter((_, i) => i !== index) || null,
        deletedImages: [...(prev.deletedImages || []), imageUrl]
      }));
    } else {
      // For new prestations, just update local state
      setPr(prev => ({
        ...prev,
        otherImage: prev.otherImage.filter((_, i) => i !== index),
        otherImageFile: prev.otherImageFile?.filter((_, i) => i !== index) || null
      }));
    }
  };

  return (
    <div className="flex min-h-screen bg-primary">
      <div className="w-2/3 p-6">
        <div className="mx-auto max-w-lg rounded-lg bg-gray-950 p-6 shadow-md">
          <h1 className="mb-4 text-2xl font-bold text-white">
            {editingPrestation
              ? "Modifier une Prestation"
              : "Créer une Prestation"}
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Nom de la Prestation :
                <input
                  type="text"
                  value={pr.name}
                  onChange={(e) => setPr({ ...pr, name: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-800 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Image de Bannière :
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImageUpload}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-800 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
              {pr.bannerImage && (
                <div className="mt-2 flex justify-center">
                  <Image
                    src={pr.bannerImage}
                    alt="Banner Preview"
                    width={200}
                    height={200}
                    className="rounded-md object-cover"
                  />
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Autres Images :
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleOtherImagesUpload}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-800 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {pr?.otherImage && pr.otherImage.map((imageUrl: string, index: number) => (
                  <div key={index} className="relative">
                    <Image
                      src={imageUrl}
                      alt={`Other Image Preview ${index + 1}`}
                      width={200}
                      height={200}
                      className="rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveOtherImage(index, imageUrl)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
                {editingPrestation ? "Mettre à jour" : "Créer une Prestation"}
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
          Liste des Prestations
        </h2>
        <PrestationList startEditing={startEditing} />
      </div>
    </div>
  );
}


function PrestationList({ startEditing }: { startEditing: (prestation: Prestation) => void }) {
  const { prestations, removePrestation, isLoading } = usePrestationContext();

  useEffect(() => {
    console.log("update the data");
  }, [prestations, isLoading]);

  if (isLoading) {
    return <p className="text-gray-400">Chargement des prestations...</p>;
  }

  if (prestations.length === 0 || !prestations) {
    return <p className="text-gray-400">Aucune prestation créée</p>;
  }

  return (
    <>
      {prestations.length === 0 ? (
        <p className="text-gray-400">Aucune prestation créée</p>
      ) : (
        <>
          {prestations.map((prestation) => (
            prestation && (
              <div
                key={prestation.id}
                className="flex items-center justify-between rounded-lg bg-gray-800 p-4 space-y-4"
              >
                <div className="flex items-center space-x-4">
                  {prestation?.bannerImage && (
                    <Image
                      src={prestation.bannerImage}
                      alt={prestation.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  )}
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
            )))}
        </>
      )}
    </>
  );
}