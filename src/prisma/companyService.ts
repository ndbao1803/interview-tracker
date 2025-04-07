// lib/prisma/userService.ts
import { prisma } from "./client";

export async function getAllCompanies() {
    const res = await prisma.companies.findMany({
        include: {
            industry: true,
        },
    });
    return res;
}

export async function GetPagionationCompanies(req: any) {
    const { search, industries, sortBy, page, limit } = req.query;

    const filter: any = {};
    if (search) {
        filter.name = {
            contains: search,
            mode: "insensitive",
        };
    }

    if (industries && industries.length > 0) {
        filter.industry = { in: industries };
    }

    return await prisma.companies.findMany({
        where: filter,
        orderBy: sortBy ? { [sortBy]: "desc" } : undefined,
        skip: (page - 1) * limit,
        take: limit,
    });
}
