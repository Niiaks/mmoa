const networks = {
  24: "MTN",
  54: "MTN",
  55: "MTN",
  59: "MTN",
  53: "MTN",
  20: "VDF",
  50: "VDF",
  26: "ATL",
  56: "ATL",
  27: "ATL",
  57: "ATL",
  58: "ATL",
};
export const detectNetwork = (phone) => {
  const res = phone.substring(4, 6);
  return networks[res] || null;
};
