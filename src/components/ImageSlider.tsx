"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface ImageSliderProps {
  images: string[];
  onClose: () => void;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextIndex = (currentIndex + 1) % images.length;
    console.log('Going to next image:', nextIndex);
    setCurrentIndex(nextIndex);
  }, [currentIndex, images.length]);

  const goToPrevious = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    console.log('Going to previous image:', prevIndex);
    setCurrentIndex(prevIndex);
  }, [currentIndex, images.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToPrevious();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, onClose]);

  // Reset index when images change
  useEffect(() => {
    setCurrentIndex(0);
    console.log('ImageSlider mounted with images:', images);
  }, [images]);

  useEffect(() => {
    console.log('Current image index changed to:', currentIndex);
  }, [currentIndex]);

  const handleButtonClick = (e: React.MouseEvent, action: 'next' | 'prev') => {
    e.preventDefault();
    e.stopPropagation();
    if (action === 'next') {
      goToNext();
    } else {
      goToPrevious();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90" 
      onClick={onClose}
    >
      <div 
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute -right-10 -top-10 z-50 text-2xl text-white hover:text-gray-300"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
        >
          ✕
        </button>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/30 p-4 text-white hover:bg-white/50"
              onClick={(e) => handleButtonClick(e, 'prev')}
            >
              ←
            </button>
            <button
              className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/30 p-4 text-white hover:bg-white/50"
              onClick={(e) => handleButtonClick(e, 'next')}
            >
              →
            </button>
          </>
        )}

        {/* Image */}
        <div className="relative h-[80vh] w-[90vw]">
          <Image
            key={currentIndex} // Force re-render on image change
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
            sizes="90vw"
          />
        </div>

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-white">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider; 