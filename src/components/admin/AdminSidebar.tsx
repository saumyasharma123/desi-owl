"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  LogOut,
  ShoppingBag,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const navItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/products",
      label: "Products",
      icon: Package,
    },
    {
      href: "/admin/categories",
      label: "Categories",
      icon: FolderTree,
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-beige bg-ivory">
      <div className="border-b border-beige p-6">
        <Link href="/" className="flex items-center space-x-2">
          <ShoppingBag className="h-6 w-6 text-gold" />
          <span className="font-serif text-xl font-bold text-brown">
            Desi Owl
          </span>
        </Link>
        <p className="mt-1 text-xs text-taupe">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-beige p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
