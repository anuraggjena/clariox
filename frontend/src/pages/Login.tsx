import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Mail, Lock, ArrowRight, PenLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 font-sans text-zinc-900 dark:text-zinc-100">
      <div className="w-full max-w-100">
        
        {/* Minimalist Branding Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-sm">
            <PenLine className="text-primary-foreground h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to your Smart Editor account
          </p>
        </div>

        {/* Clean, Floating Card */}
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm dark:bg-zinc-900/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-600 dark:text-zinc-400">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 bg-white dark:bg-zinc-900 transition-colors focus-visible:ring-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-zinc-600 dark:text-zinc-400">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-white dark:bg-zinc-900 transition-colors focus-visible:ring-1"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Modern Error Callout */}
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center">
                  {error}
                </div>
              )}

              {/* Enhanced Submit Button */}
              <Button className="w-full h-10 mt-2 font-medium" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center pb-6 border-t border-zinc-100 dark:border-zinc-800 pt-6 mt-2">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:underline hover:text-primary/90 transition-colors"
              >
                Create one
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}