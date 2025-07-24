import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 w-full min-w-0 rounded-full border bg-transparent px-5 py-2 text-base shadow-sm outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "transition-all duration-300 ease-in-out",
        "focus-visible:border-[#f29798] focus-visible:ring-[#f29798]/30 focus-visible:ring-[3px] focus-visible:border-transparent focus-visible:shadow-md",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "hover:border-[#f29798]/60 hover:shadow-md hover:shadow-[#f29798]/5",
        className
      )}
      {...props}
    />
  )
}

export { Input }
