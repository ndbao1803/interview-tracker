import { z } from "zod"

// Custom file validation
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Form schema for the entire form
export const formSchema = z.object({
  // Company Information
  companyType: z.enum(["existing", "new"]),
  existingCompanyId: z.string().optional(),
  newCompanyName: z.string().optional(),
  newCompanyIndustry: z.string().optional(),
  newCompanyLocation: z.string().optional(),
  newCompanyWebsite: z.string().url().optional().or(z.literal("")),
  newCompanyLogo: z.custom<File>()
    .refine((file) => !file || file instanceof File, "Must be a valid file")
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "File size must be less than 5MB"
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    )
    .optional(),

  // Position section
  positionType: z.enum(["existing", "new"]),
  existingPositionId: z.string().optional(),
  newPositionTitle: z.string().min(1, "Position title is required").optional(),
  newPositionDescription: z.string().optional(),

  // Application section
  totalRounds: z.coerce.number().min(1, "At least one round is required"),
  applicationNote: z.string().optional(),

  // Interview round section
  interviewStatus: z.string().default("Scheduled"),
  interviewFeedback: z.string().optional(),
  interviewNote: z.string().optional(),
})

