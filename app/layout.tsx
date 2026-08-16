import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// வியூப்போர்ட் அமைப்பு
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
};

// ஃபேவிகான், ஆப்பிள் டச் ஐகான் மற்றும் மேனிஃபெஸ்ட் இணைப்புகள்
export const metadata: Metadata = {
  title: 'Construction POS',
  description: 'Point of Sale system for construction business',
  manifest: '/manifest.json', // Manifest கோப்பு இணைப்பு
  icons: {
    icon: '/favicon.ico',                  // சாதாரண Favicon
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',        // Apple Touch Icon (180x180)
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body 
        className={`${inter.className} h-full antialiased overflow-x-hidden`} 
        suppressHydrationWarning={true}
      >
        <div className="min-h-screen bg-slate-100 flex flex-col w-full">
          <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}