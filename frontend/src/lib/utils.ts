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
      return "text-white bg-[#181818] border-white/70";
    case "ready for review":
    case "ready_for_review":
      return "text-[#D4D4D4] bg-[#111111] border-[#555555]";
    case "changes required":
    case "changes_required":
      return "text-white bg-[#181818] border-2 border-[#D4D4D4] font-semibold";
    case "rejected":
      return "text-[#777777] bg-black border-[#292929]";
    case "analyzing":
      return "text-white bg-[#181818] border-white/40 animate-pulse";
    default:
      return "text-[#A1A1A1] bg-[#111111] border-[#292929]";
  }
}

export function getScoreBadge(score: number) {
  if (score >= 90) return { label: "Exceptional Governance", color: "text-white" };
  if (score >= 75) return { label: "Verified Standard", color: "text-[#D4D4D4]" };
  if (score >= 60) return { label: "Review Required", color: "text-[#A1A1A1]" };
  return { label: "Action Required", color: "text-[#777777]" };
}
