import { Sparkles } from "lucide-react";
import React from "react";
interface PremiumBadgeProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
  className?: string;
}

const PremiumBadge = ({
  size = "md",
  withText = true,
  className = "",
}: PremiumBadgeProps) => {
  const sizeClasses = {
    sm: "text-xs py-0.5 px-1.5",
    md: "text-sm py-1 px-2",
    lg: "text-base py-1.5 px-3",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <span
      className={`inline-flex items-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full font-medium ${sizeClasses[size]} ${className}`}
    >
      <Sparkles className={`${iconSizes[size]} ${withText ? "mr-1" : ""}`} />
      {withText && <span>Premium</span>}
    </span>
  );
};

export default PremiumBadge;
