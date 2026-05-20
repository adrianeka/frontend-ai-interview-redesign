"use client";

import * as React from "react";
import Link from "next/link";
import { LayoutDashboard, Activity, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  user?: {
    name: string;
    role: string;
    avatarUrl: string;
  };
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Nav */}
        <div className="flex items-center space-x-8 gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img src="https://cdn.sejutacita.id/677f6599d39d490013975af8/JobPortalCompanyLogo/8e0deb93-22d0-4e14-ac8c-d3178eb4eada.png" className="w-[120px] h-[120px]" />
          </Link>

          <div className="h-[43px] border-l-2 border-[#E2E4E6]"></div>

          <nav className="hidden md:flex items-center space-x-2">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-[#F1F9FA] text-[#0076D2] rounded-lg font-semibold border-2 border-blue-600"
            >
              <LayoutDashboard size={18} />
              Interviews
            </button>

            <button
              className="flex items-center gap-2 px-4 py-2 border-2 border-[#E2E4E6] text-muted-foreground hover:bg-muted rounded-lg font-medium transition-colors"
            >
              <Activity size={18} />
              Monitoring
            </button>
          </nav>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4 h-10">
          <Avatar className="h-10 w-10 border">
            <AvatarImage
              src="https://cdn.rafled.com/anime-icons/images/374yi72bsJLqPnyn3085StHiuZXNgKAc.jpg"
              alt="Profile"
            />

            <AvatarFallback>JD</AvatarFallback>
          </Avatar>

          {/* Tetap column tapi rata kiri */}
          <div className="hidden sm:flex flex-col justify-center">
            <p className="text-sm font-semibold leading-tight">
              {user?.name || "John Doe"}
            </p>

            <span className="inline-flex w-fit items-center mt-1 px-3 py-1 text-xs text-green-600 bg-green-50 border border-green-200 rounded-full">
              {user?.role || "Interviewer"}
            </span>
          </div>

          <div className="ml-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center focus:outline-none">
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
