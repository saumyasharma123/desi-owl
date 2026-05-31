"use client";

import Link from "next/link";
import { Share2, Mail, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-beige bg-ivory">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-brown">
              Desi Owl
            </h3>
            <p className="text-sm text-taupe">
              Luxury Indian ethnic fashion for the modern woman. Curated with
              love, crafted with care.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-brown">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/shop"
                  className="text-taupe transition-colors hover:text-gold"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?filter=new"
                  className="text-taupe transition-colors hover:text-gold"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?filter=featured"
                  className="text-taupe transition-colors hover:text-gold"
                >
                  Featured
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h4 className="font-semibold text-brown">Customer Care</h4>
            <ul className="space-y-2 text-sm text-taupe">
              <li>Shipping & Delivery</li>
              <li>Returns & Exchange</li>
              <li>Size Guide</li>
              <li>Care Instructions</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-brown">Get in Touch</h4>
            <div className="space-y-3">
              <a
                href="https://www.instagram.com/shopatdesiowl?igsh=MXQyM2ppOWszczl4cg%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-taupe transition-colors hover:text-gold"
              >
                <Share2 className="h-4 w-4" />
                <span>@shopatdesiowl</span>
              </a>
              <a
                href="mailto:hello@desiowl.com"
                className="flex items-center space-x-2 text-sm text-taupe transition-colors hover:text-gold"
              >
                <Mail className="h-4 w-4" />
                <span>hello@desiowl.com</span>
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-taupe transition-colors hover:text-gold"
              >
                <Phone className="h-4 w-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-beige pt-8 text-center text-sm text-taupe">
          <p>
            &copy; {currentYear} Desi Owl. All rights reserved. Crafted with
            elegance.
          </p>
        </div>
      </div>
    </footer>
  );
}
