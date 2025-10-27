/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Configuración experimental para mejorar la compatibilidad
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

export default nextConfig
