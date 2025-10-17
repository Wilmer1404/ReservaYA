import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from "@/components/ui/sonner" // Importamos el Toaster
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReservaYa Platform',
  description: 'Sistema de gestión de ambientes y reservas',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <Toaster richColors position="top-right" /> {/* Añadimos el componente Toaster */}
        <Analytics />
      </body>
    </html>
  )
}
