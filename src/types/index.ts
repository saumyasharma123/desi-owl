export type StockStatus = "in_stock" | "low_stock" | "sold_out";

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  salePrice?: number;
  sizes: string[];
  colors: string[];
  tags: string[];
  fabric: string;
  careInstructions: string;
  stockQuantity: number;
  stockStatus: StockStatus;
  featured: boolean;
  newArrival: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface User {
  uid: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
}

export interface ProductFilters {
  category?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: StockStatus;
  sortBy?: "newest" | "price_asc" | "price_desc";
  search?: string;
}
