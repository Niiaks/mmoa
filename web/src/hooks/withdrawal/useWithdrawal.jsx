import { withdrawMoney } from "@/api/withdrawals";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useWithdrawal = () => {
  return useMutation({
    mutationFn: withdrawMoney,

    onSuccess: () => {
      toast.success("Withdrawal successful! Your money is on the way.");
    },

    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Failed to withdraw money. Please try again.";
      toast.error(message);
    },
  });
};
