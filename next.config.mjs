/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['mapbox-gl', 'react-map-gl'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
}

export default nextConfig
