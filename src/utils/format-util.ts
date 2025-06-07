const isNumeric = (str: string): boolean => /^-?\d+([.,]\d+)?$/.test(str);

const formatCurrency = (d: any) => {
  if (isNumeric(d) && String(d).includes(".")) return parseFloat(d).toFixed(3);
  return d;
};

export const formatUtils = {
  formatCurrency,
};
