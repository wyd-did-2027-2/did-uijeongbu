import localFont from "next/font/local";

import "./globals.css";

const pretendard = localFont({
  src: [
    {
      path: "fonts/Pretendard-Regular.subset.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "fonts/Pretendard-Medium.subset.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "fonts/Pretendard-Bold.subset.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  preload: true,
  variable: "--font-pretendard",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="lenis lenis-smooth">
      <body className={pretendard.className}>{children}</body>
    </html>
  );
}
