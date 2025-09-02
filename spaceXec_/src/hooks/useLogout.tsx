// src/hooks/useLogout.ts
export const useLogout = () => {
  const handleLogout = async () => {
    try {
      const baseUrl =
        import.meta.env.MODE === "production"
          ? import.meta.env.VITE_BACKEND_URL
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
