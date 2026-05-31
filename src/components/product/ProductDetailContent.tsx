"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { productService } from "@/lib/services/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/product/ProductCard";
import { MessageCircle, Loader2, Package, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ProductDetailContentProps {
  slug: string;
}

export function ProductDetailContent({ slug }: ProductDetailContentProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductBySlug(slug);
        if (data) {
          setProduct(data);
          // Fetch related products
          try {
            const related = await productService.getRelatedProducts(
              data.id,
              data.category,
              4
            );
            setRelatedProducts(related);
          } catch (relatedError) {
            console.error("Error fetching related products:", relatedError);
            // Don't show error for related products, just log it
          }
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        // Only show error toast if product actually failed to load
        if (!product) {
          toast.error("Failed to load product");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleWhatsAppOrder = () => {
    if (!product) return;

    if (!selectedSize && product.sizes.length > 0) {
      toast.error("Please select a size");
      return;
    }

    const displayPrice = product.salePrice || product.price;
    const message = `Hello Desi Owl,\n\nI would like to order:\n\nProduct: ${product.title}\nSize: ${selectedSize || "N/A"}\nPrice: ₹${displayPrice}\n\nProduct Link: ${window.location.href}`;

    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 font-serif text-2xl font-bold text-brown">
            Product Not Found
          </h2>
          <p className="text-taupe">
            The product you're looking for doesn't exist
          </p>
        </div>
      </div>
    );
  }

  const displayPrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <div className="space-y-12">
      {/* Product Detail */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-beige">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-taupe">
                No Image Available
              </div>
            )}

            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.newArrival && (
                <Badge variant="default" className="bg-gold text-brown">
                  New Arrival
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
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${
                    selectedImage === index
                      ? "border-gold"
                      : "border-transparent hover:border-taupe"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm text-taupe">{product.category}</p>
            <h1 className="mb-4 font-serif text-4xl font-bold text-brown">
              {product.title}
            </h1>

            <div className="flex items-center gap-3">
              <span className="font-serif text-3xl font-bold text-brown">
                ₹{displayPrice}
              </span>
              {hasDiscount && (
                <span className="text-xl text-taupe line-through">
                  ₹{product.price}
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div>
            {product.stockStatus === "in_stock" && (
              <Badge variant="success" className="gap-1">
                <Package className="h-3 w-3" />
                In Stock
              </Badge>
            )}
            {product.stockStatus === "low_stock" && (
              <Badge variant="warning" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Low Stock - Order Soon!
              </Badge>
            )}
            {product.stockStatus === "sold_out" && (
              <Badge variant="secondary">Sold Out</Badge>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="mb-2 font-semibold text-brown">Description</h3>
            <p className="text-taupe">{product.description}</p>
          </div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="mb-3 font-semibold text-brown">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-md border-2 px-4 py-2 text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "border-gold bg-gold text-brown"
                        : "border-taupe bg-ivory text-brown hover:border-gold"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold text-brown">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Badge key={color} variant="secondary">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Fabric & Care */}
          <Card>
            <CardContent className="space-y-4 p-4">
              {product.fabric && (
                <div>
                  <h4 className="mb-1 text-sm font-semibold text-brown">
                    Fabric
                  </h4>
                  <p className="text-sm text-taupe">{product.fabric}</p>
                </div>
              )}
              {product.careInstructions && (
                <div>
                  <h4 className="mb-1 text-sm font-semibold text-brown">
                    Care Instructions
                  </h4>
                  <p className="text-sm text-taupe">{product.careInstructions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* WhatsApp Order Button */}
          <Button
            size="lg"
            variant="luxury"
            className="w-full"
            onClick={handleWhatsAppOrder}
            disabled={product.stockStatus === "sold_out"}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Order on WhatsApp
          </Button>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-brown">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="mb-6 font-serif text-3xl font-bold text-brown">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
