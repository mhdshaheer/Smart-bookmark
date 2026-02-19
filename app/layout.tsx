import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'SmartBookmark — Your Personal Link Library',
    template: '%s | SmartBookmark'
  },
  description: 'The smarter, technical way to organize and sync your web bookmarks in real-time.',
  keywords: ['bookmarks', 'link manager', 'developer tools', 'productivity', 'sync'],
  authors: [{ name: 'SmartBookmark Team' }],
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'SmartBookmark',
    title: 'SmartBookmark — Your Personal Link Library',
    description: 'The smarter way to organize your web.',
    images: [],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartBookmark',
    description: 'The smarter way to organize your web.',
  },
  robots: {
    index: true,
    follow: true,
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#030303' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} scroll-smooth antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('theme');
                  const theme = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans bg-background text-foreground selection:bg-accent/30 selection:text-white transition-colors duration-300">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
