import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-inner">
        {/* Top row: Brand + Newsletter */}
        <div className="footer-top">
          <div className="footer-brand-block">
            <h3 className="footer-brand">Maya</h3>
            <p className="footer-tagline">
              Premium craft muesli for the modern adventurer. Wholesome,
              energizing, and crafted with care.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Instagram" className="footer-social-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="footer-social-icon">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="footer-social-icon">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
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
              <Link href="/#story">Our Story</Link>
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
