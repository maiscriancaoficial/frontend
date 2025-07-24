'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface InputSuaveProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const InputSuave = React.forwardRef<HTMLInputElement, InputSuaveProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        className={cn(
          "rounded-xl border-[1.5px] border-gray-100 dark:border-gray-800/30 bg-white dark:bg-gray-950 shadow-sm",
          "focus-visible:ring-[#27b99a]/30 focus-visible:ring-offset-0 focus-visible:border-[#27b99a]/70", 
          "dark:focus-visible:border-[#27b99a]/40 transition-all duration-200",
          "placeholder:text-gray-400 dark:placeholder:text-gray-600",
          "hover:border-[#27b99a]/70 dark:hover:border-[#27b99a]/30",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
InputSuave.displayName = "InputSuave";
