import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const sortBy = searchParams.get("sortBy") || "applied_date";
        const sortDirection =
            searchParams.get("sortDirection") === "asc" ? "asc" : "desc";

        const userId =
            searchParams.get("userId") || request.headers.get("x-user-id");

        const search = searchParams.get("search") || undefined;
        const statuses = searchParams
            .get("statuses")
            ?.split(",")
            .filter(Boolean);
        const tags = searchParams.get("tags")?.split(",").filter(Boolean);
        const industries = searchParams
            .get("industries")
            ?.split(",")
            .filter(Boolean);
        const sources = searchParams.get("sources")?.split(",").filter(Boolean);
        const from = searchParams.get("from") || undefined;
        const to = searchParams.get("to") || undefined;

        const where: any = {};

        if (userId) where.user_id = userId;

        if (search) {
            where.OR = [
                {
                    positions: {
                        companies: {
                            name: { contains: search, mode: "insensitive" },
                        },
                    },
                },
                {
                    positions: {
                        title: { contains: search, mode: "insensitive" },
                    },
                },
                { note: { contains: search, mode: "insensitive" } },
            ];
        }

        if (statuses?.length) where.status = { in: statuses };
        if (sources?.length) where.source_channel = { in: sources };

        if (from || to) {
            where.applied_date = {};
            if (from) where.applied_date.gte = new Date(from);
            if (to) where.applied_date.lte = new Date(to);
        }

        if (industries?.length) {
            where.positions = {
                is: {
                    companies: {
                        is: {
                            industry: {
                                is: {
                                    name: { in: industries },
                                },
                            },
                        },
                    },
                },
            };
        }

        if (tags?.length) {
            where.tags = {
                some: {
                    tags: {
                        id: { in: tags },
                    },
                },
            };
        }

        // 👇 Dynamic orderBy including nested company name support
        let orderBy: any = {};
        if (sortBy === "company") {
            orderBy = {
                positions: {
                    companies: {
                        name: sortDirection,
                    },
                },
            };
        } else {
            orderBy = { [sortBy]: sortDirection };
        }

        const [items, total] = await Promise.all([
            prisma.applications.findMany({
                where,
                include: {
                    positions: { include: { companies: true } },
                    users: true,
                    tags: { include: { tags: true } },
                    application_rounds: true,
                    status: true,
                },
                orderBy,
                skip,
                take: pageSize,
            }),
            prisma.applications.count({ where }),
        ]);

        return NextResponse.json({
            items,
            totalPages: Math.ceil(total / pageSize),
        });
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
        const defaultAppliedStatus = "1833e9c7-fbab-4eb1-9fd0-e886e1a0e042";
        // Create the application
        const application = await prisma.applications.create({
            data: {
                user_id: userId,
                position_id: positionId,
                note,
                status_id: defaultAppliedStatus,
                source_channel: "",
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
                application_rounds: true,
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
