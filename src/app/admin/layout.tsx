"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/status");
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    if (pathname !== "/admin") {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      router.push("/admin");
    } catch {
      console.error("Logout failed");
    }
  };

  const hideNav = pathname === "/admin";

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {!hideNav && (
        <aside className="fixed left-0 top-0 z-40 h-full w-1/6 border-r border-gray-800 bg-gray-950 shadow-lg">
          <div className="flex h-16 items-center justify-center border-b border-gray-800">
            <h1 className="text-xl font-bold opacity-100">Admin Panel</h1>
          </div>

          {!loading && isAuthenticated && (
            <div className="mt-4 border-b border-gray-800 pb-4">
              <div className="flex items-center justify-center px-3">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                <span className="ml-2 text-sm text-green-400">Connecté</span>
              </div>
            </div>
          )}

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

          {isAuthenticated && (
            <div className="absolute bottom-0 w-full border-t border-gray-800 p-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center rounded-md bg-red-900/50 px-3 py-2 text-red-400 transition hover:bg-red-900"
              >
                <span className="mr-2">🚪</span>
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </aside>
      )}

      <main
        className={`flex-1 p-6 transition-all duration-300 ${!hideNav ? "ml-[16.666%]" : ""}`}
      >
        {children}
      </main>
    </div>
  );
}
