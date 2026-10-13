import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { lockScroll } from '../lib/smoothScroll';

const MIN_MS = 1900;

/** A moving water surface whose level follows the load progress. */
function wavePath(progress: number) {
  const level = 150 - (progress / 100) * 158;
  const shift = ((performance.now() / 14) % 52) - 52;
  const amp = progress > 98 ? 0 : 4;
  let d = `M ${shift} ${level}`;
  for (let x = shift; x < 160; x += 26) d += ` q 6.5 ${-amp} 13 0 t 13 0`;
  return `${d} V 160 H ${shift} Z`;
}
const MAX_MS = 4500;

/** Branded preloader: the emblem fills with water as fonts and the page settle. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const start = performance.now();
    let ready = false;
    let raf = 0;
    let finished = false;

    const pageReady = Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => window.addEventListener('load', r, { once: true })),
    ]);
    pageReady.then(() => (ready = true));

    const tick = () => {
      const elapsed = performance.now() - start;
      // Ease toward 90% while waiting; complete once assets are ready and the minimum time has passed.
      const target = ready && elapsed > MIN_MS ? 100 : Math.min(90, (elapsed / MIN_MS) * 90);
      setProgress((p) => p + (target - p) * 0.08);
      if ((ready && elapsed > MIN_MS + 350) || elapsed > MAX_MS) {
        if (!finished) {
          finished = true;
          setProgress(100);
          setTimeout(() => doneRef.current(), 250);
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    lockScroll(true);
    return () => {
      cancelAnimationFrame(raf);
      lockScroll(false);
    };
  }, []);

  return (
    <motion.div
      role="status"
      aria-label="Loading Zam Zam Pure Water System"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-pearl"
      exit={{ clipPath: 'circle(0% at 50% 45%)', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
      initial={{ clipPath: 'circle(150% at 50% 45%)' }}
    >
      <div className="pointer-events-none absolute inset-0 water-bg" />

      {/* Ripples */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute top-[45%] left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/50"
          animate={{ scale: [0.6, 3.2], opacity: [0.7, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: 'easeOut' }}
        />
      ))}

      {/* Emblem filling with water */}
      <motion.div
        className="relative h-36 w-[104px]"
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg viewBox="0 0 104 144" className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <clipPath id="pl-wave">
              <path d={wavePath(progress)} />
            </clipPath>
          </defs>
          <image href="/images/emblem-navy.png" width="104" height="144" opacity="0.14" preserveAspectRatio="xMidYMid meet" />
          <image href="/images/emblem-navy.png" width="104" height="144" clipPath="url(#pl-wave)" preserveAspectRatio="xMidYMid meet" />
        </svg>
        <motion.span
          className="absolute -bottom-3 left-1/2 h-2 w-16 -translate-x-1/2 rounded-full bg-navy/15 blur-md"
          animate={{ scaleX: [1, 1.25, 1] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
      </motion.div>

      <motion.div
        className="relative mt-10 text-center"
        initial={{ opacity: 0, letterSpacing: '0.6em' }}
        animate={{ opacity: 1, letterSpacing: '0.18em' }}
        transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-royal text-4xl text-navy sm:text-5xl">ZAM ZAM</p>
        <p className="mt-2 font-royal text-xs tracking-[0.35em] text-navy/80 sm:text-sm">PURE WATER SYSTEM</p>
      </motion.div>

      <motion.p
        className="relative mt-5 flex items-center gap-3 font-display text-lg text-gold-deep italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        <span className="h-px w-10 bg-gold" /> Pure Forever <span className="h-px w-10 bg-gold" />
      </motion.p>

      <div className="relative mt-10 h-[2px] w-44 overflow-hidden rounded-full bg-navy/10">
        <div className="h-full rounded-full bg-gradient-to-r from-ice via-ocean to-navy" style={{ width: `${progress}%` }} />
      </div>
    </motion.div>
  );
}
