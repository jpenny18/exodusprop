import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Exodus - Trade Forex Without Depositing Your Own Money",
  description: "Pass a trading challenge and trade forex with our capital. 1-Step evaluation, payouts on-demand in USDT.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

