// app/layout.js (or /app/layout.jsx if using JSX extension)
import "./globals.css";
import Script from "next/script";
import { Auth0Provider } from '@auth0/nextjs-auth0';
import NavBarWrapper from "@/components/navbar/NavBarWrapper";

// Optional: Add font import if you use custom fonts
// import localFont from 'next/font/local';
// const impact = localFont({ src: '../public/fonts/impact.ttf' });

export const metadata = {
  title: "GeoBlits",
  description: "Boost your geography knowledge with the most interactive quiz game.",
  openGraph: {
    title: 'GeoBlits - Geography Quiz App',
    description: 'Master maps with GeoBlits — your go-to quiz game for geography enthusiasts.',
    url: 'https://geoblits.ayush.it.com',
    siteName: 'GeoBlits',
    images: [
      {
        url: 'https://geoblits.ayush.it.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GeoBlits Cover Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GeoBlits - Play & Learn Geography',
    description: 'Fun, interactive and educational geography quiz. Play now!',
    images: ['/og-image.png'],
  },
  keywords: [
    "Geo quiz",
    "Geography quiz",
    "Country capitals game",
    "World map learning",
    "GeoBlits",
    "Interactive map quiz",
    "Online geography game"
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Auth0Provider>
          <Script
            src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
            strategy="beforeInteractive"
          />
          <NavBarWrapper />
          {children}
        </Auth0Provider>
      </body>
    </html>
  );
}
