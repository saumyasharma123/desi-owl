"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product, ProductFilters } from "@/types";
import { productService } from "@/lib/services/products";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFiltersComponent } from "@/components/shop/ProductFilters";
import { Loader2 } from "lucide-react";

export function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({});

  useEffect(() => {
    // Parse URL params
    const category = searchParams.get("category");
    const filter = searchParams.get("filter");
    const search = searchParams.get("search");

    const newFilters: ProductFilters = {};

    if (category) newFilters.category = category;
    if (search) newFilters.search = search;

    // Handle special filters
    if (filter === "new") {
      // Will be handled by fetching new arrivals
    } else if (filter === "featured") {
      // Will be handled by fetching featured
    }

    setFilters(newFilters);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const filter = searchParams.get("filter");

        let data: Product[];
        if (filter === "new") {
          data = await productService.getNewArrivals(50);
        } else if (filter === "featured") {
          data = await productService.getFeaturedProducts(50);
        } else {
          data = await productService.getProducts(filters);
        }

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, searchParams]);

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
      {/* Filters Sidebar */}
      <aside className="lg:col-span-1">
        <ProductFiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </aside>

      {/* Products Grid */}
      <div className="lg:col-span-3">
        {products.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-taupe">No products found</p>
              <p className="text-sm text-taupe">Try adjusting your filters</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-taupe">
              {products.length} {products.length === 1 ? "product" : "products"}{" "}
              found
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
