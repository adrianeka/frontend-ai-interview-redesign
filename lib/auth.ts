export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;

  return !!localStorage.getItem("token");
};

export const getToken = () => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};