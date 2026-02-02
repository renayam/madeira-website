"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin/prestation/create");
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-sm rounded-lg border border-gray-300 bg-primary p-6">
        <h1 className="text-center text-2xl font-semibold text-white">
          Admin Page
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your username"
            />
            <small className="text-xs text-gray-500">
              Enter your username.
            </small>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-800 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
            <small className="text-xs text-gray-500">
              Enter your password.
            </small>
          </div>
          {error && (
            <p role="alert" className="text-red-500">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-white py-2 font-bold text-gray-900 transition duration-300 hover:bg-gray-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
