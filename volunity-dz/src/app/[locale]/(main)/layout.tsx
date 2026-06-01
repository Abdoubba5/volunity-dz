import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedBackground } from '@/components/animated-background';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <AnimatedBackground showDots />

      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20 pb-20 lg:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
