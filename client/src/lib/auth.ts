import { useQuery } from "@tanstack/react-query";
import { type User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/me"],
    retry: false,
    staleTime: Infinity,
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
  };
}

export function getLoginUrl(): string {
  return "/api/login";
}

export function getLogoutUrl(): string {
  return "/api/logout";
}
