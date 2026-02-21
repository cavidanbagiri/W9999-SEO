
import { icons } from 'lucide-react';
import './globals.css';
import YandexMetrica from '@/components/YandexMetrica';  // ← ADD THIS LINE
import YandexPageViewTracker from '@/components/YandexPageViewTracker';  // ← ADD THIS LINE

const yandexCounterId = '106948154';  // ← ADD THIS LINE

export const metadata = {
  title: 'w9999 – 10 000 most common words in 4 languages',
  description: 'Free audio + AI examples. No ads.',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
    android: '/logo.svg',
    manifest: '/logo.svg',
    'theme-color': '#ffffff',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="index,follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/logo.svg" /> */}
      </head>
      <body>
        {children}
          {/* Add page view tracker for SPA navigation */}
        <YandexPageViewTracker />  {/* ← ADD THIS LINE */}
        <YandexMetrica counterId={yandexCounterId} />
      </body>
    </html>
  );
}