import InterviewForm from "@/components/interview-form/interview-form";
import SharedLayout from "@/components/SharedLayout";
import { getAllCompanies } from "@/src/prisma/companyService";

export default async function AddApplicationPage() {

    return (
        <SharedLayout>
            <div className="m-8">
                <h1 className="text-xl font-semibold">Add New Application</h1>
                <p className="text-sm text-[#8a8a8a]">
                    Track a new job application by filling out the form below
                </p>
            </div>
            <InterviewForm />
        </SharedLayout>
    );
}
