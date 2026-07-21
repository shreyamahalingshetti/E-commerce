'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacyAdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/admin');
  }, [router]);

  return (
    <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
      Redirecting to Admin Dashboard...
    </div>
  );
}
