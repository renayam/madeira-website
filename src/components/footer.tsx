import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary py-8 text-white">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Company Info Section */}
          <div className="flex flex-col items-center space-y-4 md:items-start">
            <h3 className="text-lg font-semibold">Madeira.€co</h3>
            <address className="not-italic">
              <div className="flex items-center space-x-3">
                <span role="img" aria-label="Location" className="text-xl">
                  📍
                </span>
                <span className="text-gray-300">50 Bis rue Eugène Pereire, 91610 Ballancourt</span>
              </div>
              <div className="mt-3 flex items-center space-x-3">
                <span role="img" aria-label="Phone" className="text-xl">
                  📞
                </span>
                <a href="tel:+33626243927" className="text-gray-300 hover:text-white transition-colors">
                  +33 6 26 24 39 27
                </a>
              </div>
            </address>
          </div>

          {/* Social Links Section */}
          <div className="flex flex-col items-center space-y-4 md:items-start">
            <h3 className="text-lg font-semibold">Suivez-nous</h3>
            <div className="flex flex-col space-y-4">
              <a
                href="https://www.facebook.com/madeira.eco"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3"
                aria-label="Visitez notre page Facebook"
              >
                <svg
                  className="h-8 w-8 text-gray-300 transition-colors group-hover:text-[#1877F2]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-gray-300 transition-colors group-hover:text-[#1877F2]">Facebook</span>
              </a>
              <a
                href="https://www.pagesjaunes.fr/pros/52611358"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3"
                aria-label="Visitez notre page Pages Jaunes"
              >
                <svg 
                  className="h-8 w-8 text-gray-300 transition-colors group-hover:text-[#FFEB00]"
                  viewBox="0 0 32 32" 
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm0 2.667c7.364 0 13.333 5.97 13.333 13.333 0 7.364-5.97 13.333-13.333 13.333-7.364 0-13.333-5.97-13.333-13.333C2.667 8.636 8.636 2.667 16 2.667zm-4 6.666v13.334h8V9.333h-8zm2.667 2.667h2.666v8h-2.666v-8z"/>
                </svg>
                <span className="text-gray-300 transition-colors group-hover:text-[#FFEB00]">Pages Jaunes</span>
              </a>
            </div>
          </div>

          {/* Legal Links Section */}
          <div className="flex flex-col items-center space-y-4 md:items-start">
            <h3 className="text-lg font-semibold">Liens utiles</h3>
            <div className="flex flex-col space-y-3">
              <a
                href="politique-confidentialite.html"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Politique de confidentialité
              </a>
              <Link 
                href="/admin" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Administration
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Madeira.€co. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
