"use client"

import { useEffect, useState } from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import { formSchema } from "../schema"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/src/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"

type FormValues = z.infer<typeof formSchema>

const sourceChannels = [
  "LinkedIn",
  "Company Website",
  "Indeed",
  "Referral",
  "Other"
];

export function ApplicationStep({
  form,
}: {
  form: UseFormReturn<FormValues>;
}) {
  const [availableTags, setAvailableTags] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [openTagSelect, setOpenTagSelect] = useState(false);

  // Fetch available tags
  useEffect(() => {
    async function fetchTags() {
      setIsLoadingTags(true);
      try {
        const response = await fetch('/api/tags');
        if (!response.ok) throw new Error('Failed to fetch tags');
        const data = await response.json();
        setAvailableTags(data.tags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setIsLoadingTags(false);
      }
    }

    fetchTags();
  }, []);

  const selectedTags = form.watch('tags') || [];

  const handleSelectTag = (tagId: string) => {
    const currentTags = form.watch('tags') || [];
    if (!currentTags.includes(tagId)) {
      form.setValue('tags', [...currentTags, tagId], { shouldDirty: true });
    }
    setOpenTagSelect(false);
  };

  const handleRemoveTag = (tagId: string) => {
    const currentTags = form.watch('tags') || [];
    form.setValue(
      'tags',
      currentTags.filter(id => id !== tagId),
      { shouldDirty: true }
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Application Information</h2>
      <div className="space-y-4">
        {/* Applied Date */}
        <FormField
          control={form.control}
          name="applied_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Applied Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Source Channel */}
        <FormField
          control={form.control}
          name="source_channel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source Channel</FormLabel>
              <div className="flex flex-wrap gap-2">
                {sourceChannels.map((channel) => (
                  <Badge
                    key={channel}
                    variant={field.value === channel ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => form.setValue('source_channel', channel, { shouldDirty: true })}
                  >
                    {channel}
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tagId) => {
                    const tag = availableTags.find(t => t.id === tagId);
                    return tag ? (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="gap-1"
                      >
                        {tag.name}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveTag(tag.id)}
                        />
                      </Badge>
                    ) : null;
                  })}
                </div>
                <Popover open={openTagSelect} onOpenChange={setOpenTagSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      disabled={isLoadingTags}
                    >
                      {isLoadingTags ? "Loading tags..." : "Select tags"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search tags..." />
                      <CommandEmpty>No tags found.</CommandEmpty>
                      <CommandGroup>
                        {availableTags
                          .filter(tag => !selectedTags.includes(tag.id))
                          .map(tag => (
                            <CommandItem
                              key={tag.id}
                              onSelect={() => handleSelectTag(tag.id)}
                            >
                              {tag.name}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Application Note */}
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any notes about your application..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

