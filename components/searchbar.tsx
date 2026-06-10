"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

/**
 * Props for the SearchBar component.
 */
interface SearchBarProps {
    /** Hint text shown inside the input when empty */
    placeholder?: string;
    /** Controlled value of the input */
    value?: string;
    /** Callback fired when the input value changes */
    onChange?: (value: string) => void;
    /** Whether to display the standard "Search" label above the input */
    showLabel?: boolean;
}

/**
 * Reusable search input component.
 * Features an integrated search icon and consistent layout/styling across the dashboard.
 */
export function SearchBar({
    placeholder = "Search...",
    value,
    onChange,
    showLabel = true,
}: SearchBarProps) {
    return (
        <div className="w-full font-inter">
            {showLabel && (
                <label className="block text-[13px] font-medium text-slate-500 mb-[6px] ml-1">
                    Search
                </label>
            )}

            <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-slate-300" />

                <Input
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-[48px] pl-11 rounded-[6px] border border-[#E2E4E6] bg-slate-50/50 placeholder:text-slate-300 text-slate-600 focus:bg-white focus:border-[#D5D9DD] transition-all text-base shadow-none"
                />
            </div>
        </div>
    );
}