import api from "@/lib/axios";

interface LoginPayload {
  email: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  const response = await api.post("/auth/login", payload);

  return response.data;
}