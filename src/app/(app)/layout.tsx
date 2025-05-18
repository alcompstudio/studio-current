
import AppLayout from '@/components/layout/app-layout';

// This layout wraps all pages inside the (app) group
export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication check is now handled within AppLayout using localStorage
  // No need for an additional check here.

  // The AppLayout component itself handles fetching user data and rendering the main structure.
  return <AppLayout>{children}</AppLayout>;
}
