const formatNumber = (n, decimals = 1, style = "auto") => {
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
};

console.log("600,000 (auto):", formatNumber(600000));
console.log("600,000 (million):", formatNumber(600000, 1, "million"));
console.log("1,500,000 (auto):", formatNumber(1500000));
