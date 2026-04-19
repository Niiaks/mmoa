import { getContributions } from "@/api/contribution";
import { useQuery } from "@tanstack/react-query";

export const useGetContributions = (campaignId) => {
  return useQuery({
    queryKey: ["contributions", campaignId],
    queryFn: () => getContributions(campaignId),
    enabled: !!campaignId, // don't fetch if id is undefined
  });
};
