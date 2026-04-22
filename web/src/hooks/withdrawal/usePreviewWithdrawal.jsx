import { getPreviewWithdrawal } from "@/api/withdrawals";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";


export const usePreviewWithdrawal = (campaignId) => {
  return useQuery({
    queryKey: ["preview-withdrawal", campaignId],
    queryFn: () => getPreviewWithdrawal(campaignId),
    enabled: !!campaignId,
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Failed to fetch preview. Please try again.";
      toast.error(message);
    }
  });
}