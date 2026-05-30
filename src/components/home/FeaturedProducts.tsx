"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { productService } from "@/lib/services/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  type?: "featured" | "new";
}

export function FeaturedProducts({
  title = "Featured Collection",
  subtitle = "Handpicked pieces for the discerning you",
  limit = 8,
  type = "featured",
}: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data =
          type === "featured"
            ? await productService.getFeaturedProducts(limit)
            : await productService.getNewArrivals(limit);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [limit, type]);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-2 font-serif text-4xl font-bold text-brown">
              {title}
            </h2>
            <p className="text-taupe">{subtitle}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-lg bg-beige"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 font-serif text-4xl font-bold text-brown">
            {title}
          </h2>
          <p className="text-taupe">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/shop">
            <Button variant="outline" size="lg" className="group">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
