import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The November Window — Interactive Playbook",
  description:
    "A 14-section operating manual for building a faceless content channel around the biggest entertainment launch of the decade. Live until the window closes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;700;800;900&family=Chivo:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
