"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"
import { formSchema } from "../schema"
import { z } from "zod"

type FormValues = z.infer<typeof formSchema>

interface Company {
  id: string
  name: string
}

export function CompanyStep({ 
  form, 
  mockCompanies 
}: { 
  form: UseFormReturn<FormValues>
  mockCompanies: Company[]
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Company Information</h2>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="companyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Selection</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-[#3c3c3c] bg-[#1e1e1e] focus:ring-[#0e639c]">
                    <SelectValue placeholder="Select company option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                  <SelectItem value="existing">Select an existing company</SelectItem>
                  <SelectItem value="new">Add a new company</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("companyType") === "existing" && (
          <FormField
            control={form.control}
            name="existingCompanyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Company</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-[#3c3c3c] bg-[#1e1e1e] focus:ring-[#0e639c]">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                    {mockCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
                      className="border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-[#0e639c]"
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
                  <FormControl>
                    <Input
                      placeholder="e.g. Technology, Healthcare"
                      {...field}
                      className="border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-[#0e639c]"
                    />
                  </FormControl>
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
                      className="border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-[#0e639c]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </div>
    </div>
  )
}

