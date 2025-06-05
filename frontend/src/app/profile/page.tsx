"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import OnboardingModal from "@/components/OnboardingModal";
import AvatarUpload from "@/components/AvatarUpload";
import ProfileProgressBar from "@/components/ProfileProgressBar";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<'success'|'error'|'info'>("info");
  const [onboarding, setOnboarding] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  // Profile completeness calculation (simple example)
  const completeness = (name && email) ? 100 : 50;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("onboarded-profile")) {
      setOnboarding(true);
      localStorage.setItem("onboarded-profile", "1");
    }
  }, []);

  useEffect(() => {
    if (message) {
      setToastMsg(message);
      setShowToast(true);
      setToastType(message.toLowerCase().includes("fail") ? "error" : "success");
    }
  }, [message]);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return null; // Redirects to /login if not authenticated

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    if (res.ok) {
      setMessage("Profile updated!");
    } else {
      setMessage("Update failed");
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    const res = await fetch("/api/profile", { method: "DELETE" });
    if (res.ok) {
      signOut();
    } else {
      setMessage("Account deletion failed");
    }
  }

  async function handleAvatarChange(file: File) {
    // Placeholder: upload logic here
    setAvatarUrl(URL.createObjectURL(file));
    setToastMsg("Avatar updated!");
    setToastType("success");
    setShowToast(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 animate-fade-in">
      <OnboardingModal open={onboarding} onClose={() => setOnboarding(false)} />
      {showToast && (
        <Toast message={toastMsg} type={toastType} onClose={() => setShowToast(false)} />
      )}
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/90 dark:bg-gray-900/90 border border-indigo-100 dark:border-indigo-800 backdrop-blur-lg animate-fade-in-up">
        <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-6 text-center tracking-tight">Profile</h1>
        <AvatarUpload avatarUrl={avatarUrl} onChange={handleAvatarChange} />
        <ProfileProgressBar percent={completeness} />
        <form onSubmit={handleUpdate} className="space-y-4" autoComplete="on">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1" htmlFor="name">Name</label>
          <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-indigo-200 dark:border-indigo-700 bg-white/80 dark:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base" required aria-label="Name" />
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1" htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-indigo-200 dark:border-indigo-700 bg-white/80 dark:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base" required aria-label="Email" />
          <button type="submit" className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow transition neural-pulse focus-visible:ring-4 focus-visible:ring-blue-400">Update Profile</button>
        </form>
        <button onClick={handleDelete} className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow transition mt-4 neural-pulse focus-visible:ring-4 focus-visible:ring-red-400">Delete Account</button>
        <div aria-live="polite" className="min-h-[1.5em]">
          {message && <p className="mt-2 text-center animate-fade-in-up">{message}</p>}
        </div>
        <button onClick={() => signOut()} className="w-full py-3 rounded-lg bg-gray-300 hover:bg-gray-400 text-black font-bold text-lg shadow transition mt-4 neural-pulse focus-visible:ring-4 focus-visible:ring-gray-400">Sign Out</button>
      </div>
    </div>
  );
}
