"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } finally {
        router.push("/admin");
      }
    };

    logout();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-white">Déconnexion en cours...</div>
    </div>
  );
}
