"use client";

import { FileText, MonitorSmartphone, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Interviews", href: "/interviews", icon: Users, disabled: false },
  {
    label: "Result Answer",
    href: "/result-answer",
    icon: FileText,
    disabled: false,
  },
  {
    label: "Monitoring",
    href: "/monitoring",
    icon: MonitorSmartphone,
    disabled: true,
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-60 shrink-0 bg-white px-3 py-6"
      style={{ borderRight: "1px solid #f3f4f6" }}
    >
      <nav className="flex flex-col gap-1">
        {navItems.map(({ label, href, icon: Icon, disabled }) => {
          const active = isActive(pathname, href) && !disabled;

          const itemStyle = active
            ? { backgroundColor: "#0078D7", color: "#ffffff", fontWeight: 500 }
            : disabled
              ? { color: "#A9ADB5", cursor: "not-allowed", opacity: 0.6 }
              : { color: "#717784" };

          const className =
            "group flex items-center gap-3 rounded-md px-4 py-3 text-sm transition-colors";

          const navContent = (
            <>
              <Icon
                size={18}
                strokeWidth={active ? 2.5 : 1.75}
                style={{
                  color: active ? "#ffffff" : disabled ? "#A9ADB5" : "#8A909C",
                }}
              />
              {label}
            </>
          );

          if (disabled) {
            return (
              <div key={href} style={itemStyle} className={className}>
                {navContent}
              </div>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              style={itemStyle}
              className={`${className} ${!active ? "hover:bg-gray-50 hover:text-gray-900" : ""}`}
            >
              {navContent}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
