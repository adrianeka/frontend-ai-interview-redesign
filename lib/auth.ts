/**
 * Retrieves a cookie value by name.
 */
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

/**
 * Logs out the current user and redirects to the login page.
 */
export const logout = () => {
  removeToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

/**
 * Interface representing the structure of our decoded JWT tokens.
 */
export interface DecodedToken {
  role?: string;
  name?: string;
  userId?: string;
  sub?: string;
  [key: string]: any;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getDecodedToken = (): DecodedToken | null => {
  const token = getToken();
  if (!token) return null;
  return decodeToken(token);
};