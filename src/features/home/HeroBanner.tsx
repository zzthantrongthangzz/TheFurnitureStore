"use client";

import React from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBannerSlider } from "@/hooks/useBannerSlider";

const BANNERS = [
  "/images/design/HeroBanner1.png",
  "/images/design/HeroBanner2.png",
  "/images/design/HeroBanner3.png",
];

export default function HeroBanner() {
  const { currentBanner, setCurrentBanner, nextBanner, prevBanner } =
    useBannerSlider(BANNERS.length);

  return (
    <section className="relative w-full aspect-[16/9] md:aspect-[1920/600] overflow-hidden bg-[#EBEBEB]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={BANNERS[currentBanner]}
            alt={`Banner ${currentBanner + 1}`}
            fill
            priority={currentBanner === 0}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prevBanner}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full text-gray-800 transition-colors z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextBanner}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full text-gray-800 transition-colors z-10"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentBanner(idx)}
            className={`w-3 h-3 rounded-full transition-colors ${idx === currentBanner ? "bg-orange-500" : "bg-white/60 hover:bg-white"}`}
          />
        ))}
      </div>
    </section>
  );
}
