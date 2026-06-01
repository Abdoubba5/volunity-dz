import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';
import { AdminShell } from './_components/admin-shell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${defaultLocale}/login`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect(`/${defaultLocale}/dashboard`);
  }

  return <AdminShell>{children}</AdminShell>;
}
