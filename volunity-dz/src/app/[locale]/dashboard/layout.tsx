import { Sidebar } from '@/components/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar
        userRole="user"
        userName="Sarah Khaled"
        userEmail="sarah.k@example.com"
      />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
