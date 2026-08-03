export const getComboPrice = (weightStr, size) => {
  if (!weightStr) return null;
  const weight = weightStr.toLowerCase().replace(/\s+/g, '');
  
  if (weight.includes("90g")) {
    switch (size) {
      case 2:
        return 249;
      case 4:
        return 479;
      case 6:
        return 659;
      default:
        return null;
    }
  } else if (weight.includes("180g")) {
    switch (size) {
      case 2:
        return 539;
      case 4:
        return 1019;
      case 6:
        return 1439;
      default:
        return null;
    }
  }
  return null;
};
