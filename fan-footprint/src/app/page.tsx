"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import arenas from "@/lib/arenas.json";
import type L from "leaflet";

type Arena = {
  team: string;
  city: string;
  league: string;
  division: string;
  lat: number;
  lng: number;
};

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
  const { user, loading, logout, addStadium, deleteStadium } = useAuth();
  const [newStadium, setNewStadium] = useState<Stadium>({ name: "", city: "", sport: "" });
  const [view, setView] = useState<"list" | "map">("list");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArenas, setFilteredArenas] = useState<Arena[]>([]);
  const [showArenaDropdown, setShowArenaDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Load Leaflet CSS on mount
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

  // Initialize map when view changes to map
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (view !== "map") return;
    if (!user) return;

    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    // Dynamically import Leaflet only in the browser
    import("leaflet").then((L) => {
      const leaflet = L.default;
      const map = leaflet.map("map").setView([37.8, -96], 4);

      leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);

      user.stadiums.forEach((s) => {
        if (s.lat && s.lng) {
          leaflet.marker([s.lat, s.lng]).addTo(map).bindPopup(`<b>${s.name}</b><br>${s.city}`);
        }
      });

      return () => {
        if (map) map.remove();
      };
    }).catch((err) => console.error("Error loading Leaflet:", err));
  }, [view, user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0d12] text-[#e6eef6] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const stadiums = user.stadiums;

  const sports = [...new Set(stadiums.map((s) => s.sport))];

  const handleAddStadium = async () => {
    console.log("Add Stadium clicked", newStadium);
    if (!newStadium.name.trim() || !newStadium.city.trim() || !newStadium.sport.trim()) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setError("");
      setIsSubmitting(true);
      await addStadium({ ...newStadium, visited: true });
      setNewStadium({ name: "", city: "", sport: "" });
      setShowModal(false);
      setSearchQuery("");
      setShowArenaDropdown(false);
    } catch (err: any) {
      console.error("Error adding stadium:", err);
      setError(err.message || "Failed to add stadium");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = arenas.filter((arena) =>
        arena.team.toLowerCase().includes(query.toLowerCase()) ||
        arena.league.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredArenas(filtered);
      setShowArenaDropdown(true);
    } else {
      setShowArenaDropdown(false);
      setFilteredArenas([]);
    }
  };

  const handleSelectArena = (arena: Arena) => {
    setNewStadium({
      name: arena.team,
      city: arena.city,
      sport: arena.league,
      lat: arena.lat,
      lng: arena.lng,
    });
    setSearchQuery("");
    setShowArenaDropdown(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Logout failed");
    }
  };

  const handleDeleteStadium = async (id: string | undefined) => {
    if (!id) return;
    try {
      await deleteStadium(id);
    } catch (err: any) {
      setError(err.message || "Failed to delete stadium");
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
        <button 
          onClick={() => setView("list")} 
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95 ${view === "list" ? "bg-transparent border-2 border-blue-500 text-blue-300" : "bg-transparent border border-neutral-700 text-neutral-300 hover:bg-neutral-900 hover:text-neutral-100 hover:border-neutral-600"}`}
        >
          List View
        </button>
        <button 
          onClick={() => setView("map")} 
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95 ${view === "map" ? "bg-transparent border-2 border-blue-500 text-blue-300" : "bg-transparent border border-neutral-700 text-neutral-300 hover:bg-neutral-900 hover:text-neutral-100 hover:border-neutral-600"}`}
        >
          Map View
        </button>
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
                        <CardContent className="p-4 flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1 flex-1">
                              <h2 className="text-xl font-semibold">{s.name}</h2>
                              <p className="text-gray-300">{s.city}</p>
                              <span className="text-sm text-green-400 font-medium">Visited ✓</span>
                            </div>
                            <button
                              onClick={() => handleDeleteStadium(s.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded transition-colors"
                              title="Delete stadium"
                            >
                              ✕
                            </button>
                          </div>
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
        <div key="map-view" className="w-full max-w-4xl h-96 bg-neutral-900 rounded-2xl shadow">
          <div id="map" className="w-full h-full rounded-2xl" />
        </div>
      )}

      {/* Add Stadium Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-neutral-900 p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-6">Add a Stadium</h3>
            
            {error && (
              <div className="mb-4 p-3 rounded bg-red-900/20 border border-red-700/40 text-red-300 text-sm">
                {error}
              </div>
            )}
            
            <div className="flex flex-col gap-4 mb-6">
              {/* Search Arena Dropdown */}
              <div className="relative">
                <Input
                  placeholder="Search teams or arenas..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
                  onFocus={() => searchQuery && setShowArenaDropdown(true)}
                />
                {showArenaDropdown && filteredArenas.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-800 rounded-lg shadow-lg max-h-64 overflow-y-auto z-10 border border-neutral-700">
                    {filteredArenas.slice(0, 15).map((arena, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectArena(arena)}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-700 transition-colors text-neutral-300 hover:text-white border-b border-neutral-700 last:border-b-0"
                      >
                        <div className="font-medium">{arena.team}</div>
                        <div className="text-xs text-neutral-500">{arena.league} - {arena.division}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

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
              <Button 
                onClick={handleAddStadium} 
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Adding..." : "Add Stadium"}
              </Button>
              <Button onClick={() => {
                setShowModal(false);
                setNewStadium({ name: "", city: "", sport: "" });
                setError("");
                setSearchQuery("");
                setShowArenaDropdown(false);
              }} variant="outline" className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
