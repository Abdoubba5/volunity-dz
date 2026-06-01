import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Cairo, Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AnalyticsProvider } from '@/components/analytics-provider';
import { ToastProvider } from '@/components/ui/use-toast';
import { AuthProvider } from '@/lib/auth-context';
import { locales, isRTL, type Locale, defaultLocale } from '@/i18n/config';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://volunity-dz.vercel.app';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
  preload: true,
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Volunity DZ - University Student Platform',
    template: '%s | Volunity DZ',
  },
  description:
    'Volunity DZ connects Algerian university students with campus events, student clubs, academic resources, and a vibrant student community.',
  keywords: [
    'university',
    'algeria',
    'students',
    'campus',
    'events',
    'student clubs',
    'academic',
    'algerian students',
    'université',
    'étudiants',
    'algérie',
    'جامعة',
    'طلاب',
    'الجزائر',
  ],
  authors: [{ name: 'Volunity DZ', url: SITE_URL }],
  creator: 'Volunity DZ',
  publisher: 'Volunity DZ',
  applicationName: 'Volunity DZ',
  category: 'education',

  openGraph: {
    type: 'website',
    siteName: 'Volunity DZ',
    title: 'Volunity DZ - University Student Platform',
    description:
      'AI-powered university platform connecting Algerian students with campus events, clubs, and resources.',
    url: SITE_URL,
    locale: 'ar_DZ',
    alternateLocale: ['en_US', 'fr_FR'],
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Volunity DZ',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Volunity DZ',
    description:
      'AI-powered university platform connecting Algerian students with campus events, clubs, and resources.',
    creator: '@volunitydz',
    site: '@volunitydz',
    images: ['/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192' },
    ],
  },

  manifest: '/manifest.json',

  appleWebApp: {
    capable: true,
    title: 'Volunity DZ',
    statusBarStyle: 'black-translucent',
  },

  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },

  other: {
    'msapplication-TileColor': '#07111F',
    'theme-color': '#07111F',
  },
};

function detectLocale(): Locale {
  try {
    const headersList = headers();
    const headerLocale = headersList.get('x-volunity-locale');
    if (headerLocale && locales.includes(headerLocale as Locale)) {
      return headerLocale as Locale;
    }
  } catch {
    // headers() can throw in some edge cases
  }
  return defaultLocale;
}

function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AnalyticsProvider>
        {children}
      </AnalyticsProvider>
    </AuthProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = detectLocale();
  const dir = isRTL(locale) ? 'rtl' : 'ltr';

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${cairo.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://oqjplcdnsmamllogtbgv.supabase.co" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <ClientProviders>{children}</ClientProviders>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
