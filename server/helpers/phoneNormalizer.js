export const normalizePhone = (phone) => {
  if (phone.length === 14 && phone[4] === "0") {
    phone = phone.slice(0, 4) + phone.slice(5);
  }
  return phone;
};
