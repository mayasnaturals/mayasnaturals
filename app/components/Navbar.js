"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, User, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <header
        className={`navbar-header ${isScrolled ? "navbar-scrolled" : ""}`}
      >
        <div className="navbar-inner">
          {/* Logo (Left) */}
          <Link href="/" className="navbar-logo">
            Maya
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
            <button aria-label="Account" className="navbar-icon-btn">
              <User className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <button aria-label="Cart" className="navbar-cart-btn">
              <ShoppingBag className="w-5 h-5" strokeWidth={2.5} />
              <span className="navbar-cart-badge">0</span>
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
        <div className="navbar-mobile-overlay">
          <div className="navbar-mobile-top">
            <span className="navbar-logo">Maya</span>
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
            <button className="navbar-mobile-action-btn">
              <User className="w-5 h-5" strokeWidth={2.5} />
              <span>Account</span>
            </button>
            <button className="navbar-mobile-action-btn">
              <ShoppingBag className="w-5 h-5" strokeWidth={2.5} />
              <span>Cart</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
