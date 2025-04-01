import { z } from "zod"

// Form schema for the entire form
export const formSchema = z.object({
  // Company section
  companyType: z.enum(["existing", "new"]),
  existingCompanyId: z.string().optional(),
  newCompanyName: z.string().min(1, "Company name is required").optional(),
  newCompanyIndustry: z.string().optional(),
  newCompanyLocation: z.string().optional(),

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

