import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#1B2E5E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Epotech Hub",
  description: "Portal oficial de gestión de marca y seguimiento de actividades para Epotech Solutions.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Epotech Hub",
  },
  formatDetection: {
    telephone: false,
  },
};

import { NotificationListener } from "@/components/features/NotificationListener";
import { ThemeColorHandler } from "@/components/layout/ThemeColorHandler";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={inter.className}>
        <ThemeColorHandler />
        <NotificationListener />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
