import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LangProvider } from '@/contexts/lang-context'
import { FavoritesProvider } from '@/contexts/favorites-context'
import { BottomNav } from '@/components/layout/bottom-nav'

const inter = Inter({ subsets: ['latin', 'cyrillic'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Feron Craft — металлоизделия на заказ, Семей',
  description: 'Ворота, навесы, перила, мангалы и любые изделия из металла на заказ в Семее.',
  keywords: 'ворота, навесы, перила, мангалы, металлоизделия, Семей, заказ',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <LangProvider>
          <FavoritesProvider>
            <main className="min-h-screen pb-[64px]">
              {children}
            </main>
            <BottomNav />
          </FavoritesProvider>
        </LangProvider>
      </body>
    </html>
  )
}
