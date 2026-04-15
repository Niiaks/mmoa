/**
 * Converts an international Ghanaian number (+233XXXXXXXXX) to the local
 * format expected by Paystack's MoMo transfer API (0XXXXXXXXX).
 *
 * Throws if the input is not in the expected +233 format so misuse is caught
 * immediately rather than silently producing a garbage account number.
 *
 * @param {string} phone  e.g. "+233241234567"
 * @returns {string}      e.g. "0241234567"
 */
export const toLocale = (phone) => {
  if (!phone || !phone.startsWith("+233") || phone.length !== 13) {
    throw new Error(
      `toLocale: expected "+233XXXXXXXXX" (13 chars), got "${phone}"`,
    );
  }
  return "0" + phone.slice(4);
};
