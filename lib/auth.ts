export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

export const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return;
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax; Secure`;
};

export const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Max-Age=-99999999; path=/; SameSite=Lax; Secure`;
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return getCookie("token");
};

export const setToken = (token: string) => {
  setCookie("token", token);
};

export const removeToken = () => {
  deleteCookie("token");
};

export const logout = () => {
  removeToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};