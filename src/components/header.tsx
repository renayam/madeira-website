"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LogoProps {
  alt: string;
}

const Logo: React.FC<LogoProps> = ({ alt }) => (
  <div className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
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
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Spacer to prevent content from jumping when header becomes fixed */}
      <div className="h-[120px] md:h-[140px]" />
      
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-primary/95 backdrop-blur-sm shadow-lg' 
            : 'bg-primary/80 backdrop-blur-none'
        } ${className}`}
      >
        <div className="container mx-auto flex flex-col px-4 py-3 md:py-4">
          <div className="relative flex w-full items-center justify-between md:justify-center">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-12 w-12 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 active:bg-white/20 md:hidden"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <div className="relative w-6 h-5">
                <span className={`absolute w-6 h-0.5 bg-white transform transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 top-2' : 'rotate-0 top-0'
                }`} />
                <span className={`absolute w-6 h-0.5 bg-white transform transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100 top-2'
                }`} />
                <span className={`absolute w-6 h-0.5 bg-white transform transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 top-2' : 'rotate-0 top-4'
                }`} />
              </div>
            </button>

            <Link 
              href="/" 
              className="transition-transform duration-300 hover:scale-105"
              aria-label="Go to homepage"
            >
              <Logo alt="Logo Madeira.€co" />
            </Link>

            {/* Add a placeholder div to maintain centering with the burger menu */}
            <div className="w-12 md:hidden" />
          </div>
          
          <div className="mt-4 text-center">
            <h1 className="text-base font-bold md:text-xl lg:text-2xl tracking-tight">
              Bienvenue chez Madeira.€co. Ensemble, donnons vie à vos envies.
            </h1>
            <p className="mt-2 text-sm text-gray-300/90 md:text-base font-light">
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
        isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100'
      }`}
      aria-hidden={!isMenuOpen}
    >
      <div className="container mx-auto px-4 pb-4 md:pb-6">
        <ul className="flex flex-col items-center space-y-2 md:flex-row md:justify-center md:space-y-0 md:space-x-8">
          {navItems.map((item) => (
            <li key={item.href} className="w-full md:w-auto">
              <Link
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`group block w-full rounded-lg py-3 px-4 text-center text-base transition-all duration-300 ease-in-out 
                  hover:bg-white/10 active:bg-white/20 md:px-3 md:py-2 md:hover:bg-transparent 
                  ${pathname.startsWith(item.href)
                    ? "font-bold text-secondary"
                    : "text-white hover:text-white md:hover:text-secondary"
                  }`}
              >
                {item.label}
                <span className={`block h-0.5 max-w-0 transition-all duration-300 group-hover:max-w-full
                  ${pathname.startsWith(item.href) ? "bg-secondary" : "bg-white md:bg-secondary"}`}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
