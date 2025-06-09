import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  showPasswordToggle?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, showPasswordToggle, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const inputType = showPasswordToggle && type === "password" 
      ? (showPassword ? "text" : "password")
      : type

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={inputType}
            className={cn(
              "flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background transition-all duration-200",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus-visible:ring-red-500",
              showPasswordToggle && "pr-12",
              className
            )}
            ref={ref}
            {...props}
          />
          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }