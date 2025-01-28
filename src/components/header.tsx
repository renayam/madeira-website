import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  alt: string;
}

const Logo: React.FC<LogoProps> = ({ alt }) => (
  <div className="flex-shrink-0">
    <Image src="/images/logo.png" alt={alt} width={50} height={20} priority />
  </div>
);

const Header: React.FC = () => {
  return (
    <header className="flex w-full flex-col text-white shadow-md">
      <div className="flex h-full flex-col items-center justify-center">
        <Link href="/" className="flex-shrink-0">
          <Logo alt="Logo Madeira.€co" />
        </Link>
        <div className="flex-grow text-center">
          <h1 className="text-lg font-bold md:text-xl">
            Bienvenue chez Madeira.€co. Ensemble, donnons vie à vos envies.
          </h1>
          <p className="text-sm md:text-base">Transformez votre espace.</p>
        </div>
      </div>
      <Nav />
    </header>
  );
};

const Nav: React.FC = () => {
  return (
    <nav>
      <ul className="mx-auto flex w-1/2 flex-row justify-between space-x-0 md:space-x-8">
        <li>
          <Link
            href="/portfolio"
            className="block text-base text-white transition duration-300 ease-in-out hover:text-secondary"
          >
            Portfolio
          </Link>
        </li>
        <li>
          <Link
            href="/service"
            className="block text-base text-white transition duration-300 ease-in-out hover:text-secondary"
          >
            Services
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className="block text-base text-white transition duration-300 ease-in-out hover:text-secondary"
          >
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
