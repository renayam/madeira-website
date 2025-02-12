import Footer from "@/components/footer";
import Header from "@/components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-primary text-white">
      <Header />
      <main className="min-h-[90vh] flex-grow overflow-auto">{children}</main>
      <Footer />
    </div>
  );
}
