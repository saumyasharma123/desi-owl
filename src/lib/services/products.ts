import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product, ProductFilters } from "@/types";

const PRODUCTS_COLLECTION = "products";

// Convert Firestore timestamp to Date
const convertTimestamps = (data: any): Omit<Product, 'id'> => {
  return {
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

export const productService = {
  // Get all products with optional filters
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const constraints: QueryConstraint[] = [];

      if (filters?.category) {
        constraints.push(where("category", "==", filters.category));
      }

      if (filters?.availability) {
        constraints.push(where("stockStatus", "==", filters.availability));
      }

      // Sorting
      if (filters?.sortBy === "newest") {
        constraints.push(orderBy("createdAt", "desc"));
      } else if (filters?.sortBy === "price_asc") {
        constraints.push(orderBy("price", "asc"));
      } else if (filters?.sortBy === "price_desc") {
        constraints.push(orderBy("price", "desc"));
      } else {
        constraints.push(orderBy("createdAt", "desc"));
      }

      const q = query(productsRef, ...constraints);
      const snapshot = await getDocs(q);

      let products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...convertTimestamps(doc.data()),
      }));

      // Client-side filtering for complex queries
      if (filters?.size) {
        products = products.filter((p) => p.sizes.includes(filters.size!));
      }

      if (filters?.minPrice !== undefined) {
        products = products.filter((p) => p.price >= filters.minPrice!);
      }

      if (filters?.maxPrice !== undefined) {
        products = products.filter((p) => p.price <= filters.maxPrice!);
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        products = products.filter(
          (p) =>
            p.title.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }

      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get single product by ID
  async getProduct(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...convertTimestamps(docSnap.data()),
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  // Get product by slug
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const q = query(productsRef, where("slug", "==", slug), limit(1));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...convertTimestamps(doc.data()),
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching product by slug:", error);
      throw error;
    }
  },

  // Get featured products
  async getFeaturedProducts(limitCount: number = 8): Promise<Product[]> {
    try {
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const q = query(
        productsRef,
        where("featured", "==", true),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...convertTimestamps(doc.data()),
      }));
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  },

  // Get new arrivals
  async getNewArrivals(limitCount: number = 8): Promise<Product[]> {
    try {
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const q = query(
        productsRef,
        where("newArrival", "==", true),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...convertTimestamps(doc.data()),
      }));
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      throw error;
    }
  },

  // Get related products (same category, excluding current product)
  async getRelatedProducts(
    productId: string,
    category: string,
    limitCount: number = 4
  ): Promise<Product[]> {
    try {
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const q = query(
        productsRef,
        where("category", "==", category),
        orderBy("createdAt", "desc"),
        limit(limitCount + 1)
      );
      const snapshot = await getDocs(q);

      return snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...convertTimestamps(doc.data()),
        }))
        .filter((p) => p.id !== productId)
        .slice(0, limitCount);
    } catch (error) {
      console.error("Error fetching related products:", error);
      throw error;
    }
  },

  // Create product (admin only)
  async createProduct(
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
        ...productData,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Update product (admin only)
  async updateProduct(
    id: string,
    productData: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
  ): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...productData,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // Delete product (admin only)
  async deleteProduct(id: string): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  // Get products count by category
  async getProductCountByCategory(): Promise<Record<string, number>> {
    try {
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const snapshot = await getDocs(productsRef);

      const counts: Record<string, number> = {};
      snapshot.docs.forEach((doc) => {
        const category = doc.data().category;
        counts[category] = (counts[category] || 0) + 1;
      });

      return counts;
    } catch (error) {
      console.error("Error getting product counts:", error);
      throw error;
    }
  },
};
