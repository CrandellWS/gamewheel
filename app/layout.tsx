import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// Determine the base URL based on environment
const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://CrandellWS.github.io/gamewheel'
  : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'GameWheel - Random Selection Spinner with Game Modes',
  description: 'GameWheel: Advanced random selection spinner with First Win and Last Remaining modes, chat integration for Twitch/Discord/YouTube, configurable terminology, and more.',
  keywords: ['gamewheel', 'wheel', 'random', 'picker', 'game modes', 'elimination', 'decision maker', 'spinner', 'twitch integration', 'chat integration', 'free', 'open source'],
  authors: [{ name: 'Bill Crandell' }],
  openGraph: {
    title: 'GameWheel - Random Selection Spinner',
    description: 'Free, open-source random selection spinner with game modes and chat integration',
    type: 'website',
    url: baseUrl,
    siteName: 'GameWheel',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GameWheel - Random Selection Spinner',
    description: 'Free, open-source random selection spinner with game modes and chat integration',
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
        <link rel="manifest" href={`${process.env.NODE_ENV === 'production' ? '/gamewheel' : ''}/manifest.json`} />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GameWheel" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
