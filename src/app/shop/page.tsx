"use client";

"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShopContent } from "@/components/shop/ShopContent";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 font-serif text-4xl font-bold text-brown">
            Shop Collection
          </h1>
          <p className="text-taupe">
            Discover our curated selection of luxury ethnic wear
          </p>
        </div>
        <ShopContent />
      </main>
      <Footer />
    </div>
  );
}
