"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type L from "leaflet";

type Stadium = {
  name: string;
  city: string;
  sport: string;
  lat?: number;
  lng?: number;
  visited?: boolean;
};

export default function StadiumTracker() {
  const router = useRouter();
  const { user, loading, logout, addStadium } = useAuth();
  const [newStadium, setNewStadium] = useState({ name: "", city: "", sport: "" });
  const [view, setView] = useState<"list" | "map">("list");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0d12] text-[#e6eef6] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const stadiums = user.stadiums;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = "leaflet-css";
      if (!document.getElementById(id)) {
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (view !== "map") return;

    // Dynamically import Leaflet only in the browser
    import("leaflet").then((L) => {
      const leaflet = L.default;
      const map = leaflet.map("map").setView([37.8, -96], 4);

      leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);

      stadiums.forEach((s) => {
        if (s.lat && s.lng) {
          leaflet.marker([s.lat, s.lng]).addTo(map).bindPopup(`<b>${s.name}</b><br>${s.city}`);
        }
      });

      return () => {
        map.remove();
      };
    });
  }, [view, stadiums]);

  const sports = [...new Set(stadiums.map((s) => s.sport))];

  const handleAddStadium = async () => {
    if (!newStadium.name.trim() || !newStadium.city.trim() || !newStadium.sport.trim()) return;
    try {
      setError("");
      await addStadium({ ...newStadium, visited: true });
      setNewStadium({ name: "", city: "", sport: "" });
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || "Failed to add stadium");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d12] text-[#e6eef6] p-6 flex flex-col items-center gap-6">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center">
        <h1 className="text-4xl font-bold">Stadium Tracker</h1>
        <div className="flex gap-3">
          <Link href="/profile">
            <Button variant="outline">Profile</Button>
          </Link>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
      </div>

      {/* View Toggle & Add Button */}
      <div className="w-full max-w-4xl flex gap-3 justify-center">
        <Button onClick={() => setView("list")} variant={view === "list" ? "default" : "outline"}>List View</Button>
        <Button onClick={() => setView("map")} variant={view === "map" ? "default" : "outline"}>Map View</Button>
        <Button onClick={() => setShowModal(true)} className="rounded-2xl">+ Add Stadium</Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-4xl p-3 rounded bg-red-900/20 border border-red-700/40 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Stadium List View */}
      {view === "list" && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          {stadiums.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-400 mb-4">No stadiums yet. Add one to get started!</p>
              <Button onClick={() => setShowModal(true)}>+ Add Stadium</Button>
            </div>
          ) : (
            sports.map((sport) => (
              <div key={sport} className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold">{sport}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stadiums
                    .filter((s) => s.sport === sport)
                    .map((s, i) => (
                      <Card key={i} className="shadow-md">
                        <CardContent className="p-4 flex flex-col gap-1">
                          <h2 className="text-xl font-semibold">{s.name}</h2>
                          <p className="text-gray-300">{s.city}</p>
                          <span className="text-sm text-green-400 font-medium">Visited ✓</span>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Map View */}
      {view === "map" && (
        <div className="w-full max-w-4xl h-96 bg-neutral-900 rounded-2xl shadow">
          <div id="map" className="w-full h-full rounded-2xl" />
        </div>
      )}

      {/* Add Stadium Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-neutral-900 p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-6">Add a Stadium</h3>
            
            <div className="flex flex-col gap-4 mb-6">
              <Input
                placeholder="Stadium Name"
                value={newStadium.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewStadium({ ...newStadium, name: e.target.value })}
              />
              <Input
                placeholder="City"
                value={newStadium.city}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewStadium({ ...newStadium, city: e.target.value })}
              />
              <Input
                placeholder="Sport (e.g., Baseball, Football, Soccer, Hockey)"
                value={newStadium.sport}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewStadium({ ...newStadium, sport: e.target.value })}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddStadium} className="flex-1">Add Stadium</Button>
              <Button onClick={() => {
                setShowModal(false);
                setNewStadium({ name: "", city: "", sport: "" });
                setError("");
              }} variant="outline" className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
