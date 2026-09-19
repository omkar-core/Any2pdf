import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Any2PDF - Convert Files to PDF',
  description: 'Easily convert your documents and images to PDF format. Fast, secure, and free to start.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ptSans.variable} font-body antialiased`}>
        <div className="relative flex min-h-screen flex-col bg-background">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}