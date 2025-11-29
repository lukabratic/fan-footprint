import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Fan Footprint",
  description: "Stadium tracker by sport",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }}>
      <body className={`${inter.variable} antialiased bg-[#0a0d12] text-[#e6eef6]`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
