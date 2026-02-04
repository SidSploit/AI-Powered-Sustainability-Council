
export const sanitizeInput = (text: string, maxLength: number = 4000): string => {
  if (!text) return '';
  // Basic HTML tag stripping
  const stripped = text.replace(/<[^>]*>?/gm, '');
  // Trim and limit length
  return stripped.trim().slice(0, maxLength);
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};
