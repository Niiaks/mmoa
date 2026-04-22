import api from "./client";

export const withdrawMoney = async ({ campaignId, momoNumber }) => {
  const { data } = await api.post(
    `/api/v1/withdrawals/${campaignId}`,
    { momoNumber },
  );
  return data;
};
