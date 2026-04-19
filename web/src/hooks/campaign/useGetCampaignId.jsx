import { getCampaignById } from "@/api/campaign";
import { useQuery } from "@tanstack/react-query";

export const useGetCampaignId = (id) => {
  return useQuery({
    queryKey: ["campaign", id],
    queryFn: () => getCampaignById(id),
    enabled: !!id, // don't fetch if id is undefined
  });
};
