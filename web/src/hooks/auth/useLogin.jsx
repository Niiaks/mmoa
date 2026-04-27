import { login } from "@/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      toast.success("Login successful! Welcome back.");
      navigate("/dashboard", { replace: true });
    },

    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Login Failed. Please check your connectivity and try again.";
      toast.error(message);
    },
  });
};
