import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const companyId = searchParams.get("companyId");
        
        // Build where clause based on whether companyId is provided
        const whereClause = companyId ? {
            company_id: companyId
        } : {};

        // Fetch positions
        const positions = await prisma.positions.findMany({
            where: whereClause,
            include: {
                companies: true,
            },
            orderBy: {
                title: 'asc',
            },
        });

        return NextResponse.json({ positions });
    } catch (error: any) {
        console.error("Error fetching positions:", error);
        return NextResponse.json(
            { error: error.message || "Unknown error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, companyId } = body;

        if (!title || !companyId) {
            return NextResponse.json(
                { error: "Title and company ID are required" },
                { status: 400 }
            );
        }

        // Create the position
        const position = await prisma.positions.create({
            data: {
                title,
                description,
                companies: {
                    connect: { id: companyId }
                }
            },
            include: {
                companies: true,
            },
        });

        return NextResponse.json({ position });
    } catch (error: any) {
        console.error("Error creating position:", error);
        return NextResponse.json(
            { error: error.message || "Unknown error" },
            { status: 500 }
        );
    }
}
