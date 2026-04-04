import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MainLayoutProps } from "@/lib/types";

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}