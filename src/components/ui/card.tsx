import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "ext-rounded-lg ext-border ext-bg-card ext-text-card-foreground ext-shadow-sm",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

export { Card }
