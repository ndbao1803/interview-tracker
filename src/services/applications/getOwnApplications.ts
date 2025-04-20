export async function getOwnApplicationsService({
    page = 1,
    search,
    statuses,
    tags,
    industries,
    sources,
    sortBy = "applied_date",
    sortDirection = "desc",
    dateRange,
}: {
    page?: number;
    search?: string;
    statuses?: string[];
    tags?: string[];
    industries?: string[];
    sources?: string[];
    sortBy?: string;
    sortDirection?: "asc" | "desc";
    dateRange?: { from?: Date; to?: Date };
}) {
    const params = new URLSearchParams();
    params.append("page", String(page));
    if (search) params.append("search", search);
    if (statuses?.length) params.append("statuses", statuses.join(","));
    if (tags?.length) params.append("tags", tags.join(","));
    if (industries?.length) params.append("industries", industries.join(","));
    if (sources?.length) params.append("sources", sources.join(","));
    if (sortBy) params.append("sortBy", sortBy);
    if (sortDirection) params.append("sortDirection", sortDirection);
    if (dateRange?.from) params.append("from", dateRange.from.toISOString());
    if (dateRange?.to) params.append("to", dateRange.to.toISOString());

    const res = await fetch(`/api/applications?${params.toString()}`, {
        headers: {
            "x-user-id": getUserIdFromCookieOrHeader(), // 👈 You extract it from client context if needed
        },
    });

    if (!res.ok) throw new Error("Failed to fetch applications");
    return res.json();
}

// Example helper (if needed)
function getUserIdFromCookieOrHeader(): string {
    // You can pull this from Supabase client, auth context, etc.
    return ""; // your logic here
}
