'use client';

import { Sidebar } from '@/components/sidebar';
import { useAuth } from '@/lib/auth-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        userRole={profile?.role || 'student'}
        userName={profile?.full_name || user?.email || 'User'}
        userEmail={user?.email || ''}
        userAvatar={profile?.avatar_url || undefined}
      />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
