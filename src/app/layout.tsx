import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";

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
        <Header />
        <main className="min-h-[90vh] flex-grow overflow-auto">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
