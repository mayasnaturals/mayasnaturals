"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { ENABLE_SALE_POPUP } from "@/config/features";

export default function SalePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (!ENABLE_SALE_POPUP) return;

    const hasSeen = sessionStorage.getItem("hasSeenSalePopup");
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("hasSeenSalePopup", "true");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted || !isOpen) return null;

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
            <h2 className="text-4xl sm:text-5xl font-black mb-2 text-yellow-300 drop-shadow-md" style={{ fontFamily: 'var(--font-display)' }}>
              100 ₹ OFF
            </h2>
            <p className="text-lg font-bold tracking-wider uppercase drop-shadow mb-4">Limited Time Offer</p>
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
