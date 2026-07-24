import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-inner">
        {/* Top row: Brand + Newsletter */}
        <div className="footer-top">
          <div className="footer-brand-block">
            <div className="footer-brand">
              <Image src="/logo.png" alt="Maya" width={200} height={80} className="h-20 w-auto object-contain" style={{ width: "auto", height: "auto" }} />
            </div>
            <p className="footer-tagline">
              Premium craft muesli for the modern adventurer. Wholesome,
              energizing, and crafted with care.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Instagram" className="footer-social-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="footer-social-icon">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" aria-label="WhatsApp" className="footer-social-icon">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-newsletter">
            <h4 className="footer-heading">Join the Club</h4>
            <p className="footer-newsletter-text">
              Subscribe for special offers, new recipes, and 15% off your first
              order.
            </p>
            <form className="footer-newsletter-form">
              <input
                type="email"
                placeholder="your@email.com"
                className="footer-newsletter-input"
                required
              />
              <button type="submit" className="footer-newsletter-btn" aria-label="Subscribe">
                <ArrowRight className="w-5 h-5" strokeWidth={3} />
              </button>
            </form>
          </div>
        </div>

        {/* Link columns */}
        <div className="footer-links-row">
          <div className="footer-col">
            <h4 className="footer-heading">Shop</h4>
            <nav className="footer-col-links">
              <Link href="/products">All Products</Link>
              <Link href="#">Best Sellers</Link>
              <Link href="#">Subscriptions</Link>
              <Link href="#">Gift Cards</Link>
            </nav>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">About</h4>
            <nav className="footer-col-links">
              <Link href="/our-story">Our Story</Link>
              <Link href="#">Sustainability</Link>
              <Link href="#">Ingredients</Link>
              <Link href="/#contact">Contact Us</Link>
            </nav>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Help</h4>
            <nav className="footer-col-links">
              <Link href="#">FAQ</Link>
              <Link href="#">Shipping</Link>
              <Link href="#">Returns</Link>
              <Link href="#">Track Order</Link>
            </nav>
          </div>
          <div className="footer-col items-center lg:items-end justify-center w-full mt-4 lg:mt-0">
            <a href="https://www.refrens.com/free-accounting-software" target="_blank" rel="noopener noreferrer" className="opacity-90 hover:opacity-100 transition-opacity duration-300 w-full max-w-[280px]">
              <Image src="/refrens.png" alt="Accounting Powered by Refrens" width={350} height={120} className="w-full h-auto object-contain mx-auto" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Maya Muesli. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
