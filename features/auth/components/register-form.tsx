"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register, UserRole } from "../services/register";

/**
 * Client-side form component for registering a new user account.
 * Includes basic validation and password visibility toggles.
 */
/*
edit start
by: Zahra Hilyatul J
date: 2026-06-29
description: Added complete registration form state handling, validation, API integration, error/success states, and UI fields
*/
export const RegisterForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CANDIDATE");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Password dan Konfirmasi Password tidak cocok.");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name,
        email,
        password,
        role,
      });

      // Redirect ke login
      router.push("/login?registered=true");
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || error.message || "Gagal melakukan registrasi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-6 shadow-sm bg-background">
      <div className="space-y-1 mb-6">
        <h1 className="text-2xl font-bold">
          Register
        </h1>

        <p className="text-sm text-muted-foreground">
          Buat akun baru
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
          {errorMsg}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Nama
          </label>

          <Input
            type="text"
            placeholder="Masukkan nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Email
          </label>

          <Input
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Role
          </label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="CANDIDATE">Candidate</option>
            <option value="INTERVIEWER">HR / Interviewer</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Password
          </label>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Konfirmasi Password
          </label>

          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Konfirmasi password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && (
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
          )}

          Register
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};
/*
edit end
*/