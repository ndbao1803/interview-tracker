import { PrismaClient, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Prisma Client instance
const prisma = new PrismaClient();

// Define the TypeScript type for the response
type CompaniesApiResponse = {
    companies: any[]; // Replace with the actual Company type if available
    industries: string[];
    pageInfo: {
        totalCount: number;
        totalPages: number;
        currentPage: number;
    };
};

export async function GET(request: NextRequest) {
    try {
        // Retrieve query parameters
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get("search") || "";
        const industriesRaw = searchParams.get("industries") || "";
        const sortBy = searchParams.get("sortBy") || "name";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "9");
        const skip = (page - 1) * limit;

        // Parse selected industries
        const selectedIndustries = industriesRaw
            .split(",")
            .filter((i) => i.trim() !== "");

        // Build the where clause for filtering companies
        const whereClause: any = {
            name: {
                contains: search,
                mode: "insensitive",
            },
        };

        if (selectedIndustries.length > 0) {
            whereClause.industry = {
                name: {
                    in: selectedIndustries,
                },
            };
        }

        // Define the allowed sorting fields
        const allowedSortFields = [
            "name",
            "created_at",
            "updated_at",
            "location",
        ];
        const orderByClause: Prisma.companiesOrderByWithRelationInput =
            allowedSortFields.includes(sortBy)
                ? { [sortBy]: "asc" as Prisma.SortOrder }
                : { name: "asc" as Prisma.SortOrder };

        // Fetch companies with pagination
        const companies = await prisma.companies.findMany({
            skip,
            take: limit,
            where: whereClause,
            orderBy: orderByClause,
            include: {
                industry: true,
            },
        });

        // Log the first company to debug
        if (companies.length > 0) {
            console.log("First company from API:", JSON.stringify(companies[0], null, 2));
        }

        // Fetch the total count of companies matching the search and filters
        const totalCount = await prisma.companies.count({
            where: whereClause,
        });

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalCount / limit);

        // Fetch industries for filtering options
        const industriesList = await prisma.industry.findMany({
            select: { name: true },
        });

        // Prepare the response object
        const response: CompaniesApiResponse = {
            companies,
            industries: industriesList.map((i) => i.name),
            pageInfo: {
                totalCount,
                totalPages,
                currentPage: page,
            },
        };

        // Return the response as JSON
        return NextResponse.json(response);
    } catch (error: any) {
        console.error("Error fetching companies:", error);
        return NextResponse.json(
            { error: error.message || "Unknown error" },
            { status: 500 }
        );
    }
}

// Add POST method to handle company selection
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // If companyId is provided, it's a company selection request
        if (body.companyId) {
            const company = await prisma.companies.findUnique({
                where: { id: body.companyId },
                include: {
                    industry: true,
                },
            });

            if (!company) {
                return NextResponse.json(
                    { error: "Company not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({ company });
        }
        
        // Otherwise, it's a company creation request
        const { name, industry, location, website, logo_url } = body;
        
        if (!name) {
            return NextResponse.json(
                { error: "Company name is required" },
                { status: 400 }
            );
        }

        // First, find or create the industry
        let industryRecord = await prisma.industry.findFirst({
            where: { name: industry },
        });

        if (!industryRecord) {
            industryRecord = await prisma.industry.create({
                data: { name: industry },
            });
        }

        // Create the company with the industry connection
        const company = await prisma.companies.create({
            data: {
                name,
                industry: {
                    connect: { id: industryRecord.id },
                },
                location,
                website,
                logo_url,
            },
            include: {
                industry: true,
            },
        });

        return NextResponse.json({ company });
    } catch (error: any) {
        console.error("Error handling company request:", error);
        return NextResponse.json(
            { error: error.message || "Unknown error" },
            { status: 500 }
        );
    }
}
