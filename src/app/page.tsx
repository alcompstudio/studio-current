"use client"; // Needs client-side logic for redirection

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useAuth } from '@/hooks/useAuth'; // Assuming an auth hook exists

export default function RootPage() {
  const router = useRouter();
  // const { isAuthenticated, isLoading } = useAuth(); // Replace with your auth logic

  // Mock authentication status - replace with actual logic
  const isAuthenticated = false;
  const isLoading = false;

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard'); // Or your main authenticated route '/(app)' resolves to '/dashboard' or similar
      } else {
        router.replace('/auth');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Optional: Show a loading state while checking auth
  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  // Render nothing while redirecting
  return null;
}
