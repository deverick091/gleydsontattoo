"use client";

import { useAuth } from "@/hooks/use-auth";
import AdminLayoutComponent from "@/components/layout/admin-layout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // In a real app we redirect if not logged in.
    // For now we assume we are just rendering the layout
    // if (!isLoading && !user) router.push('/auth/login');
  }, [user, isLoading, router]);

  return (
    <AdminLayoutComponent>
      {children}
    </AdminLayoutComponent>
  );
}
