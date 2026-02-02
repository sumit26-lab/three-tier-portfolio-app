import { useState } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { apiFetch } from "@/lib/apiClient";
import { toast } from "sonner";

import { Loader2, Lock } from "lucide-react";

export default function Login() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* ================= LOGIN ================= */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    try {
      const data = await apiFetch<{ token: string }>("/api/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      if (!data?.token) {
      toast.error("Invalid username or password ❌");
      setIsLoading(false);
      return; // 🚨 NO redirect
    }

    /* ✅ only success case */

      /* ✅ save token */
      localStorage.setItem("token", data.token);

      /* ✅ refresh queries */
      await queryClient.invalidateQueries();

      /* ✅ success toast */
      toast.success("Login successful 🚀 Redirecting...");

      /* smooth delay */
      setTimeout(() => {
        navigate("/admin");
      }, 800);

    } catch (err: any) {
      toast.error(err?.message || "Invalid username or password ❌");
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-slate-900
      via-slate-800
      to-slate-900
      px-4
    "
    >
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border bg-background/95 backdrop-blur">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <Lock className="w-7 h-7 text-primary" />
          </div>

          <CardTitle className="text-3xl font-bold">
            Admin Login
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Secure access to dashboard
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">

            <Input
              placeholder="Username"
              value={username}
              disabled={isLoading}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11"
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              disabled={isLoading}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
              required
            />

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login to Dashboard"
              )}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
