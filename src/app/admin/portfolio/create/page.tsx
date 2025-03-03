"use client";
import Image from "next/image";
import React, { useState } from "react";
import useImageExpand from "@/hook/useImageExpand";
import { usePortfolio } from "@/components/PortfolioContext";
import { PortfolioItem } from "@/types/portfolio";

type Data = {
  title: string;
  description: string;
  mainImage: string | null;
  otherImage: string[];
  altText: string;
  mainImageFile?: File | null;
  otherImageFile?: File[] | null;
  deletedImages: string[];
};

const ManagePortfolio: React.FC = () => {
  const { addPortfolioItem, updatePortfolioItem } = usePortfolio();
  const [data, setData] = useState<Data>({
    title: "",
    description: "",
    mainImage: null,
    otherImage: [],
    altText: "",
    mainImageFile: null,
    otherImageFile: null,
    deletedImages: [],
  });
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);

  const { expandedImage, closeImage, openImage } = useImageExpand();

  const handleMainImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setData((prev) => ({
        ...prev,
        mainImage: URL.createObjectURL(file),
        mainImageFile: file,
      }));
    }
  };

  const handleOtherImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const otherImages = files.filter(file => file.type.startsWith('image/'));
    const otherImageUrls = otherImages.map(file => URL.createObjectURL(file));

    if (otherImages.length > 0) {
      try {
        // If we're editing, append new images to existing ones
        if (editingPortfolio) {
          const existingUrls = Array.isArray(data.otherImage) ? data.otherImage : [];
          const existingFiles = data.otherImageFile || [];
          setData({
            ...data,
            otherImage: [...existingUrls, ...otherImageUrls],
            otherImageFile: [...existingFiles, ...otherImages]
          });
        } else {
          // For new portfolios, just set the new images
          setData({
            ...data,
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

  const handleDeleteMainImage = () =>
    setData((prev) => ({ ...prev, mainImage: null, mainImageFile: null }));

  const handleRemoveOtherImage = (index: number, imageUrl: string) => {
    if (editingPortfolio?.id) {
      // Instead of deleting immediately, add to deletedImages array
      setData(prev => ({
        ...prev,
        otherImage: prev.otherImage.filter((_, i) => i !== index),
        otherImageFile: prev.otherImageFile?.filter((_, i) => i !== index) || null,
        deletedImages: [...(prev.deletedImages || []), imageUrl]
      }));
    } else {
      // For new portfolios, just update local state
      setData(prev => ({
        ...prev,
        otherImage: prev.otherImage.filter((_, i) => i !== index),
        otherImageFile: prev.otherImageFile?.filter((_, i) => i !== index) || null
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!data.title) {
      alert("Le titre est requis.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("altText", data.altText);

      // Only append file if it exists
      if (data.mainImageFile instanceof File) {
        console.log("Appending main image:", data.mainImageFile.name);
        formData.append("mainImage", data.mainImageFile);
      }

      // Handle multiple other images
      if (data.otherImageFile && Array.isArray(data.otherImageFile)) {
        console.log("Appending other images:", data.otherImageFile.map(f => f.name));
        data.otherImageFile.forEach(file => {
          formData.append("otherImage", file);
        });
      }

      let result;
      if (editingPortfolio && editingPortfolio.id) {
        console.log("Updating portfolio item...");
        result = await updatePortfolioItem(editingPortfolio.id, formData);
      } else {
        console.log("Creating new portfolio item...");
        result = await addPortfolioItem(formData);
      }

      if (result) {
        console.log("Portfolio operation successful:", result);
        setEditingPortfolio(null);
        setData({
          title: "",
          description: "",
          mainImage: null,
          otherImage: [],
          altText: "",
          mainImageFile: null,
          otherImageFile: null,
          deletedImages: [],
        });
      }
    } catch (error) {
      console.error("Error submitting portfolio:", error);
      alert("Une erreur s'est produite lors de la sauvegarde du portfolio.");
    }
  };

  const startEditing = (portfolio: PortfolioItem) => {
    setEditingPortfolio(portfolio);
    setData({
      title: portfolio.title,
      description: portfolio.description,
      mainImage: portfolio.mainImage,
      otherImage: Array.isArray(portfolio.otherImage) ? portfolio.otherImage : [],
      altText: portfolio.altText,
      mainImageFile: null,
      otherImageFile: null,
      deletedImages: [],
    });
  };

  const cancelEditing = () => {
    setEditingPortfolio(null);
    setData({
      title: "",
      description: "",
      mainImage: null,
      otherImage: [],
      altText: "",
      mainImageFile: null,
      otherImageFile: null,
      deletedImages: [],
    });
  };

  return (
    <div className="flex min-h-screen bg-primary p-6">
      <div className="flex w-full space-x-6">
        {/* Formulaire de création */}
        <div className="w-2/3 rounded-lg bg-gray-950 p-6 shadow-md">
          <h1 className="mb-4 text-2xl font-bold">
            {editingPortfolio ? "Modifier le Portfolio" : "Créer un Portfolio"}
          </h1>
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
                  required={!editingPortfolio}
                  className="mt-1 block w-full cursor-pointer rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                />
              </label>
              {data?.mainImage && (
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
                Autres Images :
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleOtherImagesUpload}
                  className="mt-1 block w-full cursor-pointer rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {data?.otherImage && data.otherImage.map((imageUrl: string, index: number) => (
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
            <div className="flex space-x-4">
              <button
                type="submit"
                className="mt-4 w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                {editingPortfolio ? "Mettre à jour" : "Créer un Portfolio"}
              </button>
              {editingPortfolio && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="mt-4 w-full rounded-md bg-gray-600 py-2 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>
        <PortfolioList onEdit={startEditing} />
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
    </div>
  );
};

const PortfolioList = ({ onEdit }: { onEdit: (portfolio: PortfolioItem) => void }) => {
  const { portfolioItems } = usePortfolio();

  if (portfolioItems.length === 0) {
    return (
      <div className="w-1/3 overflow-y-auto rounded-lg bg-gray-950 p-6 shadow-md">
        <h2 className="mb-6 text-2xl font-bold">Portfolios Existants</h2>
        <p className="text-gray-400">Aucun portfolio créé</p>
      </div>
    );
  }

  return (
    <div className="w-1/3 overflow-y-auto rounded-lg bg-gray-950 p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold">Portfolios Existants</h2>
      {portfolioItems.map((item) => (
        <ViewPortfolio key={item.id} item={item} onEdit={onEdit} />
      ))}
    </div>
  );
};

function ViewPortfolio({ item, onEdit }: { item: PortfolioItem; onEdit: (portfolio: PortfolioItem) => void }) {
  const { deletePortfolioItem } = usePortfolio();
  const { openImage } = useImageExpand();

  // Ensure item has an id before rendering
  if (!item || typeof item.id !== 'number') return null;

  const handleImageClick = (imageUrl: string) => {
    openImage(imageUrl);
  };

  return (
    <div className="mb-4 rounded-lg bg-gray-900 shadow-md">
      <div className="p-3">
        <h3 className="mb-1 text-lg font-semibold">{item.title}</h3>
        <div className="mb-4">
          <Image
            src={item.mainImage}
            alt={item.altText}
            width={300}
            height={200}
            className="w-full cursor-pointer rounded-md object-cover"
            onClick={() => handleImageClick(item.mainImage)}
          />
        </div>
        {Array.isArray(item.otherImage) && item.otherImage.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-2">
            {item.otherImage.map((imageUrl, index) => (
              <div key={index} className="relative">
                <Image
                  src={imageUrl}
                  alt={`${item.altText} - Image ${index + 1}`}
                  width={100}
                  height={100}
                  className="cursor-pointer rounded-md object-cover"
                  onClick={() => handleImageClick(imageUrl)}
                />
              </div>
            ))}
          </div>
        )}
        <p className="mb-2 line-clamp-2 text-sm text-gray-400">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <button
            onClick={() => onEdit(item)}
            className="text-blue-500 transition hover:text-blue-700"
          >
            ✏️
          </button>
          <button
            onClick={() => deletePortfolioItem(item.id)}
            className="text-sm text-red-500 hover:text-red-600"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManagePortfolio;
