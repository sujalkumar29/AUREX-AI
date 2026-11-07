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
      return "text-emerald-400 bg-emerald-950/40 border-emerald-800/50";
    case "ready for review":
    case "ready_for_review":
      return "text-amber-300 bg-amber-950/40 border-amber-700/50";
    case "changes required":
    case "changes_required":
      return "text-rose-400 bg-rose-950/40 border-rose-800/50";
    case "rejected":
      return "text-red-500 bg-red-950/40 border-red-800/50";
    case "analyzing":
      return "text-blue-400 bg-blue-950/40 border-blue-800/50";
    default:
      return "text-neutral-400 bg-neutral-900 border-neutral-700";
  }
}

export function getScoreBadge(score: number) {
  if (score >= 90) return { label: "Exceptional", color: "text-emerald-400" };
  if (score >= 75) return { label: "Good Compliance", color: "text-amber-300" };
  if (score >= 60) return { label: "Review Required", color: "text-amber-500" };
  return { label: "Non-Compliant", color: "text-rose-400" };
}

