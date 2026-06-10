import { RegisterForm } from "@/features/auth/components/register-form";

/**
 * Next.js page route for the Registration screen.
 * Path: /register
 */
const RegisterPage = () => {
  return (
    <div className="w-full">
      <RegisterForm />
    </div>
  );
}
 
export default RegisterPage;