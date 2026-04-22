export const storage = {
  get: (key: string) => JSON.parse(localStorage.getItem(key) || "null"),
  set: (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value)),
  remove: (key: string) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
};
