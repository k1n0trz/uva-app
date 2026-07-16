import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { AdminShell } from '@/components/AdminShell';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'UVA App · Panel administrativo',
  description: 'Administración de UVA App',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
