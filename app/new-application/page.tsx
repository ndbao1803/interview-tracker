import InterviewForm from "@/components/interview-form/interview-form"
import SharedLayout from "@/components/SharedLayout"
import { getAllCompanies } from "@/src/prisma/companyService";

export default async function AddApplicationPage() {
  const companies = await getAllCompanies();
  console.log(companies)
  return (
    <SharedLayout>
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Add New Application</h1>
        <p className="text-sm text-[#8a8a8a]">Track a new job application by filling out the form below</p>
      </div>
      <InterviewForm companies={companies} />
    </SharedLayout>
  )
}

