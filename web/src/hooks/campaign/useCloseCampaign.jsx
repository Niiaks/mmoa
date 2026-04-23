import { closeCampaign } from "@/api/campaign";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCloseCampaign = (campaignId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => closeCampaign(campaignId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["campaigns", campaignId],
      });

      toast.success("Campaign closed successfully!");
    },

    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Failed to close campaign. Please try again.";
      toast.error(message);
    },
  });
};
