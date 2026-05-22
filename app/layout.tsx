import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fogtrail — Your World, Unfogged',
  description:
    'A fog-of-war travel tracker. Log places you\'ve visited and watch the world reveal itself.',
  keywords: ['travel', 'map', 'fog of war', 'tracker', 'explore'],
  openGraph: {
    title: 'Fogtrail — Your World, Unfogged',
    description:
      'Log places you\'ve visited and watch the world reveal itself.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
