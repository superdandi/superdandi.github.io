import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "superdandi",
  description: "superdandi — retro cyberpunk portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased scanlines crt flicker grid-bg">
        {children}
      </body>
    </html>
  );
}
