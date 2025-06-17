"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SignInSignUpForm() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header with animated background */}
        <div className="relative bg-gradient-to-r from-green-400 to-pink-400 p-6 text-center">
          <motion.div
            animate={{
              background:
                mode === "sign-in"
                  ? [
                      "linear-gradient(to right, #39ff14, #ff00a8)",
                      "linear-gradient(to right, #ff00a8, #39ff14)",
                      "linear-gradient(to right, #39ff14, #ff00a8)",
                    ]
                  : [
                      "linear-gradient(to right, #ff00a8, #00e1ff)",
                      "linear-gradient(to right, #00e1ff, #ff00a8)",
                      "linear-gradient(to right, #ff00a8, #00e1ff)",
                    ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0"
          />
          <div className="relative z-10">
            <h2 className="font-8bit text-2xl text-black mb-2">
              {mode === "sign-in" ? "Welcome Back!" : "Join Portman!"}
            </h2>
            <p className="font-sans text-black/80">
              {mode === "sign-in"
                ? "Sign in to your account"
                : "Create your 8-bit career profile"}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-black">
          <button
            className={`flex-1 py-3 font-8bit text-sm transition-all duration-300 ${
              mode === "sign-in"
                ? "bg-green-400 text-black border-b-2 border-green-500"
                : "bg-black text-green-400 hover:bg-green-900 border-b-2 border-transparent"
            }`}
            onClick={() => setMode("sign-in")}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-3 font-8bit text-sm transition-all duration-300 ${
              mode === "sign-up"
                ? "bg-pink-400 text-black border-b-2 border-pink-500"
                : "bg-black text-pink-400 hover:bg-pink-900 border-b-2 border-transparent"
            }`}
            onClick={() => setMode("sign-up")}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <div className="p-6 bg-black">
          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === "sign-in" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "sign-in" ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              {mode === "sign-up" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-green-300 font-8bit text-xs mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 rounded-lg bg-black border-2 border-green-400 text-green-200 font-sans focus:outline-none focus:border-pink-400 transition-colors"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-green-300 font-8bit text-xs mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 rounded-lg bg-black border-2 border-green-400 text-green-200 font-sans focus:outline-none focus:border-pink-400 transition-colors"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-green-300 font-8bit text-xs mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-lg bg-black border-2 border-green-400 text-green-200 font-sans focus:outline-none focus:border-pink-400 transition-colors"
                      placeholder="pixelmaster123"
                      required
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-green-300 font-8bit text-xs mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-3 rounded-lg bg-black border-2 border-green-400 text-green-200 font-sans focus:outline-none focus:border-pink-400 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-green-300 font-8bit text-xs mb-2">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-3 pr-12 rounded-lg bg-black border-2 border-green-400 text-green-200 font-sans focus:outline-none focus:border-pink-400 transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-green-400 hover:text-pink-400 transition-colors"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {mode === "sign-up" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-green-300 font-8bit text-xs mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="w-full p-3 rounded-lg bg-black border-2 border-green-400 text-green-200 font-sans focus:outline-none focus:border-pink-400 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </motion.div>
              )}

              {mode === "sign-in" && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-green-300 font-sans">
                    <input type="checkbox" className="mr-2 accent-green-400" />
                    Remember me
                  </label>
                  <a
                    href="#"
                    className="text-pink-400 hover:text-pink-300 font-sans"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-lg font-8bit text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black ${
                  mode === "sign-in"
                    ? "bg-green-400 hover:bg-green-500 focus:ring-green-400"
                    : "bg-pink-400 hover:bg-pink-500 focus:ring-pink-400"
                } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2"></div>
                    {mode === "sign-in" ? "Signing In..." : "Creating Account..."}
                  </div>
                ) : mode === "sign-in" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </motion.button>

              {/* Social Login */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-green-400/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-black px-2 text-green-300 font-sans">
                    or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 border border-green-400 rounded-lg text-green-400 font-sans text-sm hover:bg-green-400 hover:text-black transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 border border-green-400 rounded-lg text-green-400 font-sans text-sm hover:bg-green-400 hover:text-black transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.83.403-.09.352-.292 1.183-.333 1.35-.053.218-.173.265-.402.159-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                  GitHub
                </button>
              </div>
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
