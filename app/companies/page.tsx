"use client";

import SharedLayout from "@/components/SharedLayout";
import CompaniesDashboardComponent from "@/components/companies/DashBoard";

export default function CompaniesDashboard() {
    return (
        <SharedLayout>
            <main className="bg-gradient-to-b from-background to-muted h-full">
                <section className="w-full py-6 md:py-12 lg:py-24 to-muted">
                    <div className="container px-4 md:px-6">
                        <div className="p-4">
                            <div className="mb-4">
                                <h1 className="text-xl font-semibold">
                                    Companies
                                </h1>
                                <p className="text-sm text-[#8a8a8a]">
                                    Browse and filter companies by industry and
                                    application statistics
                                </p>
                            </div>
                            <CompaniesDashboardComponent />
                        </div>
                    </div>
                </section>
            </main>
        </SharedLayout>
    );
}
