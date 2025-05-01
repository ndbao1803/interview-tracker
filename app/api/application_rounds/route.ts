import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET: /api/application_rounds?applicationId=<id>
export async function GET(request: NextRequest) {
    try {
        const applicationId = request.nextUrl.searchParams.get("applicationId");

        if (!applicationId) {
            return NextResponse.json(
                { error: "Missing applicationId in query parameters" },
                { status: 400 }
            );
        }

        const rounds = await prisma.application_rounds.findMany({
            where: { application_id: applicationId },
            orderBy: { seq_no: "asc" },
        });

        return NextResponse.json({ rounds });
    } catch (error: any) {
        console.error("Error fetching application rounds:", error);
        return NextResponse.json(
            { error: error.message || "Unknown error" },
            { status: 500 }
        );
    }
}

// POST: create a new round
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            applicationId,
            seq_no,
            title,
            isFinish = false,
            feedback,
            note,
            date_time,
            duration_min,
            interviewer,
        } = body;

        if (!applicationId || !seq_no || !title) {
            return NextResponse.json(
                { error: "applicationId, seq_no, and title are required" },
                { status: 400 }
            );
        }

        const newRound = await prisma.application_rounds.create({
            data: {
                application_id: applicationId,
                seq_no,
                title,
                isFinish,
                feedback,
                note,
                date_time: date_time ? new Date(date_time) : undefined,
                duration_min,
                interviewer,
            },
        });

        return NextResponse.json({ round: newRound });
    } catch (error: any) {
        console.error("Error creating application round:", error);
        return NextResponse.json(
            { error: error.message || "Unknown error" },
            { status: 500 }
        );
    }
}
// PUT: update an existing round
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            id, // required
            ...data
        } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Round ID is required" },
                { status: 400 }
            );
        }

        // Clean up undefined values to prevent overwriting with null
        const sanitizedData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== undefined)
        );

        const updatedRound = await prisma.application_rounds.update({
            where: { id },
            data: sanitizedData,
        });

        return NextResponse.json({ round: updatedRound });
    } catch (error: any) {
        console.error("Error updating application round:", error);
        return NextResponse.json(
            { error: error.message || "Unknown error" },
            { status: 500 }
        );
    }
}
