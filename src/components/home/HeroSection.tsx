"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative h-[70vh] min-h-[500px] bg-gradient-to-br from-ivory via-beige to-taupe">
      <div className="container mx-auto flex h-full items-center px-4">
        <div className="max-w-2xl space-y-6">
          <h1 className="font-serif text-5xl font-bold leading-tight text-brown md:text-6xl lg:text-7xl">
            Elegance Meets
            <br />
            <span className="text-gold">Tradition</span>
          </h1>
          <p className="text-lg text-brown/80 md:text-xl">
            Discover our curated collection of luxury Indian ethnic wear.
            Handpicked designs that celebrate heritage with contemporary grace.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/shop">
              <Button size="lg" variant="luxury" className="group">
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/shop?filter=new">
              <Button size="lg" variant="outline">
                New Arrivals
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
