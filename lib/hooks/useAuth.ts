import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { userAtom, XUser } from "../atoms";

interface SessionResponse {
  user: XUser | null;
}

export function useAuth() {
  const [user, setUser] = useAtom(userAtom);
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const { data, isLoading, error, refetch } = useQuery<SessionResponse>({
    queryKey: ["session"],
    queryFn: async () => {
      const response = await fetch(`${backendUrl}/auth/session`, {
        credentials: "include",
      });
      if (!response.ok) {
        return { user: null };
      }
      const userData = await response.json();
      return { user: userData };
    },
    refetchOnMount: true,
    retry: false,
  });

  // Sync user data with Jotai atom
  if (data?.user && data.user !== user) {
    setUser(data.user);
  } else if (!data?.user && user) {
    setUser(null);
  }

  const logout = async () => {
    await fetch(`${backendUrl}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    window.location.href = "/login";
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    refetch,
    logout,
  };
}
