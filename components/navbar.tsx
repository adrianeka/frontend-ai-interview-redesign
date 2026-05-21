"use client";

import * as React from "react";
import Link from "next/link";
import { LayoutDashboard, Activity, ChevronDown, Grid2x2PlusIcon, ChartNoAxesColumnIncreasingIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { logout } from "@/lib/auth";

interface NavbarProps {
  user?: {
    name: string;
    role: string;
    avatarUrl: string;
  };
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#FAFAFA] px-16 py-4 flex items-center justify-between">
      {/* <div className="container mx-auto px-4 h-16 flex items-center justify-between"> */}
      {/* Logo and Nav */}
      <div className="flex items-center gap-8">
        <Link href="/" className="w-fit h-fit">
          <Image src="/Logo.png" alt="Logo P79" width={120} height={44} className="w-[120px] h-[44px] object-cover" />
        </Link>

        <Separator orientation="vertical" />

        <nav className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="lg"
            className="bg-[#F1F9FA] border-2 border-[#0076D2] px-4 py-3"
          >
            <Grid2x2PlusIcon color="#0076D2" size={20} />
            <span className="text-[#0076D2] font-medium text-base">
              Interviews
            </span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="bg-transparent border-2 border-[#E2E4E6] px-4 py-3"
          >
            <ChartNoAxesColumnIncreasingIcon color="#8C929D" size={20} />
            <span className="text-[#8C929D] font-medium text-base">
              Monitoring
            </span>
          </Button>
        </nav>
      </div>

      {/* User Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center focus:outline-none">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-[#E2E4E6]">
              <AvatarImage
                src="https://cdn.rafled.com/anime-icons/images/374yi72bsJLqPnyn3085StHiuZXNgKAc.jpg"
                alt="Profile"
              />

              <AvatarFallback>JD</AvatarFallback>
            </Avatar>

            <div className="hidden sm:flex flex-col items-start justify-center">
              <p className="text-sm font-medium text-[#212121]">
                {user?.name || "John Doe"}
              </p>

              <Badge className="text-[#4BAC87] text-xs px-2 py-1 border border-[#C9EBDE] bg-[#EEF8F4]">
                {user?.role || "Interviewer"}
              </Badge>
            </div>
            <ChevronDownIcon className="text-[#667085]" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onClick={() => logout()}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
