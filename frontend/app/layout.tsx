import React from 'react';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'RBAC Store - Modern E-Commerce',
  description: 'Role-Based Access Control E-Commerce Platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 74px)' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
