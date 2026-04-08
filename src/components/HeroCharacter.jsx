import { motion, useReducedMotion } from "framer-motion";
import { lazy, Suspense, useState } from "react";
import codingAnimation from "../assets/lottie/hero-coding.json";

const Lottie = lazy(() => import("lottie-react").then((m) => ({ default: m.default })));

/**
 * Hero visual: Lottie animation (coding / laptop scene) + floating chips.
 * Falls back to inline SVG if user prefers reduced motion or Lottie fails to render.
 * Lottie asset: free animation from LottieFiles ecosystem (see footer attribution).
 */
export function HeroCharacter() {
  const prefersReducedMotion = useReducedMotion();
  const [lottieError, setLottieError] = useState(false);
  const showLottie = !prefersReducedMotion && !lottieError;

  return (
    <div className="relative mx-auto w-full max-w-[min(100%,440px)] select-none">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(1px 1px at 20% 30%, white 50%, transparent 51%),
            radial-gradient(1px 1px at 70% 20%, white 50%, transparent 51%),
            radial-gradient(1px 1px at 40% 70%, white 50%, transparent 51%),
            radial-gradient(1px 1px at 85% 55%, white 50%, transparent 51%),
            radial-gradient(1px 1px at 10% 80%, white 50%, transparent 51%)`,
          backgroundSize: "100% 100%",
        }}
      />

      <motion.div
        className="absolute -left-1 top-[6%] z-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 px-3 py-2 shadow-lg shadow-emerald-900/40 ring-2 ring-white/20"
        animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-center text-sm font-bold text-white" dir="ltr">
          Python
        </p>
        <p className="text-[10px] font-medium text-emerald-100">لغة البرمجة</p>
      </motion.div>

      <motion.div
        className="absolute -right-2 top-[20%] z-20 w-[140px] overflow-hidden rounded-xl border border-slate-600/80 bg-slate-900/95 shadow-xl backdrop-blur-sm"
        dir="ltr"
        animate={prefersReducedMotion ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <div className="flex items-center gap-1 border-b border-slate-700 px-2 py-1">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>
        <pre className="p-2 font-mono text-[9px] leading-relaxed text-emerald-300">
          {`def greet():
  print("مرحبا")
greet()`}
        </pre>
      </motion.div>

      <div className="relative z-10 mx-auto aspect-[4/3] w-full max-w-[400px] pt-2">
        {showLottie ? (
          <Suspense fallback={<HeroCharacterSvgFallback animate={false} />}>
            <Lottie
              animationData={codingAnimation}
              loop
              className="h-full min-h-[260px] w-full object-contain drop-shadow-2xl"
              rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
              onDataFailed={() => setLottieError(true)}
            />
          </Suspense>
        ) : (
          <HeroCharacterSvgFallback animate={!prefersReducedMotion} />
        )}
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-[55%] -z-0 h-[95%] w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/10"
        aria-hidden
      />
    </div>
  );
}

/** Inline SVG when reduced motion or Lottie unavailable */
function HeroCharacterSvgFallback({ animate }) {
  return (
    <motion.div
      className="relative flex justify-center"
      animate={animate ? { y: [0, -14, 0] } : false}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 400 380"
        className="h-auto max-h-[320px] w-full drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="طالب يقرأ كتاب البرمجة"
      >
        <title>طالب بزي سعودي يقرأ كتاباً</title>
        <defs>
          <linearGradient id="thobeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fcd9bd" />
            <stop offset="100%" stopColor="#e8b89a" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.35" />
          </filter>
        </defs>
        <ellipse cx="200" cy="340" rx="140" ry="28" fill="rgba(56,189,248,0.12)" />
        <path
          d="M120 200 Q100 280 95 340 L305 340 Q300 280 280 200 Q260 160 200 155 Q140 160 120 200Z"
          fill="url(#thobeGrad)"
          filter="url(#softShadow)"
        />
        <path d="M200 175 L200 320" stroke="#cbd5e1" strokeWidth="1.2" opacity="0.5" />
        <path d="M140 310 Q160 335 200 338 Q240 335 260 310" fill="none" stroke="#94a3b8" strokeWidth="2" opacity="0.4" />
        <rect x="175" y="145" width="50" height="35" rx="8" fill="url(#skinGrad)" />
        <ellipse cx="200" cy="115" rx="48" ry="52" fill="url(#skinGrad)" />
        <path
          d="M152 95 Q200 70 248 95 L255 115 Q200 105 145 115 Z"
          fill="#fefefe"
          stroke="#e2e8f0"
          strokeWidth="1"
        />
        <g stroke="#dc2626" strokeWidth="2" opacity="0.85">
          <line x1="165" y1="88" x2="175" y2="100" />
          <line x1="185" y1="82" x2="195" y2="94" />
          <line x1="205" y1="80" x2="215" y2="92" />
          <line x1="225" y1="82" x2="235" y2="94" />
          <line x1="235" y1="88" x2="245" y2="100" />
        </g>
        <ellipse cx="200" cy="108" rx="38" ry="8" fill="#0f172a" opacity="0.15" />
        <ellipse cx="200" cy="88" rx="44" ry="10" fill="#1e293b" opacity="0.9" />
        <ellipse cx="185" cy="118" rx="5" ry="6" fill="#1e293b" />
        <ellipse cx="215" cy="118" rx="5" ry="6" fill="#1e293b" />
        <path d="M188 138 Q200 148 212 138" fill="none" stroke="#c9785c" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="145" cy="215" rx="18" ry="22" fill="url(#skinGrad)" transform="rotate(-20 145 215)" />
        <ellipse cx="255" cy="215" rx="18" ry="22" fill="url(#skinGrad)" transform="rotate(20 255 215)" />
        <g filter="url(#softShadow)">
          <path
            d="M155 210 L200 195 L245 210 L245 255 L200 268 L155 255 Z"
            fill="#fefce8"
            stroke="#d4c4a8"
            strokeWidth="1.5"
          />
          <path d="M200 195 L200 268" stroke="#d4c4a8" strokeWidth="1.2" />
          <line x1="165" y1="220" x2="192" y2="215" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="165" y1="232" x2="192" y2="228" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="208" y1="215" x2="235" y2="220" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="208" y1="228" x2="235" y2="232" stroke="#cbd5e1" strokeWidth="1" />
        </g>
      </svg>
    </motion.div>
  );
}
