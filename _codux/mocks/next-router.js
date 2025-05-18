import { useRouter as useNextRouter } from 'next-router-mock';

// Mock the useRouter hook for the pages directory router
export const useRouter = () => {
  const router = useNextRouter();
  // Add any necessary mock properties or methods if needed
  return router;
};

// Re-export other potential exports from next/router if needed, though App Router primarily uses next/navigation
// export * from 'next/router';
