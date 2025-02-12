import type { Metadata } from "next";
import "./globals.css";
import { ServiceProvider } from "@/components/ServiceContext";
import { PrestationProvider } from "@/components/PrestationContext";
import { PortfolioProvider } from "@/components/PortfolioContext";

export const metadata: Metadata = {
  title: "Madeira.€co",
  description:
    "Artisan plombier, artisan décorateur, artisan de décoration, artisan de décoration et artisan de décoration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col bg-primary text-white">
        <main className="min-h-[90vh] flex-grow overflow-auto">
          <ServiceProvider>
            <PortfolioProvider>
              <PrestationProvider>{children}</PrestationProvider>
            </PortfolioProvider>
          </ServiceProvider>
        </main>
      </body>
    </html>
  );
}
