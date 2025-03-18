/**
 * Format a date to ISO string
 */
export const formatDate = (date: Date): string => {
  return date.toISOString();
};

/**
 * Format a timestamp to a Date object
 */
export const fromTimestamp = (timestamp: number): Date => {
  return new Date(timestamp * 1000); // Convert seconds to milliseconds
};

/**
 * Get current timestamp in seconds
 */
export const getCurrentTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

/**
 * Calculate time difference in a human-readable format
 */
export const getTimeDifference = (date1: Date, date2: Date = new Date()): string => {
  const diffMs = Math.abs(date2.getTime() - date1.getTime());
  const diffSecs = Math.floor(diffMs / 1000);
  
  if (diffSecs < 60) {
    return `${diffSecs} seconds`;
  }
  
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) {
    return `${diffMins} minutes`;
  }
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours} hours`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days`;
}; 