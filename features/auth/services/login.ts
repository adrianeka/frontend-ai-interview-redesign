import api from "@/lib/axios";

/**
 * Payload interface for authentication credentials.
 */
interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Expected response structure from the login API endpoint.
 */
export interface LoginResponse {
  token: string;
  type: string;
}

/**
 * Submits user credentials to the authentication service and returns the JWT token.
 * 
 * @param payload - The user's email and password
 * @returns The login response containing the token
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", payload);

  return response.data;
}