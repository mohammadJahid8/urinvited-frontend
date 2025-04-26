import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Provider from "@/lib/provider";
import { Toaster } from "sonner";
import Navbar from "@/components/global/navbar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Urinvited",
  description: "Urinvited",

  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: {
    locale: string;
  };
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Provider>
          <Navbar />
          {children} <Toaster />
        </Provider>
      </body>
    </html>
  );
}
