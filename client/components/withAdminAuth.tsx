'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getUser } from '@/lib/auth';

export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AdminProtectedComponent(props: P) {
    const router = useRouter();

    useEffect(() => {
      const token = getAuthToken();
      const user = getUser();

      if (!token || !user) {
        router.push('/login');
        return;
      }

      if (user.role !== 'ADMIN') {
        router.push('/');
        return;
      }
    }, [router]);

    return <Component {...props} />;
  };
}

export default withAdminAuth;
