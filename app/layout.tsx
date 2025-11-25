import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'To-Do List',
  description: 'A clean, fast to-do list built with Next.js',
  applicationName: 'To-Do List',
  viewport: { width: 'device-width', initialScale: 1, maximumScale: 1 },
  icons: { icon: '/favicon.ico' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

