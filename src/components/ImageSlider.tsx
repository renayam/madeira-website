"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { getProxiedImageUrl } from "@/lib/image-proxy";

interface ImageSliderProps {
  images: string[];
  onClose: () => void;
}

/**
 * A responsive image slider/carousel component with keyboard navigation
 * @param {ImageSliderProps} props - Component props
 * @param {string[]} props.images - Array of image URLs to display
 * @param {function} props.onClose - Callback function to close the slider
 */
const ImageSlider: React.FC<ImageSliderProps> = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  /**
   * Advances to the next image in the slider
   * @param {React.MouseEvent} [e] - Optional mouse event
   */
  const goToNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      const nextIndex = (currentIndex + 1) % images.length;
      console.log("Going to next image:", nextIndex);
      setCurrentIndex(nextIndex);
    },
    [currentIndex, images.length],
  );

  /**
   * Goes to the previous image in the slider
   * @param {React.MouseEvent} [e] - Optional mouse event
   */
  const goToPrevious = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      console.log("Going to previous image:", prevIndex);
      setCurrentIndex(prevIndex);
    },
    [currentIndex, images.length],
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        goToNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        goToPrevious();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious, onClose]);

  // Reset index when images change
  useEffect(() => {
    setCurrentIndex(0);
    console.log("ImageSlider mounted with images:", images);
  }, [images]);

  useEffect(() => {
    console.log("Current image index changed to:", currentIndex);
  }, [currentIndex]);

  /**
   * Handles button click events for navigation
   * @param {React.MouseEvent} e - Mouse event
   * @param {'next' | 'prev'} action - Navigation direction
   */
  const handleButtonClick = (e: React.MouseEvent, action: "next" | "prev") => {
    e.preventDefault();
    e.stopPropagation();
    if (action === "next") {
      goToNext();
    } else {
      goToPrevious();
    }
  };

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex cursor-pointer touch-none items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <div
        className="relative h-full w-full cursor-default md:h-auto md:w-auto"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close button */}
        <button
          className="absolute right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-red-500 p-3 text-3xl text-white shadow-lg transition-colors duration-200 hover:bg-red-600 hover:text-red-200 md:right-4 md:top-4"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Navigation buttons - hidden on mobile */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 z-50 hidden h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-blue-500 p-6 text-3xl text-white shadow-lg transition-all duration-200 hover:bg-blue-600 hover:text-white/90 md:flex"
              onClick={(e) => handleButtonClick(e, "prev")}
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              className="absolute right-4 top-1/2 z-50 hidden h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-blue-500 p-6 text-3xl text-white shadow-lg transition-all duration-200 hover:bg-blue-600 hover:text-white/90 md:flex"
              onClick={(e) => handleButtonClick(e, "next")}
              aria-label="Next image"
            >
              →
            </button>
          </>
        )}

        {/* Image container */}
        <div className="relative mx-auto h-screen w-screen max-w-7xl md:h-[80vh] md:w-[90vw]">
          <Image
            key={currentIndex}
            src={getProxiedImageUrl(images[currentIndex])}
            alt={`Image ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 90vw"
            quality={90}
          />
        </div>

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/50 px-6 py-3 text-base font-medium text-white md:text-lg">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Swipe indicator - only shown on mobile */}
        {images.length > 1 && (
          <div className="absolute bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white md:hidden">
            Swipe left or right to navigate
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSlider;
