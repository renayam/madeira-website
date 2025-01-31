import { useState } from "react";

const useImageExpand = () => {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const openImage = (image: string) => {
    setExpandedImage(image);
  };

  const closeImage = () => {
    setExpandedImage(null);
  };

  return { expandedImage, openImage, closeImage };
};

export default useImageExpand;
