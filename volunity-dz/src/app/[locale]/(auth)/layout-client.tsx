'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Logo } from '@/components/logo';
import { LanguageSwitcher } from '@/components/language-switcher';
import type { Locale } from '@/i18n/config';

export function AuthLayoutClient({ children }: { children: React.ReactNode }) {
  const locale = useLocale() as Locale;

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background decorative orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb bg-brand-primary w-[600px] h-[600px] -top-40 -start-40 animate-float" />
        <div className="orb bg-brand-accent w-[500px] h-[500px] top-1/2 -end-40" style={{ animationDelay: '2s' }} />
        <div className="orb bg-brand-secondary w-[400px] h-[400px] bottom-0 start-1/3" style={{ animationDelay: '4s' }} />
      </div>

      <div className="grid-pattern absolute inset-0 -z-10 opacity-30" />

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
        <Link href={`/${locale}`}>
          <Logo size="md" />
        </Link>
        <LanguageSwitcher />
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        {children}
      </main>
    </div>
  );
}
