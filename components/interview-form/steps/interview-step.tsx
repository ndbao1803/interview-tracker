"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import { formSchema } from "../schema"
import { z } from "zod"

type FormValues = z.infer<typeof formSchema>

export function InterviewStep({ form }: { form: UseFormReturn<FormValues> }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">First Interview Round</h2>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="interviewStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interview Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-[#3c3c3c] bg-[#1e1e1e] focus:ring-[#0e639c]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interviewFeedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feedback (if completed)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any feedback received from the interview"
                  className="min-h-[100px] border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-[#0e639c]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interviewNote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interview Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your personal notes about the interview (questions asked, your responses, etc.)"
                  className="min-h-[100px] border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-[#0e639c]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

