"use client";

import { useState, useEffect } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { authService } from "@/lib/services/auth";
import { User } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const data = await authService.getUserData(firebaseUser.uid);
        setUserData(data);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const userData = await authService.signIn(email, password);
    return userData;
  };

  const signOut = async () => {
    await authService.signOut();
  };

  const isAdmin = userData?.role === "admin";

  return {
    user,
    userData,
    loading,
    signIn,
    signOut,
    isAdmin,
  };
}
