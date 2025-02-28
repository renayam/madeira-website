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
    otherImage: "",
    description: "",
  });

  // State for tracking which prestation is being edited
  const [editingPrestation, setEditingPrestation] = useState<Prestation | null>(
    null,
  );

  const { AddPrestation, updatePrestation } =
    usePrestationContext();

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleBannerImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    // const file = e.target.files?.[0];
    // if (file) {
    //   try {
    //     const base64 = await convertToBase64(file);
    //     setPr({ ...pr, bannerImage: base64 });
    //   } catch (error) {
    //     console.error("Error uploading banner image:", error);
    //     alert("Erreur lors du téléchargement de l'image de bannière");
    //   }
    // }
  };

  const handleOtherImagesUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    // const files = e.target.files;
    // if (files) {
    //   try {
    //     const base64Images = await convertToBase64(files[0]);
    //     setPr({ ...pr, otherImage: base64Images });
    //   } catch (error) {
    //     console.error("Error uploading other images:", error);
    //     alert("Erreur lors du téléchargement des images");
    //   }
    // }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!pr.name || !pr.description) {
      alert("Veuillez remplir tous les champs correctement.");
      return;
    }

    try {
      if (editingPrestation) {
        // Update existing prestation
        const updatedPrestation = await updatePrestation({
          ...pr,
          id: editingPrestation.id,
        });

        if (updatedPrestation) {
          // Reset form and editing state
          setEditingPrestation(null);
          setPr({
            name: "",
            bannerImage: "",
            otherImage: "",
            description: "",
          });
        }
      } else {
        // Add new prestation
        const newPrestation = await AddPrestation(pr);

        if (newPrestation) {
          setPr({
            name: "",
            bannerImage: "",
            otherImage: "",
            description: "",
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
      otherImage: prestation.otherImage,
      description: prestation.description,
    });
  };

  // Function to cancel editing
  const cancelEditing = () => {
    setEditingPrestation(null);
    setPr({
      name: "",
      bannerImage: "",
      otherImage: "",
      description: "",
    });
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
              {pr?.otherImage && (
                <div className="mt-2 flex justify-center">
                  <Image
                    src={pr.otherImage}
                    alt="Other Image Preview"
                    width={200}
                    height={200}
                    className="rounded-md object-cover"
                  />
                </div>
              )}
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

  const { prestations, removePrestation, isLoading } =
    usePrestationContext();

  if (isLoading) {
    return <p className="text-gray-400">Chargement des prestations...</p>;
  }

  if (prestations.length === 0 || !prestations) {
    return <p className="text-gray-400">Aucune prestation créée</p>;
  }

  useEffect(() => {
    console.log("update the data");
  }, [prestations, isLoading]);

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