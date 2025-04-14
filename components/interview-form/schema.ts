import { z } from "zod";

// Custom file validation
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Form schema for the entire form
export const formSchema = z.object({
    // Company Information
    companyType: z.enum(["existing", "new"]),
    existingCompanyId: z.string().optional(),
    newCompanyName: z.string().optional(),
    newCompanyIndustry: z.string().optional(),
    newCompanyLocation: z.string().optional(),
    newCompanyWebsite: z.string().url().optional(),
    newCompanyLogo: z.any().optional(),

    // Position section
    positionType: z.enum(["existing", "new"]),
    existingPositionId: z.string().optional(),
    newPositionTitle: z
        .string()
        .min(1, "Position title is required")
        .optional(),
    newPositionDescription: z.string().optional(),

    // Application section
    totalRounds: z.coerce.number().min(1, "At least one round is required"),
    applicationNote: z.string().optional(),
    source_channel: z.string().optional(),
    applied_date: z.date().optional(),
    tags: z.array(z.string()).optional(),
    note: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
