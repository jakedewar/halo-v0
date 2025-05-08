import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "ext-flex ext-min-h-[60px] ext-w-full ext-rounded-md ext-border ext-border-input ext-bg-transparent ext-px-3 ext-py-2 ext-text-sm ext-shadow-sm placeholder:ext-text-muted-foreground focus-visible:ext-outline-none focus-visible:ext-ring-1 focus-visible:ext-ring-ring disabled:ext-cursor-not-allowed disabled:ext-opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea } 