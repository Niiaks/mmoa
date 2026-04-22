import { getPreviewWithdrawal } from "@/api/withdrawals";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";


export const usePreviewWithdrawal = (campaignId) => {
  const query = useQuery({
    queryKey: ["preview-withdrawal", campaignId],
    queryFn: () => getPreviewWithdrawal(campaignId),
    enabled: !!campaignId,

  });

  useEffect(() => {
    if (query.isError) {
      const message =
        query.error.response?.data?.message ||
        "Failed to fetch preview. Please try again.";
      toast.error(message);
    }
  }, [query.isError]);

  return query;
}