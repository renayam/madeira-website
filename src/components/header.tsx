"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LogoProps {
  alt: string;
}

const Logo: React.FC<LogoProps> = ({ alt }) => (
  <div className="flex-shrink-0">
    <Image 
      src="/images/logo.png" 
      alt={alt} 
      width={150} 
      height={40} 
      priority 
      className="h-auto w-[120px] md:w-[150px]" 
    />
  </div>
);

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Spacer to prevent content from jumping when header becomes fixed */}
      <div className="h-[140px] md:h-[160px]" />
      
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm shadow-lg ${className}`}
      >
        <div className="container mx-auto flex flex-col px-4 py-3 md:py-4">
          <div className="relative flex w-full items-center justify-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 md:hidden"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <Link href="/" className="flex-shrink-0">
              <Logo alt="Logo Madeira.€co" />
            </Link>
          </div>
          
          <div className="mt-4 text-center">
            <h1 className="text-base font-bold md:text-xl lg:text-2xl">
              Bienvenue chez Madeira.€co. Ensemble, donnons vie à vos envies.
            </h1>
            <p className="mt-2 text-sm text-gray-300 md:text-base">
              Transformez votre espace.
            </p>
          </div>
        </div>

        <Nav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </header>
    </>
  );
};

interface NavProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const Nav: React.FC<NavProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const pathname = usePathname();

  const navItems = [
    { href: "/client/realisations", label: "Realisations" },
    { href: "/client/portfolio", label: "Portfolio" },
    { href: "/client/service", label: "Services" },
    { href: "/client/contact", label: "Contact" },
  ];

  return (
    <nav 
      className={`transform overflow-hidden transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-64' : 'max-h-0 md:max-h-none'
      }`}
    >
      <div className="container mx-auto px-4 pb-4 md:pb-6">
        <ul className="flex flex-col items-center space-y-4 md:flex-row md:justify-center md:space-y-0 md:space-x-8">
          {navItems.map((item) => (
            <li key={item.href} className="w-full md:w-auto">
              <Link
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full rounded-lg py-2 text-center text-base transition duration-300 ease-in-out hover:bg-white/10 md:w-auto md:hover:bg-transparent md:hover:text-secondary ${
                  pathname.startsWith(item.href)
                    ? "font-bold text-secondary"
                    : "text-white hover:text-white md:hover:text-secondary"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
