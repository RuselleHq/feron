import type { Metadata, Viewport } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { LangProvider } from '@/contexts/lang-context'
import { FavoritesProvider } from '@/contexts/favorites-context'
import { BottomNav } from '@/components/layout/bottom-nav'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-sans',
})

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-display',
})

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
  themeColor: '#0b0b0c',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${display.variable}`}>
      <body>
        <LangProvider>
          <FavoritesProvider>
            <div className="app-shell">
              <main style={{ paddingBottom: 'calc(var(--nav-height) + env(safe-area-inset-bottom, 0px) + 16px)' }}>
                {children}
              </main>
              <BottomNav />
            </div>
          </FavoritesProvider>
        </LangProvider>
      </body>
    </html>
  )
}
