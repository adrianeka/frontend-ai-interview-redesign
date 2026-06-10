import Image from "next/image";

/**
 * Application footer component.
 * Displays the copyright information and application logo.
 */
export function Footer() {
  return (
    <footer className="border-t bg-[#FAFAFA] py-4 px-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full">
          <Image src="/Logo.png" alt="Logo P79" width={120} height={44} className="w-[120px] h-[44px] object-cover" />
          <p className="text-sm text-[#667085]">
            © 2026 AI Interview Platform • Built by Mini Padepokan 79 | All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
