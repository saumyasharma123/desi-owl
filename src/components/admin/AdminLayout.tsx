"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Loader2 } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || userData?.role !== "admin")) {
      router.push("/admin/login");
    }
  }, [user, userData, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!user || userData?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
