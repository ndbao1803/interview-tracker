import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const positionId = searchParams.get("positionId");
        const userId = searchParams.get("userId");

        // Build where clause dynamically
        const whereClause: any = {};
        if (positionId) whereClause.position_id = positionId;
        if (userId) whereClause.user_id = userId;

        // Fetch applications
        const applications = await prisma.applications.findMany({
            where: whereClause,
            include: {
                positions: {
                    include: {
                        companies: true,
                    },
                },
                users: true,
                tags: {
                    include: {
                        tags: true,
                    },
                },
                interview_rounds: true,
            },
            orderBy: {
                applied_date: "desc",
            },
        });

        return NextResponse.json({ applications });
    } catch (error: any) {
        console.error("Error fetching applications:", error);
        return NextResponse.json(
            { error: error.message || "Unknown error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, positionId, note, source_channel, tags } = body;

        if (!positionId) {
            return NextResponse.json(
                { error: "Position ID is required" },
                { status: 400 }
            );
        }

        // Create the application
        const application = await prisma.applications.create({
            data: {
                user_id: userId,
                position_id: positionId,
                note,
                source_channel,
                tags:
                    tags && tags.length > 0
                        ? {
                              create: tags.map((tagId: string) => ({
                                  tags: { connect: { id: tagId } },
                              })),
                          }
                        : undefined,
            },
            include: {
                positions: {
                    include: {
                        companies: true,
                    },
                },
                users: true,
                tags: {
                    include: {
                        tags: true,
                    },
                },
                interview_rounds: true,
            },
        });

        return NextResponse.json({ application });
    } catch (error: any) {
        console.error("Error creating application:", error);
        return NextResponse.json(
            { error: error.message || "Unknown error" },
            { status: 500 }
        );
    }
}
