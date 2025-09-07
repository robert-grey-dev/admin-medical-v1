import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

const getPasswordStrength = (password: string) => {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  score = Object.values(checks).filter(Boolean).length;
  
  const strength = score <= 1 ? 'weak' : score <= 3 ? 'medium' : 'strong';
  const percentage = (score / 5) * 100;
  
  return { strength, percentage, checks };
};

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  if (!password) return null;
  
  const { strength, percentage, checks } = getPasswordStrength(password);
  
  const strengthColors = {
    weak: 'bg-destructive',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500'
  };
  
  const strengthText = {
    weak: 'Weak',
    medium: 'Medium', 
    strong: 'Strong'
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Password strength:</span>
        <span className={cn("text-sm font-medium", {
          'text-destructive': strength === 'weak',
          'text-yellow-600': strength === 'medium',
          'text-green-600': strength === 'strong'
        })}>
          {strengthText[strength]}
        </span>
      </div>
      
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div 
          className={cn("h-full transition-all", strengthColors[strength])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="text-xs text-muted-foreground space-y-1">
        <div className={cn("flex items-center gap-2", checks.length ? "text-green-600" : "")}>
          <span className={cn("w-1 h-1 rounded-full", checks.length ? "bg-green-600" : "bg-muted-foreground")} />
          At least 8 characters
        </div>
        <div className={cn("flex items-center gap-2", checks.uppercase && checks.lowercase ? "text-green-600" : "")}>
          <span className={cn("w-1 h-1 rounded-full", checks.uppercase && checks.lowercase ? "bg-green-600" : "bg-muted-foreground")} />
          Upper & lowercase letters
        </div>
        <div className={cn("flex items-center gap-2", checks.number ? "text-green-600" : "")}>
          <span className={cn("w-1 h-1 rounded-full", checks.number ? "bg-green-600" : "bg-muted-foreground")} />
          At least one number
        </div>
        <div className={cn("flex items-center gap-2", checks.special ? "text-green-600" : "")}>
          <span className={cn("w-1 h-1 rounded-full", checks.special ? "bg-green-600" : "bg-muted-foreground")} />
          Special character
        </div>
      </div>
    </div>
  );
}