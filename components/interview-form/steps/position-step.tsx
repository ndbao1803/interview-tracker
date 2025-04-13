"use client"

import { useEffect, useState } from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import { formSchema } from "../schema"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

type FormValues = z.infer<typeof formSchema>

interface Position {
  id: string
  companyId: string
  title: string
  description?: string
}

export function PositionStep({
  form,
}: {
  form: UseFormReturn<FormValues>;
}) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const companyId = form.watch("existingCompanyId");
  const companyType = form.watch("companyType");

  // Fetch positions when company is selected
  useEffect(() => {
    async function fetchPositions() {
      if (!companyId || companyType !== "existing") return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/positions?companyId=${companyId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch positions");
        }

        const data = await response.json();
        setPositions(data.positions);
      } catch (err) {
        console.error("Error fetching positions:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch positions");
      } finally {
        setLoading(false);
      }
    }

    fetchPositions();
  }, [companyId, companyType]);

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
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="border-[#3c3c3c] bg-[#1e1e1e] focus:ring-[#0e639c]">
                    <SelectValue placeholder="Select position option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                  <SelectItem value="existing">
                    Select an existing position
                  </SelectItem>
                  <SelectItem value="new">
                    Add a new position
                  </SelectItem>
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
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  disabled={loading || !companyId}
                >
                  <FormControl>
                    <SelectTrigger className="border-[#3c3c3c] bg-[#1e1e1e] focus:ring-primary">
                      <SelectValue placeholder={
                        loading ? "Loading positions..." :
                          !companyId ? "Select a company first" :
                            "Select a position"
                      } />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                    {loading ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Loading...</span>
                      </div>
                    ) : error ? (
                      <div className="text-red-500 p-2 text-sm">{error}</div>
                    ) : positions.length > 0 ? (
                      positions.map((position) => (
                        <SelectItem
                          key={position.id}
                          value={position.id}
                        >
                          {position.title}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-[#8a8a8a]">
                        No positions available
                      </div>
                    )}
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
                      className="border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-primary"
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
                  <FormLabel>Position Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter position description"
                      {...field}
                      className="border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-primary min-h-[100px]"
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
  );
}

