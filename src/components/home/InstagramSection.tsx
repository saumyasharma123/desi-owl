"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InstagramSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 font-serif text-4xl font-bold text-brown">
            Follow Our Journey
          </h2>
          <p className="text-taupe">
            Join our community on Instagram for style inspiration
          </p>
        </div>

        <div className="flex justify-center">
          <a
            href="https://www.instagram.com/shopatdesiowl?igsh=MXQyM2ppOWszczl4cg%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="luxury" size="lg" className="group">
              <Share2 className="mr-2 h-5 w-5" />
              Follow @shopatdesiowl
            </Button>
          </a>
        </div>

        {/* Instagram Grid Placeholder */}
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-gradient-to-br from-beige to-taupe"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
