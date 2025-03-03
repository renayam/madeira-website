import Footer from "@/components/footer";
import Header from "@/components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-primary text-white">
      <Header className="fixed top-0 z-50 w-full bg-primary" />
      <main className="mt-[200px] min-h-[90vh] flex-grow overflow-auto">{children}</main>
      <Footer />
    </div>
  );
}
