import AppLayout from '@/components/layout/app-layout';

// This layout wraps all pages inside the (app) group
export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add authentication check here. Redirect if not authenticated.
  // For now, assume user is authenticated.

  return <AppLayout>{children}</AppLayout>;
}
