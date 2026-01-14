'use client';

import { ReactNode } from 'react';
import ProtectedRoute from '@/components/protected-route';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Todo Dashboard</h1>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <a href="/dashboard" className="text-blue-600 hover:text-blue-900">
                    Tasks
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => {
                      // Logout functionality would go here
                      localStorage.removeItem('auth_token');
                      window.location.href = '/auth/login';
                    }}
                    className="text-gray-600 hover:text-gray-900 cursor-pointer"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}