// app/api/companies/route.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const {
        search = "",
        industries = "",
        sortBy = "applicationsCount",
        page = 1,
        limit = 9,
    } = request.nextUrl.searchParams;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    try {
        // Fetch companies from Prisma with corrected filtering
        const companies = await prisma.companies.findMany({
            skip,
            take: parseInt(limit as string),
        });

        // Fetch industries for the filter
        const industriesList = await prisma.industry.findMany({
            select: {
                name: true,
            },
        });

        return NextResponse.json({
            companies,
            industries: industriesList.map((industry) => industry.name),
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            { error: error.message || "Error fetching data" },
            { status: 500 }
        );
    }
}
