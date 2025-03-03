"use client";
import Image from "next/image";
import React, { useState } from "react";
import { usePortfolio } from "@/components/PortfolioContext";
import { PortfolioItem } from "@/types/portfolio";
import { useRouter } from "next/navigation";
import DragDropImageUpload from "@/components/DragDropImageUpload";

type Data = {
  title: string;
  description: string;
  mainImage: string | null;
  otherImage: string[];
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
    mainImageFile: null,
    otherImageFile: null,
    deletedImages: [],
  });
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMainImageUpload = (files: File[]) => {
    const file = files[0];
    if (file) {
      setData((prev) => ({
        ...prev,
        mainImage: URL.createObjectURL(file),
        mainImageFile: file,
      }));
    }
  };

  const handleOtherImagesUpload = (files: File[]) => {
    if (files.length > 0) {
      try {
        const otherImageUrls = files.map(file => URL.createObjectURL(file));
        
        if (editingPortfolio) {
          const existingUrls = Array.isArray(data.otherImage) ? data.otherImage : [];
          const existingFiles = data.otherImageFile || [];
          setData({
            ...data,
            otherImage: [...existingUrls, ...otherImageUrls],
            otherImageFile: [...existingFiles, ...files]
          });
        } else {
          setData({
            ...data,
            otherImage: otherImageUrls,
            otherImageFile: files
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
      setData(prev => ({
        ...prev,
        otherImage: prev.otherImage.filter((_, i) => i !== index),
        otherImageFile: prev.otherImageFile?.filter((_, i) => i !== index) || null,
        deletedImages: [...(prev.deletedImages || []), imageUrl]
      }));
    } else {
      setData(prev => ({
        ...prev,
        otherImage: prev.otherImage.filter((_, i) => i !== index),
        otherImageFile: prev.otherImageFile?.filter((_, i) => i !== index) || null
      }));
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData();
    
    // Add basic fields
    formData.append("title", data.title);
    formData.append("description", data.description);
    
    // Add main image if exists
    if (data.mainImageFile) {
      formData.append("mainImage", data.mainImageFile);
    }
    
    // Add other images if they exist
    if (data.otherImageFile) {
      data.otherImageFile.forEach((file) => {
        formData.append("otherImage", file);
      });
    }
    
    // Add deleted images if in edit mode
    if (editingPortfolio && data.deletedImages.length > 0) {
      data.deletedImages.forEach((imageUrl) => {
        formData.append("deletedImages", imageUrl);
      });
    }
    
    try {
      let result;
      if (editingPortfolio && editingPortfolio.id) {
        result = await updatePortfolioItem(editingPortfolio.id, formData);
      } else {
        result = await addPortfolioItem(formData);
      }

      if (!result) {
        throw new Error("Failed to submit form");
      }

      // Reset form and refresh the page
      if (editingPortfolio) {
        cancelEditing();
      } else {
        setData({
          title: "",
          description: "",
          mainImage: null,
          otherImage: [],
          mainImageFile: null,
          otherImageFile: null,
          deletedImages: [],
        });
      }
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to submit form");
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (portfolio: PortfolioItem) => {
    setEditingPortfolio(portfolio);
    setData({
      title: portfolio.title,
      description: portfolio.description,
      mainImage: portfolio.mainImage,
      otherImage: Array.isArray(portfolio.otherImage) ? portfolio.otherImage : [],
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
      mainImageFile: null,
      otherImageFile: null,
      deletedImages: [],
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <div className="w-2/3">
          <h1 className="text-2xl font-bold mb-6">
            {editingPortfolio ? "Modifier le Portfolio" : "Créer un Portfolio"}
          </h1>

          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit}>
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

            <DragDropImageUpload
              label="Image Principale :"
              onImageUpload={handleMainImageUpload}
              images={data.mainImage ? [data.mainImage] : []}
              onRemoveImage={() => handleDeleteMainImage()}
              multiple={false}
            />

            <DragDropImageUpload
              label="Autres Images :"
              onImageUpload={handleOtherImagesUpload}
              images={data.otherImage}
              onRemoveImage={handleRemoveOtherImage}
              multiple={true}
            />

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
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Chargement...' : editingPortfolio ? 'Mettre à jour' : 'Créer un Portfolio'}
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

  if (!item || typeof item.id !== 'number') return null;

  return (
    <div className="mb-4 rounded-lg bg-gray-900 shadow-md overflow-hidden">
      <div className="p-3 sm:p-4">
        <h3 className="mb-3 text-base sm:text-lg font-semibold text-white">{item.title}</h3>
        <div className="relative mb-3">
          <Image
            src={item.mainImage}
            alt={item.title}
            width={300}
            height={200}
            className="w-full cursor-pointer rounded-md object-cover aspect-video"
          />
        </div>
        {Array.isArray(item.otherImage) && item.otherImage.length > 0 && (
          <div className="mb-3 grid grid-cols-3 gap-2">
            {item.otherImage.map((imageUrl, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={imageUrl}
                  alt={`${item.title} - Image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="cursor-pointer rounded-md"
                />
              </div>
            ))}
          </div>
        )}
        <p className="mb-3 text-xs sm:text-sm text-gray-400">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <button
            onClick={() => onEdit(item)}
            className="text-blue-500 transition hover:text-blue-700 p-2"
          >
            ✏️
          </button>
          <button
            onClick={() => deletePortfolioItem(item.id)}
            className="text-xs sm:text-sm text-red-500 hover:text-red-600 transition-colors p-2"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManagePortfolio;
