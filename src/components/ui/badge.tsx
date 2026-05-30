import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brown text-ivory shadow hover:bg-brown-light",
        secondary: "border-transparent bg-beige text-brown hover:bg-taupe",
        destructive: "border-transparent bg-red-500 text-white shadow hover:bg-red-600",
        outline: "text-brown border-brown",
        success: "border-transparent bg-green-500 text-white shadow",
        warning: "border-transparent bg-yellow-500 text-brown shadow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
