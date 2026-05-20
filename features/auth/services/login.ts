import api from "@/lib/axios";

interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", payload);

  return response.data;
}