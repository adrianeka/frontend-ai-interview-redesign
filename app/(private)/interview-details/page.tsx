"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    ArrowLeftIcon,
    EllipsisVerticalIcon,
    LinkIcon,
    PencilIcon,
    Trash2Icon,
    MapPinIcon,
    UserPlusIcon,
    CircleUserIcon,
    DotIcon,
    CircleIcon,
    CheckIcon,
    PlusIcon,
    XIcon,
    ClockIcon,
    SearchIcon,
    CircleXIcon,
    ChevronRightIcon,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationItem, PaginationLast, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Color map for hire decision statuses — keyed by status string
const statusColorMap: Record<string, { color: string; bgColor: string; iconBg: string; icon: React.ElementType; value: string }> = {
    "Strong Hire": { color: "#4BAC87", bgColor: "#EEF8F4", iconBg: "#C9EBDE", icon: CheckIcon, value: "strong-hire" },
    "Hire": { color: "#0076D2", bgColor: "#F1F9FA", iconBg: "#DBF2F3", icon: PlusIcon, value: "hire" },
    "Consider": { color: "#E8A01D", bgColor: "#FFF7E9", iconBg: "#FFE7BA", icon: ClockIcon, value: "consider" },
    "Reject": { color: "#E84E2C", bgColor: "#FFEEEA", iconBg: "#FFCBBF", icon: XIcon, value: "reject" },
};

export default function InterviewDetailsPage() {
    const [mounted, setMounted] = useState(false);
    const [activeFilter, setActiveFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Card className="bg-[#FAFAFA] p-4 sm:p-6">
            {/* Top Action Bar */}
            <CardHeader className="flex flex-row items-center justify-between w-full ">
                {/* Back Button */}
                <Button variant="ghost" className="text-muted-foreground">
                    <ArrowLeftIcon />
                    Back
                </Button>

                <div className="flex items-center gap-2">
                    {/* Copy Link */}
                    <Button variant="ghost" size="icon" className="text-[#707784]">
                        <LinkIcon />
                    </Button>

                    {/* More Options */}
                    {mounted ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-[#707784]"
                                >
                                    <EllipsisVerticalIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {/* Edit */}
                                <DropdownMenuItem className="text-[#707784]"><PencilIcon /> Edit</DropdownMenuItem>

                                {/* Delete */}
                                <DropdownMenuItem variant="destructive"><Trash2Icon /> Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-[#707784]"
                        >
                            <EllipsisVerticalIcon />
                        </Button>
                    )}
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">

                    {/* Location and Status Badge */}
                    <div className="flex flex-row flex-wrap gap-2 h-fit items-center">
                        <Badge variant="outline" className="px-2 py-1.25 rounded-sm h-fit w-fit bg-[#F5F5F5] border border-[#E2E4E6]">
                            <MapPinIcon color="#3366FF" data-icon="inline-start" />
                            <span className="text-sm font-medium text-[#43474F]">
                                OCBC Bank
                            </span>
                        </Badge>

                        <Badge className="bg-[#3366FF] text-[#FAFAFA] px-2 py-1.25 h-fit w-fit">
                            <UserPlusIcon color="#FAFAFA" data-icon="inline-start" />
                            <span className="text-xs font-medium">
                                Hiring
                            </span>
                        </Badge>

                        <Badge className="text-[#3366FF] border-[#3366FF] bg-[#F1F9FA] border px-2 py-1.25 h-fit w-fit">
                            <CircleUserIcon color="#3366FF" data-icon="inline-start" />
                            <span className="text-xs font-medium">
                                Junior
                            </span>
                        </Badge>

                        <Separator orientation="vertical" className="hidden sm:block h-4" />

                        <p className="text-[#A9ADB5] text-sm">112 Candidates</p>
                    </div>

                    <div className="space-y-1">
                        {/* Title */}
                        <h1 className="text-[#2D2F35] text-2xl sm:text-3xl font-bold">
                            Position Details
                        </h1>

                        {/* Description */}
                        <p className="text-[#707784] text-base sm:text-lg font-normal">Development Support Engineer / Application Support Engineer</p>
                    </div>

                    {/* Requirement section */}
                    <Accordion type="single" collapsible defaultValue="item-1">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="justify-start gap-1.5 text-[#A9ADB5] text-sm [&_svg]:ml-0!">
                                Required Tech Stack(s)
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-wrap gap-1.5 py-3 px-4 border-l-4 border-[#E2E4E6]">
                                {[
                                    "Playwright",
                                    "Cypress",
                                    "Selenium",
                                    "Postman",
                                    "Rest Assured",
                                    "K6",
                                    "Apache JMeter",
                                    "Jira",
                                    "TestTRail",
                                    "Git",
                                    "GitHub Actions",
                                    "Jenkins"
                                ].map((item, index) =>
                                    <Badge key={index} className="bg-[#F2F2F2] font-medium text-[#595F6A] text-xs py-1 px-2 h-fit w-fit">
                                        <DotIcon strokeWidth={8} data-icon="inline-start" />
                                        {item}
                                    </Badge>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* Filter section */}
                <div className="grid grid-cols-2 md:flex md:flex-row gap-3 md:gap-4 w-full">
                    {Object.entries(statusColorMap).map(([label, cfg], index) => {
                        const isActive = activeFilter === cfg.value;
                        return (
                            <Button
                                key={index}
                                variant="outline"
                                onClick={() => setActiveFilter(prev => prev === cfg.value ? "" : cfg.value)}
                                style={isActive ? { borderColor: cfg.color, backgroundColor: cfg.bgColor } : {}}
                                className="flex-1 w-full h-fit bg-[#FAFAFA] flex flex-col items-start gap-2 border-2 border-[#E2E4E6] px-4 py-3 rounded-lg"
                            >
                                <p className="text-sm text-[#595F6A] font-semibold">{label}</p>

                                <div className="w-full flex flex-row gap-2 items-center">
                                    <div
                                        style={{ backgroundColor: cfg.iconBg }}
                                        className="h-11 w-11 aspect-square border border-[#F1F9FA] flex justify-center items-center rounded-lg"
                                    >
                                        <CircleIcon size={48} fill={cfg.color} color={cfg.color}>
                                            <cfg.icon
                                                color={cfg.iconBg}
                                                size={16}
                                                strokeWidth={5}
                                                x={4}
                                                y={4}
                                            />
                                        </CircleIcon>
                                    </div>
                                    <p className="text-3xl font-bold min-w-[4ch] text-start text-[#43474F]">1</p>
                                </div>
                            </Button>
                        );
                    })}
                </div>

                {/* List section */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full sm:items-center">
                    <div className="flex items-center gap-2 flex-1 w-full">
                        <h4 className="text-sm text-[#A9ADB5]">List</h4>
                        <Separator orientation="horizontal" className="flex-1" />
                    </div>

                    <div className="flex flex-row gap-2 w-full sm:w-auto items-center justify-between sm:justify-end">
                        {/* Search input */}
                        <InputGroup className="w-full sm:w-auto shrink-0 flex-1 sm:flex-none">
                            <InputGroupInput
                                placeholder="Interview Title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <InputGroupAddon>
                                <SearchIcon />
                            </InputGroupAddon>
                        </InputGroup>

                        {/* Entries per page */}
                        <Select defaultValue="10">
                            <SelectTrigger className="w-fit min-w-16 border-0 shadow-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="10">10 Entries</SelectItem>
                                    <SelectItem value="50">15 Entries</SelectItem>
                                    <SelectItem value="100">20 Entries</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* List filter summary */}
                <div className="flex flex-row flex-wrap gap-2">
                    {[
                        activeFilter && { label: activeFilter, clear: () => setActiveFilter("") },
                        searchQuery && { label: searchQuery, clear: () => setSearchQuery("") },
                    ].filter(Boolean).map((item: any, index) => (
                        <Badge
                            key={index}
                            variant="outline"
                            onClick={item.clear}
                            className="text-[#595F6A] px-2 py-1.5 w-fit h-fit bg-[#F2F2F2] cursor-pointer"
                        >
                            <span className="text-xs">{item.label}</span>
                            <CircleXIcon data-icon="inline-end" />
                        </Badge>
                    ))}
                </div>

                {/* Candidate list */}
                <div className="flex flex-col divide-y divide-[#E2E4E6] gap-6">
                    {[
                        { status: "Strong Hire" },
                        { status: "Hire" },
                        { status: "Consider" },
                        { status: "Reject" },
                    ].map((item, index) => {
                        const { color, bgColor } = statusColorMap[item.status] ?? { color: "#A9ADB5", bgColor: "#F5F5F5" };
                        return (
                            <Card key={index} className="flex flex-row p-4 sm:px-1.25 sm:py-2 ring-0 items-center justify-between w-full">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center flex-1 gap-3 sm:gap-0 w-full">
                                    <div className="min-w-0 sm:min-w-30 w-full sm:w-auto">
                                        <Badge
                                            variant="outline"
                                            style={{ borderColor: color, color, backgroundColor: bgColor }}
                                            className="py-1 px-2 text-sm font-medium"
                                        >
                                            {item.status}
                                        </Badge>
                                    </div>

                                    <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-0 items-start sm:items-center justify-between pr-4">
                                        <div className="flex flex-col gap-1 sm:gap-2 justify-center flex-1">
                                            <p className="text-[#43474F] font-semibold text-lg">Dimas Kuncoro</p>
                                            <p className="text-sm">
                                                <span className="text-[#8C929D]">
                                                    Technical (19,6%)  •  Problem Solving (19,6%)  •  Communication (13,8%)
                                                </span>{" "}
                                                <span className="text-[#707784] font-medium whitespace-nowrap">Total Score (46%)</span>
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-0.5 sm:gap-2 justify-center shrink-0">
                                            <p className="text-[#A9ADB5] text-xs sm:text-sm font-medium">
                                                Interview Time:
                                            </p>
                                            <p className="text-[#707784] text-sm font-medium">
                                                04:05 | 22/04/2026
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Button variant="ghost" size="icon-lg" className="shrink-0">
                                    <ChevronRightIcon color="#0076D2" />
                                </Button>
                            </Card>
                        );
                    })}
                </div>

                {/* Footer Section */}
                <div className="flex w-full items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
                    {/* Showing entries */}
                    <p className="text-[#A9ADB5] italic text-sm text-center sm:text-left">Showing 1 to 10 of 24 entries</p>

                    {/* Pagination */}
                    <Pagination className="w-fit mx-0">
                        <PaginationContent className="[&_a[data-active='true']]:bg-[#DBF2F3] [&_a[data-active='true']]:text-[#0076D2]">
                            <PaginationItem>
                                <PaginationFirst href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationPrevious text="" href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" isActive className="">
                                    2
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext text="" href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLast href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </CardContent>
        </Card>
    );
}