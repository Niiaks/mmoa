import { getCampaignBySlug } from "@/api/campaign";
import { useQuery } from "@tanstack/react-query";

export const useGetCampaignSlug = (slug) => {
  return useQuery({
    queryKey: ["campaign", slug],
    queryFn: () => getCampaignBySlug(slug),
    enabled: !!slug, // don't fetch if slug is undefined
  });
};
