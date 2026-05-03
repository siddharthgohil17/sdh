import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://smartdealshub.com'),
  title: {
    default: 'SmartDealsHub — Best Amazon Product Reviews & Deals',
    template: '%s | SmartDealsHub',
  },
  description:
    'SmartDealsHub helps you discover the best Amazon products with honest reviews, curated deals, and expert recommendations across all categories.',
  keywords: ['amazon deals', 'best products', 'product reviews', 'amazon affiliate', 'smart deals'],
  authors: [{ name: 'SmartDealsHub' }],
  creator: 'SmartDealsHub',
  openGraph: {
    type: 'website',
    siteName: 'SmartDealsHub',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@smartdealshub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme:dark)').matches;if(s==='dark'||(s===null&&d))document.documentElement.classList.add('dark');})();`
        }} />
      </head>
      <body className="font-body bg-brand-cream dark:bg-brand-dark text-brand-dark dark:text-gray-100 antialiased transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
