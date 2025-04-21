"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronsUpDown } from "lucide-react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useFormContext } from "react-hook-form";
import { FormValues } from "../schema";
import { useCompanySearch } from "@/src/hooks/useCompanySearch";
import { CompanySearch } from "@/components/companies/CompanySearch";
import { string } from "zod";

export function CompanyStep() {
    const form = useFormContext<FormValues>();
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<{
        id: string;
        name: string;
        industry: string;
        logo_url?: File | string;
    } | null>(null);

    const {
        searchQuery,
        companies,
        industries,
        selectedIndustries,
        loading,
        error,
        hasMore,
        groupedCompanies,
        sortedIndustries,
        handleSearchChange,
        toggleIndustry,
        fetchCompanies,
    } = useCompanySearch();

    // Initial fetch for industries
    useEffect(() => {
        if (industries.length === 0) {
            fetchCompanies(true);
        }
    }, [industries.length, fetchCompanies]);

    const handleCompanySelect = useCallback(
        (company: {
            id: string;
            name: string;
            industry: string;
            logo_url?: File;
        }) => {
            setSelectedCompany(company);

            form.setValue("existingCompanyId", company.id, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });
        },
        [form]
    );

    // Add a wrapper function to adapt the CompanySearch's onSelectCompany callback
    const handleCompanySelectWrapper = useCallback(
        (companyId: string) => {
            // Find the company in the companies array
            const company = companies.find((c) => c.id === companyId);
            if (company) {
                handleCompanySelect({
                    id: company.id,
                    name: company.name,
                    industry: company.industry?.name || "",
                    logo_url: company.logo_url,
                });
                setOpen(false);
            }
        },
        [companies, handleCompanySelect]
    );

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            if (form.getValues("companyType") === "new") {
                const response = await fetch("/api/companies", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: form.getValues("newCompanyName"),
                        industry: form.getValues("newCompanyIndustry"),
                        location: form.getValues("newCompanyLocation"),
                        website: form.getValues("newCompanyWebsite"),
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to create company");
                }

                const company = await response.json();
                form.setValue("existingCompanyId", company.id);
            }

            form.next();
        } catch (error) {
            console.error("Error creating company:", error);
            // Handle error appropriately
        } finally {
            setIsSubmitting(false);
            setIsReviewOpen(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Company Information</h2>
            <div className="space-y-4">
                {/* Company Type Selection */}
                <FormField
                    control={form.control}
                    name="companyType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Selection</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="border-[#3c3c3c] bg-[#1e1e1e] focus:ring-[#0e639c]">
                                        <SelectValue placeholder="Select company option" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                                    <SelectItem value="existing">
                                        Select an existing company
                                    </SelectItem>
                                    <SelectItem value="new">
                                        Add a new company
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Existing Company Selection */}
                {form.watch("companyType") === "existing" && (
                    <FormField
                        control={form.control}
                        name="existingCompanyId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Select Company</FormLabel>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className="w-full justify-between border-[#3c3c3c] bg-[#1e1e1e] hover:bg-[#2d2d2d] text-left font-normal"
                                            >
                                                {field.value
                                                    ? companies.find(
                                                          (company) =>
                                                              company.id ===
                                                              field.value
                                                      )?.name || "Loading..."
                                                    : "Search for a company..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0 border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                                        <CompanySearch
                                            searchQuery={searchQuery}
                                            onSearchChange={handleSearchChange}
                                            companies={companies}
                                            industries={industries}
                                            selectedIndustries={
                                                selectedIndustries
                                            }
                                            onToggleIndustry={toggleIndustry}
                                            loading={loading}
                                            error={error}
                                            hasMore={hasMore}
                                            groupedCompanies={groupedCompanies}
                                            sortedIndustries={sortedIndustries}
                                            selectedCompanyId={field.value}
                                            onSelectCompany={
                                                handleCompanySelectWrapper
                                            }
                                            fetchCompanies={fetchCompanies}
                                            isOpen={open}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* New Company Form */}
                {form.watch("companyType") === "new" && (
                    <>
                        <FormField
                            control={form.control}
                            name="newCompanyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter company name"
                                            {...field}
                                            className="border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-primary"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newCompanyIndustry"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Industry</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="border-[#3c3c3c] bg-[#1e1e1e] focus:ring-primary">
                                                <SelectValue placeholder="Select an industry" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                                            {industries.length > 0 &&
                                                industries.map((industry) => (
                                                    <SelectItem
                                                        key={industry}
                                                        value={industry}
                                                    >
                                                        {industry}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newCompanyLocation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. San Francisco, CA"
                                            {...field}
                                            className="border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-primary"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newCompanyWebsite"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="url"
                                            placeholder="https://example.com"
                                            {...field}
                                            className="border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-primary"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newCompanyLogo"
                            render={({
                                field: { value, onChange, ...field },
                            }) => (
                                <FormItem>
                                    <FormLabel>
                                        Company Logo (Optional)
                                    </FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file =
                                                        e.target.files?.[0];
                                                    if (file) {
                                                        // Create a preview URL
                                                        const previewUrl =
                                                            URL.createObjectURL(
                                                                file
                                                            );

                                                        // Store the file for later upload
                                                        onChange(file);
                                                        form.setValue(
                                                            "newCompanyLogo",
                                                            file
                                                        );

                                                        // Clean up the preview URL when component unmounts
                                                        return () =>
                                                            URL.revokeObjectURL(
                                                                previewUrl
                                                            );
                                                    }
                                                }}
                                                className="border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
                                                {...field}
                                            />
                                            {value && (
                                                <div className="relative w-10 h-10 rounded-md overflow-hidden">
                                                    <img
                                                        src={
                                                            typeof value ===
                                                            "string"
                                                                ? value
                                                                : URL.createObjectURL(
                                                                      value
                                                                  )
                                                        }
                                                        alt="Logo preview"
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}
            </div>

            <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Review Company Information</DialogTitle>
                        <DialogDescription>
                            Please review the company information before
                            proceeding.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {form.watch("companyType") === "existing" &&
                        selectedCompany ? (
                            <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                    {selectedCompany.logo_url && (
                                        <img
                                            src={selectedCompany.logo_url}
                                            alt="Company logo"
                                            className="h-12 w-12 object-contain"
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-medium">
                                            {selectedCompany.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {selectedCompany.industry}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <p className="font-semibold">
                                        New Company Details:
                                    </p>
                                    <div className="flex items-center gap-3">
                                        {form.watch("newCompanyLogo") && (
                                            <img
                                                src={
                                                    form.watch(
                                                        "newCompanyLogo"
                                                    ) instanceof File
                                                        ? URL.createObjectURL(
                                                              form.watch(
                                                                  "newCompanyLogo"
                                                              )
                                                          )
                                                        : typeof form.watch(
                                                              "newCompanyLogo"
                                                          ) === "string"
                                                        ? form.watch(
                                                              "newCompanyLogo"
                                                          )
                                                        : ""
                                                }
                                                alt="Company logo"
                                                className="w-10 h-10 rounded-md object-cover"
                                            />
                                        )}
                                        <div>
                                            <p className="font-medium">
                                                {form.watch("newCompanyName")}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {form.watch(
                                                    "newCompanyIndustry"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-medium">Location:</p>
                                    <p>{form.watch("newCompanyLocation")}</p>
                                </div>
                                {form.watch("newCompanyWebsite") && (
                                    <div>
                                        <p className="font-medium">Website:</p>
                                        <p>{form.watch("newCompanyWebsite")}</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
