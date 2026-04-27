import { contribute } from "@/api/contribution";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useContribute = () => {
  return useMutation({
    mutationFn: contribute,

    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Failed to create contribution. Please try again.";
      toast.error(message);
    },
  });
};
