"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginClient({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "Login failed.");
      }

      router.push(nextPath || "/admin");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Agentra Admin</p>
      <h1 className="mt-3 text-3xl font-bold">Protected dashboard</h1>
      <p className="mt-3 text-sm text-slate-400">
        Enter the admin password to access live leads, filters, and pipeline stats.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Admin password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
            placeholder="Enter password"
            required
          />
        </div>

        {error && (
          <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 via-brand-blue to-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Open admin dashboard"}
        </button>
      </form>
    </div>
  );
}