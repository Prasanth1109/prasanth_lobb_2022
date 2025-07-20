export const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/); // Split by any spaces
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
};