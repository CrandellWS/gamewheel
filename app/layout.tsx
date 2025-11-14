import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wheel of Names - Random Name Picker',
  description: 'An improved, open-source alternative to Wheel of Names. Free random name picker with weighted probability, dark mode, and more features.',
  keywords: ['wheel', 'random', 'picker', 'name picker', 'decision maker', 'spinner', 'free', 'open source'],
  authors: [{ name: 'AI Dev Workforce' }],
  openGraph: {
    title: 'Wheel of Names - Random Name Picker',
    description: 'Free, open-source random name picker with advanced features',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Wheel of Names" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
