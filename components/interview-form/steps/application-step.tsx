import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { formSchema } from "../schema"

type FormValues = z.infer<typeof formSchema>

export function ApplicationStep({ form }: { form: UseFormReturn<FormValues> }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Application Information</h2>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="totalRounds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Interview Rounds</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  {...field}
                  className="border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-[#0e639c]"
                />
              </FormControl>
              <FormDescription className="text-[#8a8a8a]">
                How many interview rounds do you expect for this position?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applicationNote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional notes about your application"
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

