/**
 * Helper to get the full URL for an image.
 * If the image path is already a full URL (starts with http), it returns it.
 * Otherwise, it prepends the backend base URL.
 * 
 * Supports both string paths and the Cloudinary object format { url, publicId }.
 */
export const getImageUrl = (
  path?: string | { url: string; publicId?: string } | null,
  name?: string
) => {
  // Use UI Avatars as a pleasant default if no image is available
  const fallback = name 
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0284c7&color=fff&size=512`
    : `https://ui-avatars.com/api/?name=Admin&background=0284c7&color=fff&size=512`;

  if (!path) return fallback;
  
  // Handle object format from backend
  const url = typeof path === "string" ? path : path?.url;
  
  if (!url) return fallback;
  if (url.startsWith("http")) return url;
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  // Ensure we don't have double slashes
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${baseUrl}${cleanPath}`;
};
