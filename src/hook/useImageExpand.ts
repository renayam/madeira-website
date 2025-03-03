import { useState } from "react";

/**
 * Custom hook for managing image expansion/modal functionality
 * @returns {Object} Object containing image expansion state and control functions
 * @returns {string|null} returns.expandedImage - Currently expanded image URL or null
 * @returns {function} returns.openImage - Function to open/expand an image
 * @returns {function} returns.closeImage - Function to close/collapse the expanded image
 */
const useImageExpand = () => {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  /**
   * Opens/expands an image
   * @param {string} image - URL of the image to expand
   */
  const openImage = (image: string) => {
    setExpandedImage(image);
  };

  /**
   * Closes/collapses the currently expanded image
   */
  const closeImage = () => {
    setExpandedImage(null);
  };

  return { expandedImage, openImage, closeImage };
};

export default useImageExpand;
