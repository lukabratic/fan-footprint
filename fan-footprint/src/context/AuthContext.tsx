"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type Stadium = {
  id?: string;
  name: string;
  city: string;
  sport: string;
  lat?: number;
  lng?: number;
  visited?: boolean;
  created_at?: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  stadiums: Stadium[];
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  addStadium: (stadium: Omit<Stadium, "id" | "created_at">) => Promise<void>;
  updateStadium: (id: string, updates: Partial<Stadium>) => Promise<void>;
  deleteStadium: (id: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserWithStadiums(session.user.id, session.user.email || "");
        }
      } catch (error) {
        console.error("Error checking user session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserWithStadiums(session.user.id, session.user.email || "");
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const loadUserWithStadiums = async (userId: string, email: string) => {
    try {
      // Get user profile
      const { data: userProfile, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      // Get user's stadiums
      const { data: stadiums, error: stadiumsError } = await supabase
        .from("stadiums")
        .select("*")
        .eq("user_id", userId);

      if (stadiumsError) throw stadiumsError;

      setUser({
        id: userId,
        username: userProfile?.username || email,
        email: email,
        stadiums: stadiums || [],
      });
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) throw new Error("No user returned from signup");

      // Create user profile
      const { error: profileError } = await supabase
        .from("users")
        .insert([
          {
            id: authData.user.id,
            username,
            email,
          },
        ]);

      if (profileError) throw profileError;

      await loadUserWithStadiums(authData.user.id, email);
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user) throw new Error("No user returned from login");

      await loadUserWithStadiums(data.user.id, email);
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error: any) {
      throw new Error(error.message || "Logout failed");
    }
  };

  const addStadium = async (stadium: Omit<Stadium, "id" | "created_at">) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const { data, error } = await supabase
        .from("stadiums")
        .insert([
          {
            ...stadium,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setUser({
        ...user,
        stadiums: [...user.stadiums, data],
      });
    } catch (error: any) {
      throw new Error(error.message || "Failed to add stadium");
    }
  };

  const updateStadium = async (id: string, updates: Partial<Stadium>) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const { error } = await supabase
        .from("stadiums")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setUser({
        ...user,
        stadiums: user.stadiums.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        ),
      });
    } catch (error: any) {
      throw new Error(error.message || "Failed to update stadium");
    }
  };

  const deleteStadium = async (id: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const { error } = await supabase
        .from("stadiums")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setUser({
        ...user,
        stadiums: user.stadiums.filter((s) => s.id !== id),
      });
    } catch (error: any) {
      throw new Error(error.message || "Failed to delete stadium");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        addStadium,
        updateStadium,
        deleteStadium,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

