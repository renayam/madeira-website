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
  altText: string;
};

const ManagePortfolio: React.FC = () => {
  const { addPortfolioItem, updatePortfolioItem } = usePortfolio();
  const [data, setData] = useState<Data>({
    title: "",
    description: "",
    mainImage: null,
    altText: "",
  });
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);

  const { expandedImage, closeImage } = useImageExpand();

  const handleMainImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setData((prev) => ({ ...prev, mainImage: URL.createObjectURL(file) }));
    }
  };

  const handleDeleteMainImage = () =>
    setData((prev) => ({ ...prev, mainImage: null }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!data.mainImage) {
      alert("Une image principale est requise.");
      return;
    }

    try {
      const portfolioData: PortfolioItem = {
        id: editingPortfolio ? editingPortfolio.id : Date.now(),
        ...data,
      } as PortfolioItem;

      if (editingPortfolio) {
        await updatePortfolioItem(editingPortfolio.id, portfolioData);
        setEditingPortfolio(null);
      } else {
        await addPortfolioItem(portfolioData);
      }

      setData({
        title: "",
        description: "",
        mainImage: null,
        altText: "",
      });
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
      altText: portfolio.altText,
    });
  };

  const cancelEditing = () => {
    setEditingPortfolio(null);
    setData({
      title: "",
      description: "",
      mainImage: null,
      altText: "",
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
  if (!item || !item.id) return null;

  return (
    <div className="mb-4 flex rounded-lg bg-gray-900 shadow-md">
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
