"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      // simulasi login
      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );

      console.log("login success");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-6 shadow-sm bg-background">
      <div className="space-y-1 mb-6">
        <h1 className="text-2xl font-bold">
          Login
        </h1>

        <p className="text-sm text-muted-foreground">
          Masuk ke akun anda
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Email
          </label>

          <Input
            type="email"
            placeholder="Masukkan email"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Password
          </label>

          <div className="relative">
            <Input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Masukkan password"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? (
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

          Login
        </Button>
      </form>
    </div>
  );
};