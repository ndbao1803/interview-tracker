"use client";

import { useState, useEffect } from "react";
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
import type { UseFormReturn } from "react-hook-form";
import type { formSchema } from "../schema";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useCompanySearch } from "@/src/hooks/useCompanySearch";
import { CompanySearch } from "@/components/companies/CompanySearch";

type FormValues = z.infer<typeof formSchema>;

export function CompanyStep({ form }: { form: UseFormReturn<FormValues> }) {
    const [open, setOpen] = useState(false);

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

    const handleSelectCompany = (companyId: string) => {
        form.setValue("existingCompanyId", companyId);
        console.log(companyId);
        setOpen(false);
    };
    console.log(industries)

    return (
        <div>
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
                                                handleSelectCompany
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
                                            {industries.length > 0 && industries.map((industry) => (
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
                            render={({ field: { value, onChange, ...field } }) => (
                                <FormItem>
                                    <FormLabel>Company Logo (Optional)</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        onChange(file);
                                                    }
                                                }}
                                                className="border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
                                                {...field}
                                            />
                                            {value && (
                                                <div className="relative w-10 h-10 rounded-md overflow-hidden">
                                                    <img
                                                        src={typeof value === 'string' ? value : URL.createObjectURL(value)}
                                                        alt="Logo preview"
                                                        className="object-cover w-full h-full"
                                                        onLoad={() => {
                                                            if (value instanceof File) {
                                                                URL.revokeObjectURL(URL.createObjectURL(value));
                                                            }
                                                        }}
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
        </div>
    );
}
