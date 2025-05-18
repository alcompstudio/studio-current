import { useRouter as useNextRouter } from 'next-router-mock';

// Mock the useRouter hook for the App Router
export const useRouter = useNextRouter;

// Mock the usePathname hook
export const usePathname = () => {
  const router = useNextRouter();
  return router.pathname; // Use the pathname from next-router-mock
};

// Mock the useSearchParams hook
export const useSearchParams = () => {
  const router = useNextRouter();
  // Convert the query object from next-router-mock into a URLSearchParams object
  const searchParams = new URLSearchParams();
  for (const key in router.query) {
    if (Array.isArray(router.query[key])) {
      router.query[key].forEach(value => searchParams.append(key, value));
    } else {
      searchParams.append(key, router.query[key]);
    }
  }
  return searchParams;
};

// Mock the useParams hook
export const useParams = () => {
  const router = useNextRouter();
  // The params typically come from the dynamic segments in the route, which are part of the query in next-router-mock
  return router.query; // For simplicity, use the query object as params
};

// Add other necessary mocks if components use other exports from next/navigation
// For example, if using redirect, notFound, etc., you might need to mock them.
// export const redirect = () => {};
// export const notFound = () => {};
