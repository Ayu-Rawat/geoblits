import "./globals.css";
import { Auth0Provider } from '@auth0/nextjs-auth0';
import Script from "next/script";
import NavBarWrapper from "@/components/navbar/NavBarWrapper";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <link 
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@100&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <Auth0Provider >
          <Script
            src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
            strategy="beforeInteractive"
          />
          <NavBarWrapper />
          {children}
        </Auth0Provider >
      </body>
    </html>
  );
}
