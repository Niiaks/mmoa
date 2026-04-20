import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const logout = () => {
    queryClient.removeQueries({ queryKey: ["auth", "me"] });
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        error,
        logout,
        refetchUser: () =>
          queryClient.invalidateQueries({ queryKey: ["auth", "me"] }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
