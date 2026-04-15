/**
 * Normalizes a Ghanaian phone number to the international format +233XXXXXXXXX.
 *
 * Accepted inputs:
 *   +233XXXXXXXXX  (already international)
 *   233XXXXXXXXX   (international without +)
 *   0XXXXXXXXX     (local 10-digit)
 *   XXXXXXXXX      (bare 9-digit)
 *
 * Returns null if the number cannot be normalized to a valid 9-digit Ghanaian
 * subscriber number, so callers can handle invalid input explicitly.
 *
 * @param {string} raw
 * @returns {string|null}  e.g. "+233241234567" or null
 */
export const normalizePhone = (raw) => {
  if (!raw || typeof raw !== "string") return null;

  // Strip whitespace, dashes, parentheses
  const stripped = raw.replace(/[\s\-().]/g, "");

  let digits;

  if (stripped.startsWith("+233")) {
    digits = stripped.slice(4); // remove +233
  } else if (stripped.startsWith("233")) {
    digits = stripped.slice(3); // remove 233
  } else if (stripped.startsWith("0")) {
    digits = stripped.slice(1); // remove leading 0
  } else {
    digits = stripped; // assume bare 9-digit
  }

  // A valid Ghanaian subscriber number is exactly 9 digits
  if (!/^\d{9}$/.test(digits)) return null;

  return `+233${digits}`;
};
