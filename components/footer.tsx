export function Footer() {
  return (
    <footer className="border-t bg-background py-2 mt-5">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-[44px] w-[120px] items-center justify-center">
            <img src='https://cdn.sejutacita.id/677f6599d39d490013975af8/JobPortalCompanyLogo/8e0deb93-22d0-4e14-ac8c-d3178eb4eada.png' />
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            © 2026 AI Interview Platform • Built by Mini Padepokan 79 | All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
