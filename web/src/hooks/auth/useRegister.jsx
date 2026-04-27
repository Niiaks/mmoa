import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { register } from "@/api/auth";
export const useRegister = () => {
  return useMutation({
    mutationFn: register,

    onSuccess: () => {
      toast.success("Registration successful!");
    },

    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please check your connectivity and try again.";
      toast.error(message);
    },
  });
};
