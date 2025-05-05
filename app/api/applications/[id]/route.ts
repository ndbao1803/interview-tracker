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
                application_rounds: {
                    orderBy: { seq_no: "asc" },
                },
                notes: {
                    orderBy: { created_at: "desc" },
                },
                timeline: {
                    orderBy: { date: "desc" },
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
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        // Optional: define exactly which fields are allowed to be updated
        const {
            position_id,
            user_id,
            note,
            source_channel,
            status_id,
            applied_date,
            current_round,
            rejected_round,
        } = body;

        // Construct update object while ignoring undefined fields
        const updateData = Object.fromEntries(
            Object.entries({
                position_id,
                user_id,
                note,
                source_channel,
                status_id,
                applied_date: applied_date ? new Date(applied_date) : undefined,
                current_round,
                rejected_round,
            }).filter(([_, v]) => v !== undefined)
        );

        const updatedApplication = await prisma.applications.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ application: updatedApplication });
    } catch (error: any) {
        console.error("Error updating application:", error);
        return NextResponse.json(
            { error: error.message || "Unknown error" },
            { status: 500 }
        );
    }
}
