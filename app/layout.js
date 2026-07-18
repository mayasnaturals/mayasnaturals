import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Museli — Fuel Your Mornings",
  description:
    "Premium craft muesli for the modern adventurer. Experience the Museli revolution — wholesome, energizing, and crafted with care.",
  keywords: ["muesli", "premium", "breakfast", "healthy", "organic", "craft"],
  openGraph: {
    title: "Museli — Fuel Your Mornings",
    description:
      "Premium craft muesli for the modern adventurer. The Museli revolution starts here.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable}`}
    >
      <body className="antialiased">
        <Providers>
          <Navbar />
          <main style={{ paddingTop: '150px' }}>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
