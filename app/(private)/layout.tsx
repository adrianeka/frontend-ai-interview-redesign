import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function PrivateLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <div className="bg-[#F5F5F5] p-4">
                {children}
            </div>
            <Footer />
        </>
    );
}
