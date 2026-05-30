import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User } from "@/types";

const USERS_COLLECTION = "users";

export const authService = {
  // Sign in
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = await this.getUserData(userCredential.user.uid);

      if (!user) {
        throw new Error("User data not found");
      }

      return user;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },

  // Get user data from Firestore
  async getUserData(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));

      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid,
          email: data.email,
          role: data.role,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  },

  // Create user document (for initial admin setup)
  async createUserDocument(
    uid: string,
    email: string,
    role: "admin" | "user" = "user"
  ): Promise<void> {
    try {
      await setDoc(doc(db, USERS_COLLECTION, uid), {
        email,
        role,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error creating user document:", error);
      throw error;
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  // Check if user is admin
  async isAdmin(uid: string): Promise<boolean> {
    try {
      const user = await this.getUserData(uid);
      return user?.role === "admin";
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  },
};
