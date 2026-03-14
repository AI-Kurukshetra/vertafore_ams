import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-[0_14px_26px_-14px_rgba(2,132,199,0.8)] hover:from-cyan-500 hover:to-sky-500",
        outline:
          "border-slate-200 bg-white/80 text-slate-700 shadow-sm hover:bg-white hover:border-slate-300",
        secondary:
          "bg-slate-100 text-slate-700 hover:bg-slate-200",
        ghost:
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        destructive:
          "bg-red-600 text-white shadow-[0_12px_24px_-14px_rgba(220,38,38,0.9)] hover:bg-red-500",
        link: "text-cyan-700 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-2 px-4",
        xs: "h-7 gap-1 rounded-lg px-2 text-xs",
        sm: "h-9 gap-1.5 rounded-lg px-3 text-xs",
        lg: "h-11 gap-2 px-5",
        icon: "size-10",
        "icon-xs": "size-7 rounded-lg",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
