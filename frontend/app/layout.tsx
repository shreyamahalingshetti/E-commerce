'use client';

import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ minHeight: '80vh', padding: '20px' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
