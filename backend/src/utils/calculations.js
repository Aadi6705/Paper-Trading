exports.calculateNewAveragePrice = (existingQty, existingAvg, boughtQty, buyPrice) => {
  const newTotalQty = existingQty + boughtQty;
  if (newTotalQty === 0) return 0;
  return ((existingQty * existingAvg) + (boughtQty * buyPrice)) / newTotalQty;
};
