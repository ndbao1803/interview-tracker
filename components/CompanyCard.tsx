import Link from "next/link";
import { Building2, MapPin, Users, Clock, BarChart } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface Company {
    id: string;
    name: string;
    industry: string;
    location: string;
    logo: string;
    applicationsCount: number;
    openPositions: number;
    averageResponseTime: string;
    successRate: number;
}

interface CompanyCardProps {
    company: Company;
    viewMode: "grid" | "list";
}

export function CompanyCard({ company, viewMode }: CompanyCardProps) {
    if (viewMode === "list") {
        return (
            <Card className="bg-background border-foreground/10 text-[#cccccc] hover:border-[#0e639c] transition-colors">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <img
                                src={company.logo || "/placeholder.svg"}
                                alt={`${company.name} logo`}
                                className="h-10 w-10 rounded-md bg-[#1e1e1e] p-1"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium truncate">
                                        {company.name}
                                    </h3>
                                    <div className="flex items-center text-xs text-[#8a8a8a] mt-1">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        <span className="truncate">
                                            {company.location}
                                        </span>
                                    </div>
                                </div>
                                <Badge className="bg-[#1e1e1e] text-[#cccccc] border-[#3c3c3c]">
                                    {company.industry}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-3">
                                <div>
                                    <div className="flex items-center text-xs text-[#8a8a8a]">
                                        <Users className="h-3 w-3 mr-1" />
                                        Applications
                                    </div>
                                    <p className="text-sm font-medium">
                                        {company.applicationsCount}
                                    </p>
                                </div>
                                <div>
                                    <div className="flex items-center text-xs text-[#8a8a8a]">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Avg. Response
                                    </div>
                                    <p className="text-sm font-medium">
                                        {company.averageResponseTime}
                                    </p>
                                </div>
                                <div>
                                    <div className="flex items-center text-xs text-[#8a8a8a]">
                                        <BarChart className="h-3 w-3 mr-1" />
                                        Success Rate
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium">
                                            {company.successRate}%
                                        </p>
                                        <Progress
                                            value={company.successRate}
                                            className="h-1.5 w-16 bg-[#3c3c3c]"
                                            indicatorClassName="bg-[#0e639c]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e]"
                                asChild
                            >
                                <Link
                                    href={`/dashboard/companies/${company.id}`}
                                >
                                    View Details
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-background border-foreground/10 text-[#cccccc] hover:border-[#0e639c] transition-colors">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <img
                            src={company.logo || "/placeholder.svg"}
                            alt={`${company.name} logo`}
                            className="h-10 w-10 rounded-md bg-[#1e1e1e] p-1"
                        />
                        <div>
                            <h3 className="font-medium">{company.name}</h3>
                            <div className="flex items-center text-xs text-[#8a8a8a] mt-0.5">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{company.location}</span>
                            </div>
                        </div>
                    </div>
                    <Badge className="bg-[#1e1e1e] text-[#cccccc] border-[#3c3c3c]">
                        {company.industry}
                    </Badge>
                </div>

                <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-[#8a8a8a]" />
                            Applications
                        </div>
                        <span className="font-medium">
                            {company.applicationsCount}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm">
                            <Building2 className="h-4 w-4 mr-2 text-[#8a8a8a]" />
                            Open Positions
                        </div>
                        <span className="font-medium">
                            {company.openPositions}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-[#8a8a8a]" />
                            Avg. Response Time
                        </div>
                        <span className="font-medium">
                            {company.averageResponseTime}
                        </span>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center text-sm">
                                <BarChart className="h-4 w-4 mr-2 text-[#8a8a8a]" />
                                Success Rate
                            </div>
                            <span className="font-medium">
                                {company.successRate}%
                            </span>
                        </div>
                        <Progress
                            value={company.successRate}
                            className="h-2 bg-[#3c3c3c]"
                            indicatorClassName="bg-[#0e639c]"
                        />
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full bg-[#2d2d2d] hover:bg-[#3e3e3e] border border-[#3c3c3c]"
                    variant="outline"
                    asChild
                >
                    <Link href={`/dashboard/companies/${company.id}`}>
                        View Details
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
