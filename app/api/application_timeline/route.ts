// app/api/application_timeline/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma"; // Adjust path to your Prisma client

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            application_id,
            type,
            title,
            description,
            date, // optional, otherwise defaults to now
        } = body;

        if (!application_id || !type || !title) {
            return NextResponse.json(
                { error: "application_id, type, and title are required." },
                { status: 400 }
            );
        }

        const timelineEvent = await prisma.application_timeline.create({
            data: {
                application_id,
                type,
                title,
                description,
                date: date ? new Date(date) : undefined,
            },
        });

        return NextResponse.json({ timeline: timelineEvent }, { status: 201 });
    } catch (error) {
        console.error("Failed to create timeline event:", error);
        return NextResponse.json(
            { error: "Failed to create timeline event." },
            { status: 500 }
        );
    }
}
