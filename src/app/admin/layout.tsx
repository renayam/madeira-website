"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_ROUTES = [
  {
    href: "/admin/prestation/create",
    label: "Créer Realisation",
    icon: "➕",
  },
  {
    href: "/admin/portfolio/create",
    label: "Gérer Portfolio",
    icon: "📷",
  },
  {
    href: "/",
    label: "Retour Site",
    icon: "🌐",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNav = pathname === "/admin";

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {!hideNav && (
        <aside className="fixed left-0 top-0 z-40 h-full w-1/6 border-r border-gray-800 bg-gray-950 shadow-lg">
          {/* Logo Area */}
          <div className="flex h-16 items-center justify-center border-b border-gray-800">
            <h1 className="text-xl font-bold opacity-100">Admin Panel</h1>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4">
            {ADMIN_ROUTES.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`flex items-center p-3 transition hover:bg-gray-800 ${pathname === route.href ? "bg-blue-900 text-blue-300" : ""} `}
              >
                <span className="mr-3 text-xl">{route.icon}</span>
                <span className="opacity-100">{route.label}</span>
              </Link>
            ))}
          </nav>
        </aside>
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 p-6 transition-all duration-300 ${!hideNav ? "ml-[16.666%]" : ""}`}
      >
        {children}
      </main>
    </div>
  );
}
