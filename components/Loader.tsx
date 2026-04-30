'use client';

import { useEffect, useState } from 'react';

export default function Loader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Mimic the loading behavior from the demo
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-[#1a1f2e] z-[9999] flex flex-col items-center justify-center gap-8 transition-opacity duration-700 ${!isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {/* Brand wordmark */}
      <div className="text-[clamp(22px,5vw,32px)] font-bold tracking-[5px] uppercase text-[#d4a843] animate-[fadeUp_0.6s_0.2s_forwards] opacity-0">
        Ziqa Exprees
      </div>

      {/* Honeycomb / hex loader */}
      <div className="flex gap-[6px] items-end animate-[fadeUp_0.6s_0.4s_forwards] opacity-0">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-[14px] h-[14px] bg-[#d4a843] animate-[hexBounce_1.2s_ease-in-out_infinite]"
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              animationDelay: `${i * 0.15}s`,
              backgroundColor: i % 2 === 1 ? '#c49030' : '#d4a843',
            }}
          />
        ))}
      </div>

      {/* Loading bar */}
      <div className="w-[min(260px,70vw)] h-[2px] bg-white/10 rounded-[2px] overflow-hidden animate-[fadeUp_0.6s_0.5s_forwards] opacity-0">
        <div className="h-full bg-[linear-gradient(90deg,#c49030,#d4a843,#ffe08a,#d4a843)] bg-[length:200%_100%] rounded-[2px] animate-[barFill_1.8s_0.6s_cubic-bezier(0.4,0,0.2,1)_forwards,shimmer_1.4s_0.6s_linear_infinite]" />
      </div>

      <div className="text-[11px] tracking-[3px] uppercase text-white/30 animate-[fadeUp_0.6s_0.6s_forwards] opacity-0">
        Quiet Luxury Dining
      </div>

      <style jsx global>{`
        @keyframes hexBounce {
          0%, 100% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-14px) scale(0.85); opacity: 0.6; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes barFill {
          to { width: 100%; }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
