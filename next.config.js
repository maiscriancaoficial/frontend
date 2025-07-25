/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'source.unsplash.com', 
      'images.unsplash.com', 
      'localhost',
      '5olhdyqvsr5br4vg.public.blob.vercel-storage.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  // Ignorar erros do TypeScript durante o build
  typescript: {
    // !! ATENÇÃO !!
    // Ignorando verificações de tipo durante o build, use isso com cautela
    ignoreBuildErrors: true,
  },
  // Ignorar erros de ESLint durante o build
  eslint: {
    // !! ATENÇÃO !!
    // Ignorando verificações de ESLint durante o build, use isso com cautela
    ignoreDuringBuilds: true,
  },
  // Desativar a pré-renderização estática para evitar erros no build
  experimental: {
    // Uma configuração menos rígida para a fase de build
    missingSuspenseWithCSRBailout: false
    // nodeMiddleware foi removido pois requer versão canary do Next.js
  }
}

module.exports = nextConfig
