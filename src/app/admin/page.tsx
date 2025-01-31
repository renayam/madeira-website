"use client";

import React, { useState, FormEvent } from "react";
import { NextPage } from "next";
import { redirect } from "next/navigation";

const AdminPage: NextPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username === "admin" && password === "p") {
      redirect("/admin/service/create");
    } else {
      setError("Invalid username or password");
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
            className="w-full rounded-md bg-white py-2 font-bold text-gray-900 transition duration-300 hover:bg-gray-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
