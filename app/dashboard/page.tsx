"use client";

import { useState } from "react";
import {
    Plus,
    Filter,
    Calendar,
    BarChart3,
    TrendingUp,
    Building2,
    Briefcase,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InterviewFlow } from "@/components/dashboard/interview-flow";
import { AddApplicationDialog } from "@/components/dashboard/add-application-dialog";
import { ApplicationTimeline } from "@/components/dashboard/application-timeline";
import { ApplicationsByIndustry } from "@/components/dashboard/applications-by-industry";
import { ApplicationsBySource } from "@/components/dashboard/applications-by-source";
import { ApplicationsByStatus } from "@/components/dashboard/applications-by-status";
import { InterviewRoundSuccess } from "@/components/dashboard/interview-round-success";
import { RecentApplications } from "@/components/dashboard/recent-applications";
import { UpcomingInterviews } from "@/components/dashboard/upcoming-interviews";
import { ApplicationTagsFilter } from "@/components/dashboard/application-tags-filter";
import SharedLayout from "@/components/SharedLayout";

export default function DashboardPage() {
    const [addApplicationOpen, setAddApplicationOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<
        "all" | "week" | "month" | "quarter"
    >("month");

    // Mock tags data
    const tags = [
        { id: "1", name: "Remote" },
        { id: "2", name: "Onsite" },
        { id: "3", name: "Urgent" },
        { id: "4", name: "Dream Job" },
        { id: "5", name: "Networking" },
        { id: "6", name: "Referral" },
    ];

    const handleTagToggle = (tagId: string) => {
        setSelectedTags((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId]
        );
    };

    return (
        <SharedLayout>
            <main className="bg-gradient-to-b from-background to-muted h-full">
                <section className="w-full py-6 md:py-12 lg:py-24 to-muted">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ">
                            <div>
                                <h1 className="text-xl font-semibold">
                                    Application Dashboard
                                </h1>
                                <p className="text-sm text-[#8a8a8a]">
                                    Track and analyze your job application
                                    progress
                                </p>
                            </div>
                            <div className="flex gap-2  sm:w-auto">
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-primary hover:bg-primary w-full sm:w-auto"
                                    onClick={() => setAddApplicationOpen(true)}
                                >
                                    <Plus className="mr-1 h-4 w-4" />
                                    New Application
                                </Button>
                            </div>
                        </div>

                        {/* Date Range Selector */}
                        <div className="flex justify-end my-4">
                            <Tabs
                                defaultValue="month"
                                value={dateRange}
                                onValueChange={(v) => setDateRange(v as any)}
                            >
                                <TabsList className="bg-background border border-foreground/10">
                                    <TabsTrigger value="week">
                                        This Week
                                    </TabsTrigger>
                                    <TabsTrigger value="month">
                                        This Month
                                    </TabsTrigger>
                                    <TabsTrigger value="quarter">
                                        This Quarter
                                    </TabsTrigger>
                                    <TabsTrigger value="all">
                                        All Time
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* Tags Filter */}
                        <ApplicationTagsFilter
                            tags={tags}
                            selectedTags={selectedTags}
                            onTagToggle={handleTagToggle}
                        />

                        {/* Stats Overview */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-4">
                            <Card className="bg-background border-foreground/10 text-[#cccccc]">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Applications
                                    </CardTitle>
                                    <Briefcase className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">24</div>
                                    <div className="flex items-center text-xs text-[#8a8a8a]">
                                        <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                                        <span>+4 this {dateRange}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-background border-foreground/10 text-[#cccccc]">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Active Interviews
                                    </CardTitle>
                                    <Calendar className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">8</div>
                                    <div className="flex items-center text-xs text-[#8a8a8a]">
                                        <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                                        <span>3 scheduled this week</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-background border-foreground/10 text-[#cccccc]">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Companies
                                    </CardTitle>
                                    <Building2 className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">12</div>
                                    <div className="flex items-center text-xs text-[#8a8a8a]">
                                        <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                                        <span>+2 this {dateRange}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-background border-foreground/10 text-[#cccccc]">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Success Rate
                                    </CardTitle>
                                    <BarChart3 className="h-4 w-4 text-primary" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        18%
                                    </div>
                                    <Progress
                                        value={18}
                                        className="h-2 mt-2 bg-primary"
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Application Flow */}
                        <Card className="bg-background border-foreground/10 text-[#cccccc] my-4">
                            <CardHeader>
                                <CardTitle>Application Flow</CardTitle>
                                <CardDescription className="text-[#8a8a8a]">
                                    Track your applications through the
                                    interview process
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[400px]">
                                    <InterviewFlow />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Charts Grid */}
                        <div className="grid gap-4 md:grid-cols-2 my-4">
                            <Card className="bg-background border-foreground/10 text-[#cccccc]">
                                <CardHeader>
                                    <CardTitle>
                                        Applications by Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ApplicationsByStatus />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-background border-foreground/10 text-[#cccccc] ">
                                <CardHeader>
                                    <CardTitle>
                                        Applications by Industry
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ApplicationsByIndustry />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* More Charts */}
                        <div className="grid gap-4 md:grid-cols-2 my-4">
                            <Card className="bg-background border-foreground/10 text-[#cccccc]">
                                <CardHeader>
                                    <CardTitle>
                                        Applications by Source
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ApplicationsBySource />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-background border-foreground/10 text-[#cccccc]">
                                <CardHeader>
                                    <CardTitle>
                                        Interview Round Success Rate
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <InterviewRoundSuccess />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Timeline */}
                        <Card className="bg-background border-foreground/10 text-[#cccccc] my-4">
                            <CardHeader>
                                <CardTitle>Application Timeline</CardTitle>
                                <CardDescription className="text-[#8a8a8a]">
                                    Chronological view of your application
                                    activities
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] overflow-y-auto">
                                    <ApplicationTimeline />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Applications and Upcoming Interviews */}
                        <div className="grid gap-4 md:grid-cols-2 my-4">
                            <RecentApplications />
                            <UpcomingInterviews />
                        </div>

                        {/* Add Application Dialog */}
                        <AddApplicationDialog
                            open={addApplicationOpen}
                            onClose={() => setAddApplicationOpen(false)}
                        />
                    </div>
                </section>
            </main>
        </SharedLayout>
    );
}
