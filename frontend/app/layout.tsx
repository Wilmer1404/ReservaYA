// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext'; 
const inter = Inter({ subsets: ['latin'] });
const robotoMono = Roboto_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ReservaYa Platform',
  description: 'Sistema de gestión de ambientes y reservas',
  generator: 'Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} font-sans antialiased`}>
        {/* Envolver toda la aplicación con AuthProvider */}
        <AuthProvider>
            {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}