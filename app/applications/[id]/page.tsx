"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
    ArrowLeft,
    Building2,
    Edit,
    ExternalLink,
    FileText,
    MapPin,
    MoreHorizontal,
    Plus,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApplicationSankey } from "@/components/applications/application-sankey";
import { ApplicationTimeline } from "@/components/applications/application-timeline";
import { InterviewRoundsList } from "@/components/applications/interview-rounds-list";
import { ApplicationNotes } from "@/components/applications/application-notes";
import { UpdateStatusDialog } from "@/components/applications/update-status-dialog";
import SharedLayout from "@/components/SharedLayout";
// import { AddInterviewRoundDialog } from "@/components/applications/add-interview-round-dialog";

interface ApplicationDetailPageProps {
    params: {
        id: string;
    };
}

export default function ApplicationDetailPage({
    params,
}: ApplicationDetailPageProps) {
    const router = useRouter();
    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
    const [addRoundOpen, setAddRoundOpen] = useState(false);

    // Fetch application data
    useEffect(() => {
        const fetchApplication = async () => {
            setLoading(true);
            try {
                // In a real app, this would be an API call
                // For now, we'll use mock data
                setTimeout(() => {
                    const mockApplication = {
                        id: params.id,
                        position: "Senior Frontend Developer",
                        company: {
                            id: "c1",
                            name: "TechCorp",
                            industry: "Technology",
                            location: "San Francisco, CA",
                            website: "https://techcorp.example.com",
                            logo: "/placeholder.svg?height=80&width=80&text=TC",
                        },
                        status: "Interview",
                        source_channel: "LinkedIn",
                        applied_date: "2023-12-15",
                        current_round: 2,
                        total_rounds: 4,
                        tags: ["Remote", "Urgent", "Dream Job"],
                        salary_range: "$120,000 - $150,000",
                        job_description:
                            "We are looking for a Senior Frontend Developer to join our team. The ideal candidate will have experience with React, TypeScript, and modern frontend frameworks.",
                        notes: [
                            {
                                id: "n1",
                                content:
                                    "Initial application submitted through LinkedIn. Position looks like a great fit for my skills.",
                                created_at: "2023-12-15T10:30:00Z",
                            },
                            {
                                id: "n2",
                                content:
                                    "Received email confirmation. They mentioned they're looking for someone with strong TypeScript experience.",
                                created_at: "2023-12-16T14:20:00Z",
                            },
                            {
                                id: "n3",
                                content:
                                    "Preparing for technical interview. Need to review React hooks, TypeScript generics, and system design concepts.",
                                created_at: "2023-12-20T09:15:00Z",
                            },
                        ],
                        interview_rounds: [
                            {
                                id: "ir1",
                                round_number: 1,
                                status: "Completed",
                                title: "Initial Screening",
                                date: "2023-12-18T15:00:00Z",
                                duration: 30,
                                interviewer: "Sarah Johnson, HR Manager",
                                feedback:
                                    "Positive initial screening. They liked my background and experience with React. Moving to technical interview.",
                                notes: "Questions focused on past experience, team collaboration, and why I'm interested in the company.",
                            },
                            {
                                id: "ir2",
                                round_number: 2,
                                status: "Scheduled",
                                title: "Technical Interview",
                                date: "2023-12-22T14:00:00Z",
                                duration: 60,
                                interviewer:
                                    "Michael Chen, Senior Engineering Manager",
                                feedback: "",
                                notes: "Will include coding challenges and system design questions. Need to prepare for React, TypeScript, and frontend architecture questions.",
                            },
                        ],
                        contacts: [
                            {
                                id: "c1",
                                name: "Sarah Johnson",
                                role: "HR Manager",
                                email: "sarah.johnson@techcorp.example.com",
                                phone: "+1 (555) 123-4567",
                            },
                            {
                                id: "c2",
                                name: "Michael Chen",
                                role: "Senior Engineering Manager",
                                email: "michael.chen@techcorp.example.com",
                                phone: "+1 (555) 987-6543",
                            },
                        ],
                        timeline_events: [
                            {
                                id: "te1",
                                type: "application",
                                title: "Application Submitted",
                                date: "2023-12-15T10:30:00Z",
                                description:
                                    "Applied for Senior Frontend Developer position via LinkedIn",
                            },
                            {
                                id: "te2",
                                type: "note",
                                title: "Application Confirmation",
                                date: "2023-12-16T14:20:00Z",
                                description:
                                    "Received confirmation email from HR",
                            },
                            {
                                id: "te3",
                                type: "interview",
                                title: "Initial Screening",
                                date: "2023-12-18T15:00:00Z",
                                description:
                                    "Completed 30-minute screening call with Sarah Johnson",
                            },
                            {
                                id: "te4",
                                type: "status_change",
                                title: "Status Updated",
                                date: "2023-12-19T09:00:00Z",
                                description:
                                    "Application status changed from 'Screening' to 'Interview'",
                            },
                            {
                                id: "te5",
                                type: "note",
                                title: "Interview Preparation",
                                date: "2023-12-20T09:15:00Z",
                                description:
                                    "Made notes on technical topics to review before the interview",
                            },
                        ],
                    };

                    setApplication(mockApplication);
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Error fetching application:", error);
                setLoading(false);
            }
        };

        fetchApplication();
    }, [params.id]);

    // Handle status update
    const handleStatusUpdate = (newStatus: string) => {
        setApplication((prev: any) => ({
            ...prev,
            status: newStatus,
            timeline_events: [
                ...prev.timeline_events,
                {
                    id: `te${prev.timeline_events.length + 1}`,
                    type: "status_change",
                    title: "Status Updated",
                    date: new Date().toISOString(),
                    description: `Application status changed from '${prev.status}' to '${newStatus}'`,
                },
            ],
        }));
        setUpdateStatusOpen(false);
    };

    // Handle add interview round
    const handleAddInterviewRound = (newRound: any) => {
        const roundNumber = application.interview_rounds.length + 1;
        const newInterviewRound = {
            id: `ir${application.interview_rounds.length + 1}`,
            round_number: roundNumber,
            ...newRound,
        };

        setApplication((prev: any) => ({
            ...prev,
            current_round: roundNumber,
            interview_rounds: [...prev.interview_rounds, newInterviewRound],
            timeline_events: [
                ...prev.timeline_events,
                {
                    id: `te${prev.timeline_events.length + 1}`,
                    type: "interview",
                    title: `Interview Round ${roundNumber} Added`,
                    date: new Date().toISOString(),
                    description: `Added ${
                        newRound.title
                    } scheduled for ${format(new Date(newRound.date), "PPP")}`,
                },
            ],
        }));
        setAddRoundOpen(false);
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Applied":
                return "bg-blue-900 text-blue-100";
            case "Screening":
                return "bg-purple-900 text-purple-100";
            case "Interview":
                return "bg-yellow-900 text-yellow-100";
            case "Offer":
                return "bg-green-900 text-green-100";
            case "Rejected":
                return "bg-red-900 text-red-100";
            case "Withdrawn":
                return "bg-gray-900 text-gray-100";
            default:
                return "bg-[#3c3c3c] text-[#cccccc]";
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "PPP");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0e639c]"></div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="h-16 w-16 rounded-full bg-[#252526] flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-[#8a8a8a]" />
                </div>
                <h3 className="text-lg font-medium">Application not found</h3>
                <p className="text-sm text-[#8a8a8a] mt-1 mb-4">
                    The application you're looking for doesn't exist or has been
                    removed.
                </p>
                <Button className="bg-[#0e639c] hover:bg-[#1177bb]" asChild>
                    <Link href="/applications">Back to Applications</Link>
                </Button>
            </div>
        );
    }

    return (
        <SharedLayout>
            <main className=" to-muted h-full">
                <section className="w-full py-6 md:py-12 lg:py-24">
                    <div className="container px-4 md:px-6 flex h-full">
                        <div className="p-4">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-[#8a8a8a] hover:text-[#cccccc]"
                                        asChild
                                    >
                                        <Link href="/applications">
                                            <ArrowLeft className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <h1 className="text-xl font-semibold">
                                        {application.position}
                                    </h1>
                                    <Badge
                                        className={getStatusColor(
                                            application.status
                                        )}
                                    >
                                        {application.status}
                                    </Badge>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e]"
                                        onClick={() =>
                                            setUpdateStatusOpen(true)
                                        }
                                    >
                                        Update Status
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e]"
                                        onClick={() => setAddRoundOpen(true)}
                                    >
                                        <Plus className="mr-1 h-4 w-4" />
                                        Add Interview Round
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="border-[#3c3c3c] bg-[#252526] text-[#cccccc]"
                                        >
                                            <DropdownMenuItem>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit Application
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <FileText className="mr-2 h-4 w-4" />
                                                Export Details
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-[#3c3c3c]" />
                                            <DropdownMenuItem className="text-red-400">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete Application
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="mb-6"
                            >
                                <TabsList className="bg-[#252526] border border-[#3c3c3c]">
                                    <TabsTrigger value="overview">
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger value="timeline">
                                        Timeline
                                    </TabsTrigger>
                                    <TabsTrigger value="interviews">
                                        Interviews
                                    </TabsTrigger>
                                    <TabsTrigger value="notes">
                                        Notes
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>

                            {/* Main Content */}
                            <div className="space-y-6">
                                {activeTab === "overview" && (
                                    <>
                                        {/* Company and Position Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* Company Card */}
                                            <Card className="bg-[#252526] border-[#3c3c3c] text-[#cccccc] md:col-span-1">
                                                <CardHeader className="flex flex-row items-start space-y-0 pb-2">
                                                    <div className="flex-1">
                                                        <CardTitle className="text-base">
                                                            Company
                                                        </CardTitle>
                                                        <CardDescription className="text-[#8a8a8a]">
                                                            Company details
                                                        </CardDescription>
                                                    </div>
                                                    <div className="h-12 w-12 rounded-md bg-[#1e1e1e] flex items-center justify-center overflow-hidden">
                                                        <img
                                                            src={
                                                                application
                                                                    .company
                                                                    .logo ||
                                                                "/placeholder.svg"
                                                            }
                                                            alt={
                                                                application
                                                                    .company
                                                                    .name
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h3 className="font-medium text-base">
                                                                {
                                                                    application
                                                                        .company
                                                                        .name
                                                                }
                                                            </h3>
                                                            <div className="flex items-center text-sm text-[#8a8a8a] mt-1">
                                                                <Building2 className="h-3 w-3 mr-1" />
                                                                <span>
                                                                    {
                                                                        application
                                                                            .company
                                                                            .industry
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center text-sm text-[#8a8a8a] mt-1">
                                                                <MapPin className="h-3 w-3 mr-1" />
                                                                <span>
                                                                    {
                                                                        application
                                                                            .company
                                                                            .location
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {application.company
                                                            .website && (
                                                            <div className="pt-2">
                                                                <a
                                                                    href={
                                                                        application
                                                                            .company
                                                                            .website
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm text-[#0e639c] hover:underline flex items-center"
                                                                >
                                                                    Visit
                                                                    Website
                                                                    <ExternalLink className="h-3 w-3 ml-1" />
                                                                </a>
                                                            </div>
                                                        )}

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full mt-2 border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e]"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/dashboard/companies/${application.company.id}`}
                                                            >
                                                                View Company
                                                                Details
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Position Details */}
                                            <Card className="bg-[#252526] border-[#3c3c3c] text-[#cccccc] md:col-span-2">
                                                <CardHeader>
                                                    <CardTitle className="text-base">
                                                        Position Details
                                                    </CardTitle>
                                                    <CardDescription className="text-[#8a8a8a]">
                                                        Information about the
                                                        position
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <h4 className="text-xs text-[#8a8a8a]">
                                                                    Applied Date
                                                                </h4>
                                                                <p className="text-sm">
                                                                    {formatDate(
                                                                        application.applied_date
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xs text-[#8a8a8a]">
                                                                    Source
                                                                </h4>
                                                                <p className="text-sm">
                                                                    {
                                                                        application.source_channel
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xs text-[#8a8a8a]">
                                                                    Salary Range
                                                                </h4>
                                                                <p className="text-sm">
                                                                    {application.salary_range ||
                                                                        "Not specified"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xs text-[#8a8a8a]">
                                                                    Current
                                                                    Round
                                                                </h4>
                                                                <p className="text-sm">
                                                                    {
                                                                        application.current_round
                                                                    }{" "}
                                                                    of{" "}
                                                                    {
                                                                        application.total_rounds
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {application.tags &&
                                                            application.tags
                                                                .length > 0 && (
                                                                <div>
                                                                    <h4 className="text-xs text-[#8a8a8a] mb-1">
                                                                        Tags
                                                                    </h4>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {application.tags.map(
                                                                            (
                                                                                tag: string,
                                                                                index: number
                                                                            ) => (
                                                                                <Badge
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    variant="outline"
                                                                                    className="text-xs py-0 px-1.5 h-5 bg-[#2d2d2d] border-[#3c3c3c]"
                                                                                >
                                                                                    {
                                                                                        tag
                                                                                    }
                                                                                </Badge>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                        {application.job_description && (
                                                            <div>
                                                                <h4 className="text-xs text-[#8a8a8a] mb-1">
                                                                    Job
                                                                    Description
                                                                </h4>
                                                                <p className="text-sm whitespace-pre-line">
                                                                    {
                                                                        application.job_description
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Application Progress */}
                                        <Card className="bg-[#252526] border-[#3c3c3c] text-[#cccccc]">
                                            <CardHeader>
                                                <CardTitle className="text-base">
                                                    Application Progress
                                                </CardTitle>
                                                <CardDescription className="text-[#8a8a8a]">
                                                    Visualization of your
                                                    application journey
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="h-[400px]">
                                                    <ApplicationSankey
                                                        application={
                                                            application
                                                        }
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Contacts */}
                                        {application.contacts &&
                                            application.contacts.length > 0 && (
                                                <Card className="bg-[#252526] border-[#3c3c3c] text-[#cccccc]">
                                                    <CardHeader>
                                                        <CardTitle className="text-base">
                                                            Contacts
                                                        </CardTitle>
                                                        <CardDescription className="text-[#8a8a8a]">
                                                            People involved in
                                                            your application
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {application.contacts.map(
                                                                (
                                                                    contact: any
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            contact.id
                                                                        }
                                                                        className="flex items-start gap-3 p-3 rounded-md border border-[#3c3c3c] bg-[#1e1e1e]"
                                                                    >
                                                                        <div className="h-10 w-10 rounded-full bg-[#0e639c] flex items-center justify-center text-white font-medium">
                                                                            {contact.name
                                                                                .split(
                                                                                    " "
                                                                                )
                                                                                .map(
                                                                                    (
                                                                                        n: string
                                                                                    ) =>
                                                                                        n[0]
                                                                                )
                                                                                .join(
                                                                                    ""
                                                                                )}
                                                                        </div>
                                                                        <div>
                                                                            <h3 className="font-medium">
                                                                                {
                                                                                    contact.name
                                                                                }
                                                                            </h3>
                                                                            <p className="text-xs text-[#8a8a8a]">
                                                                                {
                                                                                    contact.role
                                                                                }
                                                                            </p>
                                                                            <div className="mt-1 space-y-1">
                                                                                <a
                                                                                    href={`mailto:${contact.email}`}
                                                                                    className="text-xs text-[#0e639c] hover:underline block"
                                                                                >
                                                                                    {
                                                                                        contact.email
                                                                                    }
                                                                                </a>
                                                                                {contact.phone && (
                                                                                    <a
                                                                                        href={`tel:${contact.phone}`}
                                                                                        className="text-xs text-[#0e639c] hover:underline block"
                                                                                    >
                                                                                        {
                                                                                            contact.phone
                                                                                        }
                                                                                    </a>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                    </>
                                )}

                                {activeTab === "timeline" && (
                                    <Card className="bg-[#252526] border-[#3c3c3c] text-[#cccccc]">
                                        <CardHeader>
                                            <CardTitle className="text-base">
                                                Application Timeline
                                            </CardTitle>
                                            <CardDescription className="text-[#8a8a8a]">
                                                Chronological view of your
                                                application journey
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ApplicationTimeline
                                                events={
                                                    application.timeline_events
                                                }
                                            />
                                        </CardContent>
                                    </Card>
                                )}

                                {activeTab === "interviews" && (
                                    <Card className="bg-[#252526] border-[#3c3c3c] text-[#cccccc]">
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <div>
                                                <CardTitle className="text-base">
                                                    Interview Rounds
                                                </CardTitle>
                                                <CardDescription className="text-[#8a8a8a]">
                                                    Track your progress through
                                                    interview stages
                                                </CardDescription>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e]"
                                                onClick={() =>
                                                    setAddRoundOpen(true)
                                                }
                                            >
                                                <Plus className="mr-1 h-4 w-4" />
                                                Add Round
                                            </Button>
                                        </CardHeader>
                                        <CardContent>
                                            <InterviewRoundsList
                                                rounds={
                                                    application.interview_rounds
                                                }
                                            />
                                        </CardContent>
                                    </Card>
                                )}

                                {activeTab === "notes" && (
                                    <Card className="bg-[#252526] border-[#3c3c3c] text-[#cccccc]">
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <div>
                                                <CardTitle className="text-base">
                                                    Notes
                                                </CardTitle>
                                                <CardDescription className="text-[#8a8a8a]">
                                                    Your notes about this
                                                    application
                                                </CardDescription>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e]"
                                            >
                                                <Plus className="mr-1 h-4 w-4" />
                                                Add Note
                                            </Button>
                                        </CardHeader>
                                        <CardContent>
                                            <ApplicationNotes
                                                notes={application.notes}
                                            />
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* Update Status Dialog */}
                            <UpdateStatusDialog
                                open={updateStatusOpen}
                                onOpenChange={setUpdateStatusOpen}
                                currentStatus={application.status}
                                onUpdate={handleStatusUpdate}
                            />

                            {/* Add Interview Round Dialog */}
                            {/* <AddInterviewRoundDialog
                open={addRoundOpen}
                onOpenChange={setAddRoundOpen}
                onAddRound={handleAddInterviewRound}
                roundNumber={application.interview_rounds.length + 1}
            /> */}
                        </div>
                    </div>
                </section>
            </main>
        </SharedLayout>
    );
}
