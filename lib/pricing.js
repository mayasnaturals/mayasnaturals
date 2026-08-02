export const getComboPrice = (weightStr, size) => {
  if (!weightStr) return null;
  const weight = weightStr.toLowerCase().replace(/\s+/g, '');
  
  if (weight.includes("90g")) {
    switch (size) {
      case 2:
        return 209;
      case 4:
        return 399;
      case 6:
        return 549;
      default:
        return null;
    }
  } else if (weight.includes("180g")) {
    switch (size) {
      case 2:
        return 449;
      case 4:
        return 849;
      case 6:
        return 1199;
      default:
        return null;
    }
  }
  return null;
};
