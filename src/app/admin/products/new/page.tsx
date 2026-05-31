"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import slugify from "slugify";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { productService } from "@/lib/services/products";
import { categoryService } from "@/lib/services/categories";
import { Category, StockStatus } from "@/types";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be positive"),
  salePrice: z.number().optional(),
  sizes: z.string(),
  colors: z.string(),
  tags: z.string(),
  fabric: z.string().optional(),
  careInstructions: z.string().optional(),
  stockQuantity: z.number().min(0, "Stock quantity must be positive"),
  stockStatus: z.enum(["in_stock", "low_stock", "sold_out"]),
  featured: z.boolean(),
  newArrival: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      featured: false,
      newArrival: false,
      stockStatus: "in_stock",
      stockQuantity: 0,
      price: 0,
    },
  });

  const title = watch("title");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const slug = slugify(title, { lower: true, strict: true });
      setValue("slug" as any, slug);
    }
  }, [title, setValue]);

  const addImageUrl = () => {
    if (currentImageUrl.trim()) {
      setImageUrls([...imageUrls, currentImageUrl.trim()]);
      setCurrentImageUrl("");
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    if (imageUrls.length === 0) {
      toast.error("Please add at least one product image");
      return;
    }

    setLoading(true);

    try {
      const productData = {
        title: data.title,
        slug: slugify(data.title, { lower: true, strict: true }),
        description: data.description,
        category: data.category,
        price: data.price,
        salePrice: data.salePrice,
        sizes: data.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: data.colors.split(",").map((c) => c.trim()).filter(Boolean),
        tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean),
        fabric: data.fabric || "",
        careInstructions: data.careInstructions || "",
        stockQuantity: data.stockQuantity,
        stockStatus: data.stockStatus as StockStatus,
        featured: data.featured,
        newArrival: data.newArrival,
        images: imageUrls,
      };

      await productService.createProduct(productData);

      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex min-h-screen bg-ivory">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="mb-2 font-serif text-4xl font-bold text-brown">
              Add New Product
            </h1>
            <p className="text-taupe">Create a new product in your catalog</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Product Title *</Label>
                      <Input
                        id="title"
                        {...register("title")}
                        placeholder="Floral Coord Set"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        {...register("description")}
                        placeholder="Elegant floral coord set perfect for summer occasions..."
                        rows={4}
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price (₹) *</Label>
                        <Input
                          id="price"
                          type="number"
                          {...register("price", { valueAsNumber: true })}
                          placeholder="1499"
                        />
                        {errors.price && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.price.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="salePrice">Sale Price (₹)</Label>
                        <Input
                          id="salePrice"
                          type="number"
                          {...register("salePrice", { valueAsNumber: true })}
                          placeholder="1299"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="sizes">
                        Sizes (comma-separated)
                      </Label>
                      <Input
                        id="sizes"
                        {...register("sizes")}
                        placeholder="S, M, L, XL"
                      />
                    </div>

                    <div>
                      <Label htmlFor="colors">
                        Colors (comma-separated)
                      </Label>
                      <Input
                        id="colors"
                        {...register("colors")}
                        placeholder="Red, Blue, Green"
                      />
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        {...register("tags")}
                        placeholder="ethnic, summer, casual"
                      />
                    </div>

                    <div>
                      <Label htmlFor="fabric">Fabric</Label>
                      <Input
                        id="fabric"
                        {...register("fabric")}
                        placeholder="100% Cotton"
                      />
                    </div>

                    <div>
                      <Label htmlFor="careInstructions">
                        Care Instructions
                      </Label>
                      <Textarea
                        id="careInstructions"
                        {...register("careInstructions")}
                        placeholder="Hand wash cold, dry in shade"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Product Images (URLs)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={currentImageUrl}
                        onChange={(e) => setCurrentImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addImageUrl();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addImageUrl}
                        disabled={!currentImageUrl.trim()}
                        variant="luxury"
                        size="icon"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-taupe">
                      Upload images to Imgur, ImgBB, or any image hosting service and paste the URL here
                    </p>

                    {imageUrls.length > 0 && (
                      <div className="grid grid-cols-4 gap-4">
                        {imageUrls.map((url, index) => (
                          <div
                            key={index}
                            className="relative aspect-square overflow-hidden rounded-lg bg-beige"
                          >
                            <Image
                              src={url}
                              alt={`Product ${index + 1}`}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.png";
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeImageUrl(index)}
                              className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white shadow-lg transition-all hover:bg-red-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                              aria-label="Remove image"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Organization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        onValueChange={(value) => setValue("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.slug}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.category.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Inventory</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                      <Input
                        id="stockQuantity"
                        type="number"
                        {...register("stockQuantity", { valueAsNumber: true })}
                        placeholder="10"
                      />
                      {errors.stockQuantity && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.stockQuantity.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="stockStatus">Stock Status *</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue("stockStatus", value as StockStatus)
                        }
                        defaultValue="in_stock"
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in_stock">In Stock</SelectItem>
                          <SelectItem value="low_stock">Low Stock</SelectItem>
                          <SelectItem value="sold_out">Sold Out</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Visibility</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="featured">Featured Product</Label>
                      <input
                        id="featured"
                        type="checkbox"
                        {...register("featured")}
                        className="h-4 w-4 rounded border-taupe text-gold focus:ring-gold"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="newArrival">New Arrival</Label>
                      <input
                        id="newArrival"
                        type="checkbox"
                        {...register("newArrival")}
                        className="h-4 w-4 rounded border-taupe text-gold focus:ring-gold"
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full"
                    variant="luxury"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Product"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </AdminLayout>
  );
}
