"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // use usePathname instead of useRouter

interface LogoProps {
  alt: string;
}

const Logo: React.FC<LogoProps> = ({ alt }) => (
  <div className="flex-shrink-0">
    <Image src="/images/logo.png" alt={alt} width={150} height={40} priority />
  </div>
);

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  return (
    <header
      className={`flex w-full flex-col gap-10 text-white shadow-md ${className}`}
    >
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
  const pathname = usePathname();

  const navItems = [
    { href: "/client/realisations", label: "Realisations" },
    { href: "/client/portfolio", label: "Portfolio" },
    { href: "/client/service", label: "Services" },
    { href: "/client/contact", label: "Contact" },
  ];

  return (
    <nav className="pb-6">
      <ul className="mx-auto flex w-1/2 flex-row justify-between space-x-0 md:space-x-8">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block text-base underline transition duration-300 ease-in-out hover:text-secondary ${
                pathname.startsWith(item.href)
                  ? "font-bold text-secondary"
                  : "text-white"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Header;
