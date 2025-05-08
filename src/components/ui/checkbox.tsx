import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "ext-peer ext-h-4 ext-w-4 ext-shrink-0 ext-rounded-sm ext-border ext-border-primary ext-shadow focus-visible:ext-outline-none focus-visible:ext-ring-1 focus-visible:ext-ring-ring disabled:ext-cursor-not-allowed disabled:ext-opacity-50 data-[state=checked]:ext-bg-primary data-[state=checked]:ext-text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("ext-flex ext-items-center ext-justify-center ext-text-current")}
    >
      <Check className="ext-h-4 ext-w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
