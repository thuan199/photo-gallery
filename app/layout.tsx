import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";

import "./globals.css";
import ThemeProvider from "./components/ThemeProvider";

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nhìn lại mình đi",
    template: "%s | Nhìn lại mình đi",
  },
  description:
    "Những khoảnh khắc, chuyến đi và ký ức được lưu lại qua từng album ảnh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
  lang="vi"
  suppressHydrationWarning
  data-scroll-behavior="smooth"
>
  <body
    suppressHydrationWarning
    className={`${playfair.variable} antialiased`}
  >
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </body>
</html>
  );
}