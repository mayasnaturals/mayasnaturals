"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { ENABLE_SALE_POPUP } from "@/config/features";

export default function SalePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isSpecialPage = pathname?.startsWith('/partner-portal') || pathname?.startsWith('/admin-s3cr3t-p4n3l-8891');

  useEffect(() => {
    setMounted(true);
    if (!ENABLE_SALE_POPUP || isSpecialPage) return;

    const hasSeen = sessionStorage.getItem("hasSeenSalePopup");
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("hasSeenSalePopup", "true");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isSpecialPage]);

  if (!mounted || !isOpen || isSpecialPage) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Sun/Flash background effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[150vw] h-[150vw] sm:w-[80vw] sm:h-[80vw] bg-[radial-gradient(circle,rgba(255,200,0,0.8)_0%,rgba(255,100,0,0.4)_40%,transparent_70%)] animate-[spin_10s_linear_infinite] opacity-60"></div>
      </div>

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)]">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-gray-800 shadow-md transition-all"
        >
          <X size={20} className="font-bold" />
        </button>

        <div className="relative w-full h-[350px] sm:h-[450px]">
          <Image
            src="/choco_muesli_sale.png"
            alt="Choco Muesli Sale"
            fill
            className="object-cover"
          />

          {/* Text Overlay */}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-12 text-center text-white">
            <div className="inline-block bg-gradient-to-r from-red-700 via-red-600 to-red-700 px-4 py-2 rounded-xl shadow-[0_4px_15px_rgba(200,0,0,0.4)] transform -rotate-2 border border-red-500/50 mb-2 mt-4">
              <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#FFD700] to-[#F59E0B] filter drop-shadow-[0_2px_2px_rgba(0,0,0,1)]" style={{ fontFamily: 'var(--font-display)', padding: '0 2px', lineHeight: 1 }}>
                EXTRA ₹ 100  OFF
              </h2>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/products/chocolate-protein-muesli?variant=46084069949638');
              }}
              className="px-8 py-3 bg-gradient-to-r from-[#D4145A] to-[#FBB03B] hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-full shadow-[0_4px_15px_rgba(255,100,0,0.5)] transform hover:scale-105 transition-all uppercase tracking-wide"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes popIn {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
