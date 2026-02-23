import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deep Night Studio | Solutions Numériques",
  description:
    "Studio créatif spécialisé dans la création de solutions numériques sur mesure. Sites web, applications mobiles, consulting et UI/UX design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${geistSans.variable} bg-black font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
