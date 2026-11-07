import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return dateString;
  }
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "approved":
      return "text-[#0D0B2D] bg-[#E6E0FF] border-[#5B4BFF]/40 font-bold shadow-sm";
    case "ready for review":
    case "ready_for_review":
      return "text-[#5B4BFF] bg-[#F0EDFF] border-[#A78BFA]/50 font-semibold";
    case "changes required":
    case "changes_required":
      return "text-[#17143A] bg-[#FFFFFF] border-2 border-[#5B4BFF] font-bold shadow-sm";
    case "rejected":
      return "text-[#77738F] bg-[#F7F8FF] border-[#E5E1F2]";
    case "analyzing":
      return "text-[#5B4BFF] bg-[#E6E0FF] border-[#5B4BFF] animate-pulse font-semibold";
    default:
      return "text-[#77738F] bg-[#F0EDFF] border-[#E5E1F2]";
  }
}

export function getScoreBadge(score: number) {
  if (score >= 90) return { label: "Exceptional Governance", color: "text-[#5B4BFF]" };
  if (score >= 75) return { label: "Verified Standard", color: "text-[#0D0B2D]" };
  if (score >= 60) return { label: "Review Required", color: "text-[#A78BFA]" };
  return { label: "Action Required", color: "text-[#77738F]" };
}
