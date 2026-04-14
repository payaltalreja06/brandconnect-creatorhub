/**
 * Formats a number into a human-readable string with K/M suffixes.
 * @param n The number to format
 * @param decimals Number of decimal places (default: 1)
 * @param style 'auto' (K if <1M, M if >=1M) or 'million' (always M)
 * @returns Formatted string
 */
export function formatNumber(
  n: number | string | undefined, 
  decimals: number = 1, 
  style: "auto" | "million" = "auto"
): string {
  if (n === undefined || n === null) return "0";
  
  const num = typeof n === "string" ? parseFloat(n) : n;
  
  if (isNaN(num)) return "0";
  
  if (style === "million") {
    return (num / 1_000_000).toFixed(decimals).replace(/\.0+$/, "") + "M";
  }

  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(decimals).replace(/\.0+$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(decimals).replace(/\.0+$/, "") + "K";
  }
  
  return num.toString();
}

/**
 * Formats currency in INR.
 */
export function formatCurrency(amount: number | string | undefined): string {
  if (amount === undefined || amount === null) return "₹0";
  
  const num = typeof amount === "string" ? parseFloat(amount.replace(/[^0-9]/g, "")) : amount;
  
  if (isNaN(num)) return "₹0";
  
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}
