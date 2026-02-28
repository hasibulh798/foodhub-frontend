import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { CartProvider } from "@/lib/Cart-context";

export default function CommonRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <CartProvider>
      <Navbar />
      {children}
      <Footer />
      </CartProvider>
    </div>
  );
}
