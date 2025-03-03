import React, { useCallback, useState } from 'react';
import Image from 'next/image';

interface DragDropImageUploadProps {
  onImageUpload: (files: File[]) => void;
  images: string[];
  onRemoveImage?: (index: number, imageUrl: string) => void;
  label: string;
  multiple?: boolean;
  className?: string;
}

const DragDropImageUpload: React.FC<DragDropImageUploadProps> = ({
  onImageUpload,
  images,
  onRemoveImage,
  label,
  multiple = false,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter(file =>
        file.type.startsWith('image/')
      );

      if (files.length > 0) {
        if (!multiple && files.length > 1) {
          alert('Veuillez ne déposer qu\'une seule image');
          return;
        }
        onImageUpload(files);
      }
    },
    [multiple, onImageUpload]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter(file =>
        file.type.startsWith('image/')
      );

      if (files.length > 0) {
        if (!multiple && files.length > 1) {
          alert('Veuillez ne sélectionner qu\'une seule image');
          return;
        }
        onImageUpload(files);
      }
    },
    [multiple, onImageUpload]
  );

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-300">
        {label}
        <div
          className={`mt-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors
            ${isDragging
              ? 'border-blue-500 bg-blue-50/5'
              : 'border-gray-300 hover:border-blue-500'
            }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <p className="mt-1 text-sm text-gray-400">
              Glissez-déposez {multiple ? 'des images' : 'une image'} ici, ou{' '}
              <label className="cursor-pointer text-blue-500 hover:text-blue-400">
                parcourez
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple={multiple}
                  onChange={handleFileInput}
                />
              </label>
            </p>
            <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
          </div>
        </div>
      </label>

      {images.length > 0 && (
        <div className={`mt-4 grid ${multiple ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
          {images.map((imageUrl, index) => (
            <div key={index} className="relative">
              <Image
                src={imageUrl}
                alt={`Image Preview ${index + 1}`}
                width={200}
                height={200}
                className="rounded-md object-cover"
              />
              {onRemoveImage && (
                <button
                  type="button"
                  onClick={() => onRemoveImage(index, imageUrl)}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DragDropImageUpload; 