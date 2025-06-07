// Global logging utility for frontend
export async function logEventFrontend({ level = "info", message, details = {} }: { level?: string; message: string; details?: Record<string, any> }) {
  try {
    await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, message, details }),
    });
  } catch (e) {
    // Ignore logging errors
  }
}
