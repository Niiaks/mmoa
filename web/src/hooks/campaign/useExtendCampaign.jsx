import { extendCampaignDeadline } from "@/api/campaign";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useExtendCampaign = (campaignId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => extendCampaignDeadline(campaignId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["campaigns", campaignId],
      });

      toast.success("Campaign extended successfully!");
    },

    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Failed to extend campaign. Please try again.";
      toast.error(message);
    },
  });
};
