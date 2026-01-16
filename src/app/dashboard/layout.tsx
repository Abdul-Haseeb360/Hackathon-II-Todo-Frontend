'use client';

import { ReactNode } from 'react';
import ProtectedRoute from '@/components/protected-route';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Toaster } from 'sonner';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto py-6 px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
        <Toaster richColors />
      </div>
    </ProtectedRoute>
  );
}