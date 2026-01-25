
import './globals.css';

export const metadata = {
  title: 'w9999 – 10 000 most common words in 4 languages',
  description: 'Free audio + AI examples. No ads.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="index,follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}