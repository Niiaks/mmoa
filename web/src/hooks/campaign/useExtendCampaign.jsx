import { extendCampaignDeadline } from "@/api/campaign";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useExtendCampaign = (campaignId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deadline) => extendCampaignDeadline({ campaignId, deadline }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["campaign", campaignId],
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
