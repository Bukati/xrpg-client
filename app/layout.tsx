import type { Metadata, Viewport } from "next";
import { Press_Start_2P, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "./components/Header";

const pressStart = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "xRPG - Grok-Powered Ideological Battle Royale",
    template: "%s | xRPG",
  },
  description:
    "The Grok-powered ideological battle royale that lives entirely on X. Turn any spicy tweet into a live, branching civilization simulation where losing sides get publicly executed with personalized Grok roasts.",
  keywords: [
    "xRPG",
    "X",
    "Twitter",
    "Grok",
    "battle royale",
    "ideology",
    "game",
    "civilization",
    "simulation",
  ],
  authors: [{ name: "xRPG Team" }],
  creator: "xRPG",
  metadataBase: new URL("https://xrpg.gg"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://xrpg.gg",
    siteName: "xRPG",
    title: "xRPG - Grok-Powered Ideological Battle Royale",
    description:
      "Turn any spicy tweet into a live, branching civilization simulation. Losing sides get publicly executed with Grok roasts.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "xRPG - Ideological Battle Royale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "xRPG - Grok-Powered Ideological Battle Royale",
    description:
      "Turn any spicy tweet into a live, branching civilization simulation on X.",
    images: ["/og-image.png"],
    creator: "@xrpg_gg",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0a0f14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${pressStart.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Providers>
          <Header />
          <main className="pt-14">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
