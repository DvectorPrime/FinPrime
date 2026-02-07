import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FinPrime - Personal Finance Tracker',
    short_name: 'FinPrime',
    description: 'Track expenses, budget smarter, and master your money with AI.',
    start_url: '/login',
    display: 'standalone',
    background_color: '#ffffff', // Default to white (standard for splash screens)
    theme_color: '#0079BF',      // Your Brand Blue (The install bar color)
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}