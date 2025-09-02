// src/hooks/useLogout.ts
export const useLogout = () => {
  const handleLogout = async () => {
    try {
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL // use NEXT_PUBLIC_ for frontend env
          : "http://localhost:5000";

      const response = await fetch(`${baseUrl}/api/users/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        localStorage.clear();
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { handleLogout };
};
