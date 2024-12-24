import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import Provider from '@/lib/provider';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Urinvited',
  description: 'Urinvited',
  twitter: {
    card: 'summary_large_image',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: {
    locale: string;
  };
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Provider>
          {children} <Toaster />
        </Provider>
      </body>
    </html>
  );
}
