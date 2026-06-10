import { LoginForm } from "@/features/auth/components/login-form";

/**
 * Next.js page route for the Login screen.
 * Path: /login
 */
const LoginPage = () => {
  return ( 
    <div className="w-full">
      <LoginForm />
    </div>
  );
}
 
export default LoginPage;