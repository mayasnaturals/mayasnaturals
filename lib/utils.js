export const getMrp = (productName, weightStr, price = 0) => {
  const name = (productName || "").toLowerCase();
  const weight = (weightStr || "").toLowerCase();
  
  if (name.includes("super muesli") || name.includes("super museli") || name.includes("classic")) {
      if (weight.includes("900")) return 999;
      if (weight.includes("450")) return 599;
      if (weight.includes("200")) return 299;
  }
  if (name.includes("choco") || name.includes("chocolate")) {
      if (weight.includes("900")) return 1099;
      if (weight.includes("450")) return 649;
      if (weight.includes("200")) return 349;
  }
  if (name.includes("makhana")) {
      if (name.includes("big") || weight.includes("big") || price >= 350) return 499;
      return 299;
  }
  return null;
};
