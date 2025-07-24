'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { VariantProps, cva } from "class-variance-authority";

const botaoVariants = cva(
  "inline-flex items-center justify-center rounded-xl transition-all duration-200 font-medium",
  {
    variants: {
      variant: {
        default: 
          "bg-gradient-to-r from-[#27b99a] to-[#27b99a]/90 text-white shadow-md hover:shadow-lg hover:from-[#27b99a] hover:to-[#27b99a]/80 active:scale-[0.98] border-0",
        outline: 
          "border border-[#27b99a]/30 hover:border-[#27b99a]/40 text-[#27b99a] hover:bg-[#27b99a]/10 dark:hover:bg-[#27b99a]/20 dark:text-[#27b99a]/80 dark:border-[#27b99a]/30",
        ghost: 
          "bg-transparent text-[#27b99a] hover:bg-[#27b99a]/10 dark:hover:bg-[#27b99a]/20 dark:text-[#27b99a]/80",
        link: 
          "text-[#27b99a] underline-offset-4 hover:underline dark:text-[#27b99a]/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-sm",
        lg: "h-12 px-6 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BotaoSuaveProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof botaoVariants> {
  isLoading?: boolean;
}

export const BotaoSuave = React.forwardRef<HTMLButtonElement, BotaoSuaveProps>(
  ({ className, variant, size, isLoading = false, children, ...props }, ref) => {
    return (
      <Button
        className={cn(botaoVariants({ variant, size }), className)}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Carregando...
          </div>
        ) : (
          children
        )}
      </Button>
    );
  }
);
BotaoSuave.displayName = "BotaoSuave";
