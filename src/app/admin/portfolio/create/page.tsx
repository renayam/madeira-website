"use client";
import Image from "next/image";
import React, { useState } from "react";
import useImageExpand from "@/hook/useImageExpand";
import { usePortfolio, PortfolioItem } from "@/components/PortfolioContext";

type Data = {
  title: string;
  description: string;
  mainImage: string | null;
  gallery: string[];
  altText: string;
};

const ManagePortfolio: React.FC = () => {
  const { addPortfolioItem, portfolioItems, deletePortfolioItem } =
    usePortfolio();
  const [data, setData] = useState<Data>({
    title: "",
    description: "",
    mainImage: null,
    gallery: [],
    altText: "",
  });

  const { expandedImage, openImage, closeImage } = useImageExpand();

  const handleMainImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setData((prev) => ({ ...prev, mainImage: URL.createObjectURL(file) }));
    }
  };

  const handleGalleryImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file),
      );
      setData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...newImages],
      }));
    }
  };

  const handleDeleteGalleryImage = (index: number) => {
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteMainImage = () =>
    setData((prev) => ({ ...prev, mainImage: null }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!data.mainImage || data.gallery.length === 0) {
      alert(
        "Une image principale et au moins une image de galerie sont requises.",
      );
      return;
    }

    const newPortfolioItem: PortfolioItem = {
      id: Date.now(),
      ...data,
    } as PortfolioItem;

    addPortfolioItem(newPortfolioItem);
    setData({
      title: "",
      description: "",
      mainImage: null,
      gallery: [],
      altText: "",
    });
    alert("Portfolio créé avec succès !");
  };

  return (
    <div className="flex min-h-screen bg-primary p-6">
      <div className="flex w-full space-x-6">
        {/* Formulaire de création */}
        <div className="w-2/3 rounded-lg bg-gray-950 p-6 shadow-md">
          <h1 className="mb-4 text-2xl font-bold">Créer un Portfolio</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Titre du Portfolio :
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Texte Alternatif :
                <input
                  type="text"
                  value={data.altText}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, altText: e.target.value }))
                  }
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Image Principale :
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  required
                  className="mt-1 block w-full cursor-pointer rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                />
              </label>
              {data.mainImage && (
                <div className="relative mt-2">
                  <Image
                    src={data.mainImage}
                    alt="Aperçu de l'Image Principale"
                    width={600}
                    height={400}
                    className="h-auto w-full rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleDeleteMainImage}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    X
                  </button>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Galerie d&apos;Images :
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryImageChange}
                  multiple
                  className="mt-1 block w-full cursor-pointer rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.gallery.map((image, index) => (
                  <div key={index} className="relative h-24 w-24">
                    <Image
                      src={image}
                      alt={`Image ${index + 1}`}
                      width={96}
                      height={96}
                      className="rounded-md object-cover"
                      onClick={() => openImage(image)}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteGalleryImage(index)}
                      className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Description :
                <textarea
                  value={data.description}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Créer un Portfolio
            </button>
          </form>
        </div>

        {/* Liste des portfolios */}
        <div className="w-1/3 overflow-y-auto rounded-lg bg-gray-950 p-6 shadow-md">
          <h2 className="mb-6 text-2xl font-bold">Portfolios Existants</h2>
          {portfolioItems.length === 0 ? (
            <p className="text-gray-400">Aucun portfolio créé</p>
          ) : (
            portfolioItems.map((item) => (
              <div
                key={item.id}
                className="mb-4 flex rounded-lg bg-gray-900 shadow-md"
              >
                <div className="w-1/3">
                  <Image
                    src={item.mainImage}
                    alt={item.altText}
                    width={150}
                    height={100}
                    className="object-cover"
                  />
                </div>
                <div className="w-2/3 p-3">
                  <h3 className="mb-1 text-lg font-semibold">{item.title}</h3>
                  <p className="mb-2 line-clamp-2 text-sm text-gray-400">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {item.gallery.length} images
                    </span>
                    <button
                      onClick={() => deletePortfolioItem(item.id)}
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal d'image agrandie */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeImage}
        >
          <Image
            src={expandedImage}
            alt="Image Agrandie"
            width={800}
            height={600}
            className="h-auto max-h-full w-auto max-w-full"
          />
        </div>
      )}
    </div>
  );
};

export default ManagePortfolio;
