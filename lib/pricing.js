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
      case 8:
        return 839;
      default:
        return null;
    }
  } else if (weight.includes("180g")) {
    switch (size) {
      case 2:
        return 539;
      case 4:
        return 1016;
      case 6:
        return 1439;
      case 8:
        return 1859;
      default:
        return null;
    }
  }
  return null;
};
