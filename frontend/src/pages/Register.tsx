import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(email, password);
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-zinc-950 lg:grid lg:grid-cols-2 font-sans">
      
      {/* --- LEFT COLUMN: BRAND VISUAL --- */}
      <div className="hidden lg:flex flex-col justify-between p-10 m-4 rounded-[2rem] bg-zinc-900 relative overflow-hidden">
        {/* Abstract Fluid Background Image - Different from Login */}
        <div className="absolute inset-0 z-0">
          <img
            src="/register.jpg"
            alt="Abstract Fluid Colors"
            className="h-full w-full object-cover opacity-90"
          />
          {/* Dark gradient overlay for text readability at the bottom */}
          <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/90"></div>
        </div>

        {/* Top Brand Text */}
        <div className="relative z-10 flex items-center text-xs font-semibold tracking-widest text-white/80 uppercase">
          <span className="h-px w-8 bg-white/80 mr-4"></span>
          ClarioX
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-10 mt-auto pb-4">
          <h1 className="text-5xl font-serif text-white leading-[1.1] mb-6 tracking-tight">
            Start Your <br /> Journey Here.
          </h1>
          <p className="text-zinc-300 text-sm max-w-sm leading-relaxed">
            <strong>Join the next generation of creators.</strong> <br/>
            Experience the power of an AI-driven, block-based editor designed for ultimate focus and clarity.
          </p>
        </div>
      </div>

      {/* --- RIGHT COLUMN: REGISTRATION FORM --- */}
      <div className="flex items-center justify-center p-8 sm:p-12 relative">
        <div className="mx-auto w-full max-w-100 space-y-8">
          
          {/* Logo / Header */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="ClarioX Logo" className="h-30 w-30" />
            </div>
            
            <h2 className="text-4xl font-sans tracking-tight text-zinc-900 dark:text-zinc-100">
              Create an Account
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3">
              Enter your details below to get started for free
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="h-12 bg-zinc-50 dark:bg-zinc-900 border-transparent focus-visible:ring-1 focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-700 transition-all rounded-xl px-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  className="h-12 bg-zinc-50 dark:bg-zinc-900 border-transparent focus-visible:ring-1 focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-700 transition-all rounded-xl px-4 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="pt-1 pb-2">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                By signing up, you agree to our{" "}
                <a href="#" className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline">Privacy Policy</a>.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-500 font-medium text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button 
              className="w-full h-12 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 font-medium text-[15px] transition-all" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
              >
                Log In
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}