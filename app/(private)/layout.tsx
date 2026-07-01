import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import Sidebar from "@/features/interviews/components/sidebar";

/**
 * Layout wrapper for authenticated (private) routes.
 * Includes the Navbar at the top and the Footer at the bottom.
 */
export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-[#F5F5F5] p-4">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
