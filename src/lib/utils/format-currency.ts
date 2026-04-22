export function formatCurrency(amount: number, currency: string = "EGP"): string {
  // Use Egyptian Pounds for the default local currency if not specified otherwise
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  }).format(amount);
}
