import type { Metadata } from "next";
import { Archivo_Black, Courier_Prime, Inter } from "next/font/google";
import "./globals.css";

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
});

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courier-prime",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Chip In",
  description: "One link for a small money ask. Proof of purchase included.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variables go on <html>: the Tailwind theme tokens that reference
    // them are declared on :root, and custom properties resolve where declared.
    <html
      lang="en"
      className={`${archivoBlack.variable} ${courierPrime.variable} ${inter.variable}`}
    >
      <body className="pb-10">{children}</body>
    </html>
  );
}
