export function getErrorMessage(error: any): string {
  // 1. Check for JSend Success/Fail data message
  const resData = error?.response?.data;
  
  if (resData) {
    // Handling Joi/Validation arrays
    if (resData.status === "fail" && Array.isArray(resData.data)) {
      return resData.data.map((err: any) => err.message).join(" • ");
    }
    // Handling standard AppError messages
    if (resData.message) return resData.message;
  }

  // 2. Fallback to standard Axios/JS error
  if (error?.message) return error.message;
  
  return "An unexpected error occurred. Please try again.";
}
