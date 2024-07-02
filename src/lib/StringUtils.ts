// utils/stringUtils.ts

/**
 * Converts a string to snake_case.
 * @param {string} str - The string to convert.
 * @return {string} The converted snake_case string.
 */
export function toSnakeCase(str: string) {
  return str
    .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
    .trim() // Trim leading and trailing spaces
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, '_'); // Replace spaces with underscores
}
