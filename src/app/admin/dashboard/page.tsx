"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { productService } from "@/lib/services/products";
import { Package, TrendingUp, AlertCircle, Sparkles } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    soldOut: 0,
    featured: 0,
    newArrivals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const products = await productService.getProducts({});

        const stats = {
          totalProducts: products.length,
          inStock: products.filter((p) => p.stockStatus === "in_stock").length,
          lowStock: products.filter((p) => p.stockStatus === "low_stock").length,
          soldOut: products.filter((p) => p.stockStatus === "sold_out").length,
          featured: products.filter((p) => p.featured).length,
          newArrivals: products.filter((p) => p.newArrival).length,
        };

        setStats(stats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="flex min-h-screen bg-ivory">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="mb-2 font-serif text-4xl font-bold text-brown">
              Dashboard
            </h1>
            <p className="text-taupe">Welcome back! Here's your store overview</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Package className="h-4 w-4 text-taupe" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-taupe">All products in catalog</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inStock}</div>
                <p className="text-xs text-taupe">Available for sale</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.lowStock}</div>
                <p className="text-xs text-taupe">Needs restocking</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sold Out</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.soldOut}</div>
                <p className="text-xs text-taupe">Out of stock</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Featured</CardTitle>
                <Sparkles className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.featured}</div>
                <p className="text-xs text-taupe">Featured products</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  New Arrivals
                </CardTitle>
                <Sparkles className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.newArrivals}</div>
                <p className="text-xs text-taupe">Latest additions</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
}
