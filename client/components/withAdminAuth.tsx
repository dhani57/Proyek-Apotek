'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getUser } from '@/lib/auth';

export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AdminProtectedComponent(props: P) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

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

      setIsAuthorized(true);
      setIsChecking(false);
    }, [router]);

    // Show loading state while checking authentication
    if (isChecking) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      );
    }

    // Only render component if authorized
    if (!isAuthorized) {
      return null;
    }

    return <Component {...props} />;
  };
}

export default withAdminAuth;
