"use client";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import Toast from "@/components/Toast";
import OnboardingModal from "@/components/OnboardingModal";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [onboarding, setOnboarding] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("onboarded-login")) {
      setOnboarding(true);
      localStorage.setItem("onboarded-login", "1");
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      setToastMsg("Login failed: Invalid credentials");
      setShowToast(true);
    } else {
      setToastMsg("Login successful!");
      setShowToast(true);
      setTimeout(() => { window.location.href = "/profile"; }, 800);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 animate-fade-in">
      <OnboardingModal open={onboarding} onClose={() => setOnboarding(false)} />
      {showToast && (
        <Toast message={toastMsg} type={error ? "error" : "success"} onClose={() => setShowToast(false)} />
      )}
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/90 dark:bg-gray-900/90 border border-indigo-100 dark:border-indigo-800 backdrop-blur-lg animate-fade-in-up">
        <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-6 text-center tracking-tight">
          Sign In to PORTMAN
        </h1>
        <form onSubmit={handleLogin} className="space-y-6" autoComplete="on">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-indigo-200 dark:border-indigo-700 bg-white/80 dark:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
              required
              autoFocus
              aria-label="Email"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-indigo-200 dark:border-indigo-700 bg-white/80 dark:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base pr-12"
                required
                aria-label="Password"
                aria-describedby="login-error"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 text-lg focus:outline-none"
                tabIndex={0}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{ pointerEvents: 'auto' }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center ripple neural-pulse focus-visible:ring-4 focus-visible:ring-indigo-400"
            aria-busy={loading}
          >
            {loading ? (
              <span className="loader mr-2"></span>
            ) : null}
            Sign In
          </button>
        </form>
        <div id="login-error" aria-live="polite" className="min-h-[1.5em]">
          {error && (
            <p className="text-red-500 mt-4 text-center font-semibold animate-fade-in-up">{error}</p>
          )}
        </div>
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-indigo-600 dark:text-indigo-300 font-semibold underline hover:text-indigo-800 dark:hover:text-indigo-100 transition"
          >
            Register
          </a>
        </div>
        <div className="mt-2 text-center">
          <a
            href="#"
            className="text-xs text-indigo-500 dark:text-indigo-300 underline hover:text-indigo-700 dark:hover:text-indigo-100"
          >
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}
