"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [stadiumCount, setStadiumCount] = useState(0);
  const [visitedCount, setVisitedCount] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    setStadiumCount(user.stadiums.length);
    setVisitedCount(user.stadiums.filter((s) => s.visited).length);
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#0a0d12] text-[#e6eef6] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Profile</h1>
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline">Back to Tracker</Button>
            </Link>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* User Info Card */}
          <div className="bg-neutral-900 rounded-2xl p-6 shadow">
            <h2 className="text-2xl font-semibold mb-4">User Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-neutral-400 text-sm">Username</p>
                <p className="text-lg font-medium">{user.username}</p>
              </div>
              <div>
                <p className="text-neutral-400 text-sm">Email</p>
                <p className="text-lg font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-neutral-400 text-sm">User ID</p>
                <p className="text-sm font-mono text-neutral-500">{user.id}</p>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-neutral-900 rounded-2xl p-6 shadow">
            <h2 className="text-2xl font-semibold mb-4">Stadium Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Total Stadiums</span>
                <span className="text-3xl font-bold text-blue-400">
                  {stadiumCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Visited</span>
                <span className="text-3xl font-bold text-green-400">
                  {visitedCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">To Visit</span>
                <span className="text-3xl font-bold text-yellow-400">
                  {stadiumCount - visitedCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Stadiums */}
        <div className="bg-neutral-900 rounded-2xl p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">Your Stadiums</h2>
          {user.stadiums.length === 0 ? (
            <p className="text-neutral-400">
              You haven't added any stadiums yet.{" "}
              <Link href="/" className="text-blue-400 hover:underline">
                Go add some!
              </Link>
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.stadiums.slice(0, 6).map((stadium, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700/40"
                >
                  <h3 className="font-semibold">{stadium.name}</h3>
                  <p className="text-sm text-neutral-400">{stadium.city}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-neutral-500">
                      {stadium.sport}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        stadium.visited
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {stadium.visited ? "✓ Visited" : "To Visit"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
