import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

/**
 * Returns a full URL for an avatar path.
 * Handles:
 * 1. Empty/undefined paths (returns a fallback)
 * 2. Full URLs (returns as-is)
 * 3. Local paths (prepends API_BASE)
 */
export function getAvatarUrl(path: string | undefined): string {
  if (!path) return "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky";
  if (path.startsWith("http")) return path;
  
  // Ensure local path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
}
