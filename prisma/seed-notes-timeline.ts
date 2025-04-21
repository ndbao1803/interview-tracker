const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    const applicationId = "070b54ef-f67b-467d-85f4-cbd1bd808112";

    await prisma.application_notes.createMany({
        data: [
            {
                application_id: applicationId,
                content: "Initial application submitted through LinkedIn.",
                created_at: new Date("2025-04-14T10:30:00Z"),
            },
            {
                application_id: applicationId,
                content: "Received confirmation email from recruiter.",
                created_at: new Date("2025-04-15T12:00:00Z"),
            },
        ],
    });

    const application = await prisma.applications.findUnique({
        where: { id: applicationId },
        select: { status_id: true },
    });

    if (!application?.status_id) {
        throw new Error("Application status_id is missing.");
    }

    await prisma.application_timeline.createMany({
        data: [
            {
                application_id: applicationId,
                type: "application",
                title: "Application Submitted",
                description: "Applied via LinkedIn.",
                date: new Date("2025-04-14T10:30:00Z"),
                status_id: application.status_id,
            },
            {
                application_id: applicationId,
                type: "note",
                title: "Confirmation Email",
                description: "Received confirmation from recruiter.",
                date: new Date("2025-04-15T12:00:00Z"),
                status_id: application.status_id,
            },
        ],
    });

    console.log("✅ Seeder completed!");
}

main()
    .catch((err) => {
        console.error("❌ Seeder failed:", err);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
