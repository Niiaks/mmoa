import { createCampaign } from "@/api/campaign";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCampaign,

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["campaigns"] });

      toast.success("Campaign created successfully!");
    },

    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Failed to create campaign. Please try again.";
      toast.error(message);
    },
  });
};
