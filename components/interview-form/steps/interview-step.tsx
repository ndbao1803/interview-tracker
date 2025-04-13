"use client"

import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormValues } from "../schema";

export function InterviewStep() {
  const form = useFormContext<FormValues>();
  const interviewType = form.watch("interviewType");

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="interviewType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Interview Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="existing" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Select Existing Interview
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="new" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Create New Interview
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {interviewType === "existing" ? (
        <FormField
          control={form.control}
          name="existingInterviewId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Interview</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an interview" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="interview1">Technical Interview</SelectItem>
                  <SelectItem value="interview2">HR Interview</SelectItem>
                  <SelectItem value="interview3">System Design Interview</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <>
          <FormField
            control={form.control}
            name="newInterviewTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interview Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Technical Interview Round 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newInterviewDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter interview details..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      <FormField
        control={form.control}
        name="interviewStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
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
            <FormLabel>Feedback</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter interview feedback..."
                className="resize-none"
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
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter any additional notes..."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

