"use client";

import { useState } from "react";
import {
    Search,
    Filter,
    ChevronDown,
    Building2,
    Briefcase,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CompanyCard } from "@/components/CompanyCard";
import { Pagination } from "@/components/ui/pagination";
import SharedLayout from "@/components/SharedLayout";
import CompaniesDashboardComponent from "@/components/companies/DashBoard";
// Mock data for companies
const mockCompanies = [
    {
        id: "1",
        name: "Google",
        industry: "Technology",
        location: "Mountain View, CA",
        logo: "https://static.cdnlogo.com/logos/g/35/google-icon.svg",
        applicationsCount: 156,
        openPositions: 12,
        averageResponseTime: "5 days",
        successRate: 22,
    },
    {
        id: "2",
        name: "Microsoft",
        industry: "Technology",
        location: "Redmond, WA",
        logo: "https://static.cdnlogo.com/logos/m/6/microsoft.svg",
        applicationsCount: 132,
        openPositions: 8,
        averageResponseTime: "7 days",
        successRate: 18,
    },
    {
        id: "3",
        name: "Amazon",
        industry: "E-commerce",
        location: "Seattle, WA",
        logo: "https://static.cdnlogo.com/logos/a/5/amazon.png",
        applicationsCount: 201,
        openPositions: 15,
        averageResponseTime: "10 days",
        successRate: 12,
    },
    {
        id: "4",
        name: "Apple",
        industry: "Technology",
        location: "Cupertino, CA",
        logo: "/placeholder.svg?height=40&width=40",
        applicationsCount: 98,
        openPositions: 6,
        averageResponseTime: "14 days",
        successRate: 15,
    },
    {
        id: "5",
        name: "Netflix",
        industry: "Entertainment",
        location: "Los Gatos, CA",
        logo: "/placeholder.svg?height=40&width=40",
        applicationsCount: 67,
        openPositions: 4,
        averageResponseTime: "8 days",
        successRate: 9,
    },
    {
        id: "6",
        name: "Meta",
        industry: "Technology",
        location: "Menlo Park, CA",
        logo: "/placeholder.svg?height=40&width=40",
        applicationsCount: 112,
        openPositions: 9,
        averageResponseTime: "6 days",
        successRate: 14,
    },
    {
        id: "7",
        name: "IBM",
        industry: "Technology",
        location: "Armonk, NY",
        logo: "/placeholder.svg?height=40&width=40",
        applicationsCount: 78,
        openPositions: 7,
        averageResponseTime: "12 days",
        successRate: 11,
    },
    {
        id: "8",
        name: "Adobe",
        industry: "Software",
        location: "San Jose, CA",
        logo: "/placeholder.svg?height=40&width=40",
        applicationsCount: 54,
        openPositions: 5,
        averageResponseTime: "9 days",
        successRate: 13,
    },
    {
        id: "9",
        name: "Salesforce",
        industry: "Software",
        location: "San Francisco, CA",
        logo: "/placeholder.svg?height=40&width=40",
        applicationsCount: 89,
        openPositions: 8,
        averageResponseTime: "7 days",
        successRate: 16,
    },
    {
        id: "10",
        name: "Oracle",
        industry: "Technology",
        location: "Austin, TX",
        logo: "/placeholder.svg?height=40&width=40",
        applicationsCount: 65,
        openPositions: 6,
        averageResponseTime: "11 days",
        successRate: 10,
    },
    {
        id: "11",
        name: "Intel",
        industry: "Hardware",
        location: "Santa Clara, CA",
        logo: "/placeholder.svg?height=40&width=40",
        applicationsCount: 43,
        openPositions: 4,
        averageResponseTime: "13 days",
        successRate: 8,
    },
    {
        id: "12",
        name: "Cisco",
        industry: "Networking",
        location: "San Jose, CA",
        logo: "/placeholder.svg?height=40&width=40",
        applicationsCount: 51,
        openPositions: 5,
        averageResponseTime: "10 days",
        successRate: 12,
    },
    {
        id: "13",
        name: "Tesla",
        industry: "Automotive",
        location: "Palo Alto, CA",
        logo: "/placeholder.svg?height=40&width=40",
        applicationsCount: 76,
        openPositions: 7,
        averageResponseTime: "8 days",
        successRate: 11,
    },
    {
        id: "14",
        name: "Uber",
        industry: "Transportation",
        location: "San Francisco, CA",
        logo: "/placeholder.svg?height=40&width=40",
        applicationsCount: 62,
        openPositions: 5,
        averageResponseTime: "9 days",
        successRate: 9,
    },
    {
        id: "15",
        name: "Airbnb",
        industry: "Hospitality",
        location: "San Francisco, CA",
        logo: "/placeholder.svg?height=40&width=40",
        applicationsCount: 48,
        openPositions: 4,
        averageResponseTime: "7 days",
        successRate: 13,
    },
];

export default function CompaniesDashboard() {
    return (
        <SharedLayout>
            <main className="bg-gradient-to-b from-background to-muted h-full">
                <section className="w-full py-6 md:py-12 lg:py-24 to-muted">
                    <div className="container px-4 md:px-6">
                        <div className="p-4">
                            <div className="mb-4">
                                <h1 className="text-xl font-semibold">
                                    Companies
                                </h1>
                                <p className="text-sm text-[#8a8a8a]">
                                    Browse and filter companies by industry and
                                    application statistics
                                </p>
                            </div>
                            <CompaniesDashboardComponent />
                        </div>
                    </div>
                </section>
            </main>
        </SharedLayout>
    );
}
