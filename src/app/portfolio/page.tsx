import React from "react";
import Image from "next/image";

export default function Portfolio() {
  const portfolioItems = [
    {
      title: "Moderne",
      description: "Une salle de bain au design contemporain et épuré.",
      mainImage: "/images/20241121_150006.jpg",
      gallery: [
        "/images/20241121_150012.jpg",
        "/images/20241121_150017.jpg",
        "/images/20241121_150028.jpg",
        "/images/20241121_150043.jpg",
      ],
      altText: "Salle de bain rénovée par Madeira.€co à Ballancourt",
    },
    {
      title: "Classique",
      description: "Un style intemporel pour une salle de bain chaleureuse.",
      mainImage: "/images/20231010_140727.jpg",
      gallery: [
        "/images/20231010_140738.jpg",
        "/images/20231010_140754.jpg",
        "/images/20231010_140807.jpg",
        "/images/20231010_140833.jpg",
      ],
      altText: "Salle de bain classique rénovée par Madeira.€co à Ballancourt",
    },
    {
      title: "Minimaliste",
      description: "Un espace fonctionnel avec des lignes épurées.",
      mainImage: "/images/20231204_143732.jpg",
      gallery: ["/images/20231204_143745.jpg", "/images/20231204_143759.jpg"],
      altText:
        "Salle de bain minimaliste rénovée par Madeira.€co à Ballancourt",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center bg-primary p-4">
      <p className="mb-6 text-center text-lg text-white">
        Découvrez nos réalisations sur mesure pour transformer vos salles de
        bains en espaces uniques.
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {portfolioItems.map((item, index) => (
          <div
            key={index}
            className="portfolio-item rounded-lg bg-white shadow-md"
          >
            <Image
              src={item.mainImage}
              alt={item.altText}
              width={600} // Adjust width as needed
              height={400} // Adjust height as needed
              className="rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-700">{item.description}</p>
              {/* Gallery Section */}
              <div className="gallery hidden" id={item.title.toLowerCase()}>
                {item.gallery.map((galleryImage, idx) => (
                  <Image
                    key={idx}
                    src={galleryImage}
                    alt={`${item.title} image ${idx + 1}`}
                    width={300} // Adjust width as needed
                    height={200} // Adjust height as needed
                    className="mt-2 rounded"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="more-projects mt-6">
        <a
          href="realization.html"
          className="btn rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Venez découvrir toutes nos réalisations
        </a>
      </div>
    </div>
  );
}
