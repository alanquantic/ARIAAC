import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

import "./globals.css";

const sans = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const display = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "AARIAC | Diagnostico IA para RH",
  description:
    "Diagnostico ejecutivo para evaluar que tan preparada esta una empresa para capacitar talento en IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${sans.variable} ${display.variable} ${mono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
