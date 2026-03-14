import type { Metadata } from 'next'
import { Manrope, Space_Grotesk } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'] })
const spaceGrotesk = Space_Grotesk({ variable: '--font-space-grotesk', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SmartAgency Pro | AMS',
  description: 'Insurance Agency Management',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${spaceGrotesk.variable} antialiased app-shell-bg`}>
        <NextTopLoader color="#0E7490" height={3} showSpinner={false} />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
