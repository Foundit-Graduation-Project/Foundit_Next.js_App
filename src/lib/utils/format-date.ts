export function formatDate(date: Date | string | number): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
}
