import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";


export default function CommonRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
}

