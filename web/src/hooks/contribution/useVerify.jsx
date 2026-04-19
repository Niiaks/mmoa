import { verifyContribution } from "@/api/contribution";
import { useQuery } from "@tanstack/react-query";

export const useVerifyContribution = (reference) => {
  return useQuery({
    queryKey: ["verify-contribution", reference],
    queryFn: () => verifyContribution(reference),
    enabled: !!reference,
  });
};
