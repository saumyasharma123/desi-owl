"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Category } from "@/types";
import { categoryService } from "@/lib/services/categories";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="bg-beige/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-2 font-serif text-4xl font-bold text-brown">
              Shop by Category
            </h2>
            <p className="text-taupe">Explore our curated collections</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-lg bg-beige"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-beige/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 font-serif text-4xl font-bold text-brown">
            Shop by Category
          </h2>
          <p className="text-taupe">Explore our curated collections</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
            >
              <Card className="group overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden bg-taupe">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-beige">
                      {category.name}
                    </div>
                  )}
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-serif text-lg font-semibold text-brown">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
