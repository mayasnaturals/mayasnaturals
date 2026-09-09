import SmoothScroller from "./components/SmoothScroller";
import HeroSection from "./components/HeroSection";
import MarqueeBanner from "./components/MarqueeBanner";
import Link from "next/link";
import CurvedTextSection from "./components/CurvedTextSection";
import CarouselSection from "./components/CarouselSection";
import MarqueeSection from "./components/MarqueeSection";
import StorytellingSection from "./components/StorytellingSection";
import CTASection from "./components/CTASection";
import { getProducts } from "../lib/shopify";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch mueslis and makhanas from Shopify
  const mueslis = await getProducts(3, "Muesli");
  const makhanas = await getProducts(9, "Makhana");

  return (
    <SmoothScroller>
      <main className="overflow-hidden" style={{ background: "#FFF8F0" }}>
        {/* SECTION 1 — Hero with image sequence */}
        <HeroSection />

        <MarqueeBanner
          text="PREMIUM CRAFT MUESLI • 100% REAL INGREDIENTS • ZERO REFINED SUGAR • BOLD FLAVOURS"
          bgColor="#E30613"
          textColor="#ffffffff"
          speed={30}
          fontSize="0.85rem"
        />

        <Link href="/products/chocolate-protein-muesli?variant=46084069949638" className="block cursor-pointer hover:opacity-90 transition-opacity">
          <MarqueeBanner
            text="🚨 LIMITED TIME OFFER: ₹100 OFF CHOCO MUESLI! USE CODE GANESH AT CHECKOUT - CLICK HERE TO SHOP 🚨"
            bgColor="#FBB03B"
            textColor="#000000"
            speed={25}
            fontSize="0.9rem"
            direction="reverse"
          />
        </Link>

        {/* SECTION 2 — Product Showcase */}
        <CurvedTextSection products={mueslis} />

        {/* SECTION 3 — Flavor Carousel */}
        <CarouselSection products={makhanas} />

        {/* SECTION 4 — Double Marquee */}
        <MarqueeSection />

        {/* SECTION 5 — Craft Story */}
        <StorytellingSection />

        {/* SECTION 6 — CTA */}
        <CTASection />
      </main>
    </SmoothScroller>
  );
}
