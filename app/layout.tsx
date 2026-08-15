import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Construction POS',
  description: 'Point of Sale system for construction business',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-slate-100 flex flex-col">
          {/* Main Content Area */}
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}