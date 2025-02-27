"use client";
import React from "react";
import { useState, ChangeEvent } from "react";
import Image from "next/image";
import { usePrestationContext } from "../../../../components/PrestationContext";
import { Prestation } from "@/types/prestation";

export default function PrestationCreate() {
  const [pr, setPr] = useState<Prestation>({
    name: "",
    bannerImage: "",
    otherImage: "",
    description: "",
  });
  const { prestations, addPrestation, removePrestation } =
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
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        // setPr({ ...pr, bannerImage: base64 });
      } catch (error) {
        console.error("Error uploading banner image:", error);
        alert("Erreur lors du téléchargement de l'image de bannière");
      }
    }
  };

  const handleOtherImagesUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      try {
        // const base64Images = await Promise.all(
        //   Array.from(files).map(convertToBase64),
        // );
        const base64Images = "";

        setPr({ ...pr, otherImage: base64Images });
      } catch (error) {
        console.error("Error uploading other images:", error);
        alert("Erreur lors du téléchargement des images");
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!pr.name || !pr.description) {
      alert("Veuillez remplir tous les champs correctement.");
      return;
    }

    addPrestation(pr);
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
            Créer une Prestation
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
              {pr.otherImage.length > 0 && (
                <div className="m-2 grid grid-cols-3 gap-2">
                  {/*
                  {pr.otherImage.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt={`Other Image ${index + 1}`}
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                  ))}
                  */}
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
            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Créer une Prestation
            </button>
          </form>
        </div>
      </div>

      {/* Prestation List */}
      <div className="w-1/3 bg-gray-900 p-6">
        <h2 className="mb-4 text-xl font-bold text-white">
          Liste des Prestations
        </h2>
        {prestations?.length === 0 ? (
          <p className="text-gray-400">Aucune prestation créée</p>
        ) : (
          <div className="space-y-4">
            {/*

            {prestations?.map((prestation) => (
              <div
                key={prestation.id}
                className="flex items-center justify-between rounded-lg bg-gray-800 p-4"
              >
                <div className="flex items-center space-x-4">
                  {prestation.bannerImage && (
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
                <button
                  onClick={() => removePrestation(prestation.id)}
                  className="text-red-500 transition hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
            ))}
			*/}
          </div>
        )}
      </div>
    </div>
  );
}
