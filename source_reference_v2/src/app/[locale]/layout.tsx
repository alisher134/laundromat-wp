import { Poppins } from 'next/font/google';
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Header } from '@/widgets/Header';
import { Footer } from '@/widgets/Footer';
import { Locale } from '@/shared/config/i18n';
import { LOCALES, SITE_CONFIG } from '@/shared/config/seo.config';
import type { Metadata } from 'next';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    template: `%s | ${SITE_CONFIG.name}`,
    default: `${SITE_CONFIG.name} - The easiest way to do your laundry`,
  },
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  authors: [{ name: SITE_CONFIG.author }],
  creator: SITE_CONFIG.creator,
  publisher: SITE_CONFIG.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'el_GR',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} - The easiest way to do your laundry`,
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.images.og,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} - The easiest way to do your laundry`,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.images.og],
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
  alternates: {
    canonical: SITE_CONFIG.url,
    languages: Object.fromEntries(LOCALES.map((locale) => [locale, `${SITE_CONFIG.url}/${locale}`])),
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as Locale;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className={poppins.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
