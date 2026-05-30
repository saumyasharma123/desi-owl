"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const displayPrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <Link href={`/product/${product.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-[3/4] overflow-hidden bg-beige">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-taupe">
              No Image
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-2">
            {product.newArrival && (
              <Badge variant="default" className="bg-gold text-brown">
                New
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive">
                {Math.round(
                  ((product.price - product.salePrice!) / product.price) * 100
                )}
                % OFF
              </Badge>
            )}
            {product.stockStatus === "sold_out" && (
              <Badge variant="secondary">Sold Out</Badge>
            )}
            {product.stockStatus === "low_stock" && (
              <Badge variant="warning">Low Stock</Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="mb-1 font-serif text-lg font-semibold text-brown line-clamp-1">
            {product.title}
          </h3>
          <p className="mb-2 text-sm text-taupe line-clamp-1">
            {product.category}
          </p>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-brown">₹{displayPrice}</span>
            {hasDiscount && (
              <span className="text-sm text-taupe line-through">
                ₹{product.price}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
