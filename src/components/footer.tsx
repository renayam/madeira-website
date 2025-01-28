import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="p-4 text-white">
      <div className="container mx-auto flex flex-col items-start justify-between md:flex-row md:items-center">
        <address className="mb-4 not-italic md:mb-0">
          <div className="flex items-center">
            <span role="img" aria-label="Location" className="mr-2">
              📍
            </span>
            <span>50 Bis rue Eugène Pereire, 91610 Ballancourt</span>
          </div>
          <div className="mt-2 flex items-center">
            <span role="img" aria-label="Phone" className="mr-2">
              📞
            </span>
            <span>+33 6 26 24 39 27</span>
          </div>
        </address>
        <div className="items-right flex flex-col text-center md:text-right">
          <span className="block">Madeira.€co 2024</span>
          <a
            href="politique-confidentialite.html"
            id="privacy-link"
            className="mt-1 inline-block text-blue-400 hover:underline"
          >
            Politique de confidentialité
          </a>
          <Link href="/admin">Admin</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
