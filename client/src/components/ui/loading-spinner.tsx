import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className={cn("animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full", className)} />
  );
}
