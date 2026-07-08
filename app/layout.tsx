import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "superdandi · full-stack · legacy systems specialist",
  description:
    "COBOL/UNIX + TypeScript/React. Ex-Banco de Chile. Full-stack developer puente entre sistemas financieros legacy y la web moderna. Disponible para senior roles & contracting.",
  openGraph: {
    title: "superdandi · full-stack · legacy systems specialist",
    description:
      "COBOL/UNIX + TypeScript/React. Ex-Banco de Chile. Full-stack developer puente entre sistemas financieros legacy y la web moderna.",
    url: "https://superdandi.github.io",
    siteName: "superdandi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "superdandi · full-stack · legacy systems specialist",
    description:
      "COBOL/UNIX + TypeScript/React. Ex-Banco de Chile. Full-stack developer puente entre sistemas financieros legacy y la web moderna.",
  },
  robots: "index, follow",
  keywords: [
    "full-stack developer",
    "COBOL",
    "TypeScript",
    "React",
    "Next.js",
    "Banco de Chile",
    "legacy systems",
    "financial technology",
    "Chile",
    "senior developer",
  ],
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
