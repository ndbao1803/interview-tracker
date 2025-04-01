"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import { formSchema } from "../schema"
import { z } from "zod"

type FormValues = z.infer<typeof formSchema>

interface Position {
  id: string
  companyId: string
  title: string
}

export function PositionStep({ 
  form, 
  filteredPositions 
}: { 
  form: UseFormReturn<FormValues>
  filteredPositions: Position[]
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Position Information</h2>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="positionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position Selection</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-[#3c3c3c] bg-[#1e1e1e] focus:ring-[#0e639c]">
                    <SelectValue placeholder="Select position option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                  <SelectItem value="existing">Select an existing position</SelectItem>
                  <SelectItem value="new">Add a new position</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("positionType") === "existing" && (
          <FormField
            control={form.control}
            name="existingPositionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Position</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-[#3c3c3c] bg-[#1e1e1e] focus:ring-[#0e639c]">
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                    {filteredPositions.map((position) => (
                      <SelectItem key={position.id} value={position.id}>
                        {position.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {form.watch("positionType") === "new" && (
          <>
            <FormField
              control={form.control}
              name="newPositionTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Software Engineer"
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
              name="newPositionDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter job description and requirements"
                      className="min-h-[100px] border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-[#0e639c]"
                      {...field}
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

