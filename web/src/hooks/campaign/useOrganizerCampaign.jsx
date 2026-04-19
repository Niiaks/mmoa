import { getOrganizerCampaign } from "@/api/campaign";
import { useQuery } from "@tanstack/react-query";
export const useOrganizerCampaign = () => {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: getOrganizerCampaign,

    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Failed to fetch campaigns. Please try again.";
      toast.error(message);
    },
  });
};
