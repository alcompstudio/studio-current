
"use client"; // Needs client-side logic for redirection and localStorage access

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/lib/types'; // Use type import

interface AuthUser {
  email: string;
  role: UserRole;
}

export default function RootPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check auth status from localStorage
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
          const user: AuthUser = JSON.parse(storedUser);
          // Basic validation - could be more robust
          if (user && user.email && user.role) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('authUser'); // Clean up invalid data
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error reading auth status from localStorage:", error);
        localStorage.removeItem('authUser'); // Clean up potentially corrupted data
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Optional: Listen for storage changes if login/logout might happen in other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'authUser') {
        checkAuth(); // Re-check auth status when localStorage changes
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };

  }, []); // Run only once on mount

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/auth');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show a loading state while checking auth
  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  // Render nothing while redirecting
  return null;
}
