"use client";

import { useAuth } from "@/hooks/use-auth";
import AdminLayoutComponent from "@/components/layout/admin-layout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace('/auth/login');
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return (
    <AdminLayoutComponent>
      {children}
    </AdminLayoutComponent>
  );
}
