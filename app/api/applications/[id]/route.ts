import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const application = await prisma.applications.findUnique({
            where: { id },
            include: {
                users: true,
                positions: {
                    include: {
                        companies: {
                            include: {
                                industry: true,
                            },
                        },
                    },
                },
                tags: {
                    include: {
                        tags: true,
                    },
                },
                interview_rounds: true,
                notes: {
                    orderBy: { created_at: "desc" },
                },
                timeline: {
                    orderBy: { date: "desc" },
                    include: {
                        status: true,
                    },
                },
                status: true,
            },
        });

        if (!application) {
            return NextResponse.json(
                { error: "Application not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ application });
    } catch (error: any) {
        console.error("Error fetching application detail:", error);
        return NextResponse.json(
            { error: error.message || "Unknown error" },
            { status: 500 }
        );
    }
}
