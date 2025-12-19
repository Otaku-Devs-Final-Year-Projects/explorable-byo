import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ExplorAble BYO | Premium Accessible Tourism",
  description: "Experience Bulawayo with confidence and luxury.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Load Fonts directly in the browser to bypass server connection errors */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans text-stone-800 bg-[#FAF8F5]">{children}</body>
    </html>
  );
}
