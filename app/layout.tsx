import type { Metadata } from 'next'
import { Epilogue, Be_Vietnam_Pro, Inter } from 'next/font/google'
import QueryProvider from '@/components/providers/QueryProvider'
import SettingsProvider from '@/components/providers/SettingsProvider'
import Loader from '@/components/Loader'
import './globals.css'

const epilogue = Epilogue({
  variable: '--font-epilogue',
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
})

const beVietnamPro = Be_Vietnam_Pro({
  variable: '--font-be-vietnam-pro',
  subsets: ['latin'],
  weight: ['400', '700'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'ZAIQA EXPRESS | Authentic Pakistani Flavors',
  description: 'Experience the explosive flavors of authentic Pakistani street food fusion. Fast delivery, halal certified, and delicious.',
  keywords: 'Pakistani food, fast food, restaurant, delivery, Lahore, Karachi',
  openGraph: {
    title: 'ZAIQA EXPRESS | Authentic Pakistani Flavors',
    description: 'Authentic Pakistani street food delivered to your door',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />

      </head>
      <body className={`${epilogue.variable} ${beVietnamPro.variable} ${inter.variable} bg-background text-on-surface font-body-md overflow-x-hidden`}>
        <Loader />
        <QueryProvider>
          <SettingsProvider>
            {children}
          </SettingsProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
