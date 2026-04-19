import api from "./client";
export const contribute = async (contributionData) => {
  const { data } = await api.post("/api/v1/contributions", contributionData);
  return data;
};

export const verifyContribution = async (reference) => {
  const { data } = await api.get(`/api/v1/contributions/verify/${reference}`);
  return data;
};

export const getContributions = async (campaignId) => {
  const { data } = await api.get(`/api/v1/contributions/${campaignId}`);
  return data;
};
