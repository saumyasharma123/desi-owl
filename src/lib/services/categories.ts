import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Category } from "@/types";

const CATEGORIES_COLLECTION = "categories";

export const categoryService = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    try {
      const categoriesRef = collection(db, CATEGORIES_COLLECTION);
      const q = query(categoriesRef, orderBy("name", "asc"));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get single category
  async getCategory(id: string): Promise<Category | null> {
    try {
      const docRef = doc(db, CATEGORIES_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Category;
      }
      return null;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  },

  // Create category (admin only)
  async createCategory(
    categoryData: Omit<Category, "id">
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), categoryData);
      return docRef.id;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  // Update category (admin only)
  async updateCategory(
    id: string,
    categoryData: Partial<Omit<Category, "id">>
  ): Promise<void> {
    try {
      const docRef = doc(db, CATEGORIES_COLLECTION, id);
      await updateDoc(docRef, categoryData);
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  // Delete category (admin only)
  async deleteCategory(id: string): Promise<void> {
    try {
      const docRef = doc(db, CATEGORIES_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },
};
