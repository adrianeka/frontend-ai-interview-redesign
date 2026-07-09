import api from "@/lib/axios";

/**
 * Available user roles for registration.
 */
export type UserRole = "CANDIDATE" | "INTERVIEWER";

/**
 * Payload interface for registering a new user account.
 */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  role_candidate?: string;
  experience_years?: string;
}

/**
 * Submits a new user registration request to the backend.
 * On success, the backend returns a 200 OK with a plain text message.
 *
 * @param payload - The registration details
 */
export async function register(payload: RegisterPayload): Promise<void> {
  await api.post("/auth/register", payload);
}
