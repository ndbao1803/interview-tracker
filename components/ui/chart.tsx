import * as React from "react"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div className="rounded-md border border-zinc-800 bg-zinc-900 text-zinc-50 shadow-sm" {...props} ref={ref} />
))
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className="relative" ref={ref} {...props} />,
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className="rounded-md border border-zinc-800 bg-zinc-900 text-zinc-50 shadow-sm" {...props} ref={ref} />
  ),
)
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  { content?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
>(({ className, content, ...props }, ref) => (
  <div className="p-4" ref={ref} {...props}>
    {content}
  </div>
))
ChartTooltipContent.displayName = "ChartTooltipContent"

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent }

