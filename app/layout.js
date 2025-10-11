import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider";

import { Manrope, Urbanist } from "next/font/google";
import ConvexClientProvider from "./ConvexClientProvider";
import { Press_Start_2P } from "next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

// Import Manrope font
export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

// Import Urbanist font
export const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-urbanist",
  display: "swap",
});

export const metadata = {
  title: "Astra AI - AI Website Builder",
  description:
    "Build stunning websites effortlessly with Astra's AI-powered website builder. No coding required.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${urbanist.variable}`}
    >
      <body className="font-sans">
        <ConvexClientProvider>
          <Provider>{children}</Provider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}