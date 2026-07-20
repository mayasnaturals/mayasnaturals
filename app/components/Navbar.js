"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCustomer } from "@/context/CustomerContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { customer } = useCustomer();
  const router = useRouter();

  const handleAccountClick = () => {
    if (customer) {
      router.push("/account");
    } else {
      window.location.href = "/api/auth/login";
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Our Story", href: "/our-story" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .marquee-content {
          display: flex;
          gap: 3rem;
          padding-right: 3rem;
        }
      `}</style>
      {/* Coming Soon Banner */}
      <div
        className="absolute top-0 left-0 w-full overflow-hidden z-[101] flex items-center bg-white"
        style={{
          height: '36px',
          borderBottom: '1px solid rgba(227, 6, 19, 0.1)'
        }}
      >
        <div className="animate-marquee">
          <div className="marquee-content">
            {[...Array(8)].map((_, i) => (
              <h2
                key={`m1-${i}`}
                className="m-0 font-black tracking-wider"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.85rem',
                  color: 'var(--brand-red)',
                  lineHeight: 1,
                  whiteSpace: 'nowrap'
                }}
              >
                Free Delivery on Orders Above ₹499
              </h2>
            ))}
          </div>
          <div className="marquee-content">
            {[...Array(8)].map((_, i) => (
              <h2
                key={`m2-${i}`}
                className="m-0 font-black tracking-wider"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.85rem',
                  color: 'var(--brand-red)',
                  lineHeight: 1,
                  whiteSpace: 'nowrap'
                }}
              >
                Free Delivery on Orders Above ₹499
              </h2>
            ))}
          </div>
        </div>
      </div>

      <header
        className={`navbar-header ${isScrolled ? "navbar-scrolled" : ""}`}
        style={{
          top: isScrolled ? "0" : "36px",
          padding: isScrolled ? "1.5rem 0" : "2rem 0",
          transition: "top 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s ease, padding 0.4s ease, box-shadow 0.4s ease",
          background: isScrolled ? "rgba(227, 6, 19, 0.95)" : "var(--brand-red)",
          backdropFilter: isScrolled ? "blur(20px) saturate(1.5)" : "blur(12px) saturate(1.2)",
          WebkitBackdropFilter: isScrolled ? "blur(20px) saturate(1.5)" : "blur(12px) saturate(1.2)",
          borderBottom: isScrolled ? "none" : "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        <div className="navbar-inner">
          {/* Logo (Left) */}
          <Link href="/" className="navbar-logo relative w-[130px] md:w-[160px] h-[50px] flex items-center">
            <Image
              src="/logo.png"
              alt="Maya"
              width={260}
              height={360}
              className="w-auto h-[360px] object-contain drop-shadow-xl"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </Link>

          {/* Desktop Navigation (Center) */}
          <nav className="navbar-links">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="navbar-link">
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Icons (Right) */}
          <div className="navbar-actions">
            <button onClick={handleAccountClick} aria-label="Account" className="navbar-icon-btn">
              <User className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <button onClick={() => setIsCartOpen(true)} aria-label="Cart" className="navbar-cart-btn">
              <ShoppingBag className="w-5 h-5" strokeWidth={2.5} />
              <span className="navbar-cart-badge">{cartCount}</span>
            </button>
            <button
              aria-label="Menu"
              className="navbar-mobile-toggle"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="navbar-mobile-overlay" style={{ zIndex: 1000 }}>
          <div className="navbar-mobile-top">
            <span className="navbar-logo">
              <Image src="/logo.png" alt="Maya" width={200} height={80} className="w-[160px] h-auto object-contain" priority />
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close Menu"
              className="navbar-mobile-close"
            >
              <X className="w-7 h-7" strokeWidth={3} />
            </button>
          </div>
          <nav className="navbar-mobile-links">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="navbar-mobile-link"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="navbar-mobile-actions">
            <button onClick={() => { setIsMobileMenuOpen(false); handleAccountClick(); }} className="navbar-mobile-action-btn">
              <User className="w-5 h-5" strokeWidth={2.5} />
              <span>{customer ? "Account" : "Login"}</span>
            </button>
            <button onClick={() => { setIsMobileMenuOpen(false); setIsCartOpen(true); }} className="navbar-mobile-action-btn">
              <ShoppingBag className="w-5 h-5" strokeWidth={2.5} />
              <span>Cart ({cartCount})</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
