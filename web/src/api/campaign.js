import api from "./client";

export const createCampaign = async (campaignData) => {
  const { data } = await api.post("/api/v1/campaigns", campaignData);
  return data;
};

export const getOrganizerCampaign = async () => {
  const { data } = await api.get("/api/v1/campaigns/me");
  return data;
};

export const getCampaignBySlug = async (slug) => {
  const { data } = await api.get(`/api/v1/campaigns/slug/${slug}`);
  return data;
};

export const getCampaignById = async (id) => {
  const { data } = await api.get(`/api/v1/campaigns/${id}`);
  return data;
};

export const closeCampaign = async (campaignId) => {
  const { data } = await api.patch(`/api/v1/campaigns/${campaignId}/close`);
  return data;
};

export const extendCampaignDeadline = async (campaignId) => {
  const { data } = await api.patch(`/api/v1/campaigns/${campaignId}/extend`);
  return data;
};
