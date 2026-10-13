import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { MapPin } from 'lucide-react';
import ServiceIcon from './ServiceIcon';
import { services } from '../data/services';
import { products, fullName } from '../data/products';
import { business } from '../data/business';

/* ───────────── Products: 3D card deck that tilts with the pointer and shuffles ───────────── */
export function ProductDeckVisual() {
  const deck = products.filter((p) => p.image && p.category === 'domestic').slice(0, 5);
  const [order, setOrder] = useState(deck.map((_, i) => i));
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [12, -12]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-16, 16]), { stiffness: 120, damping: 18 });

  useEffect(() => {
    const id = setInterval(() => setOrder((o) => [...o.slice(1), o[0]]), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative mx-auto h-[270px] w-full max-w-sm sm:h-[300px]"
      style={{ perspective: 1200 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.div className="absolute inset-0" style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}>
        {order.map((idx, pos) => {
          const p = deck[idx];
          return (
            <motion.div
              key={p.slug}
              className="absolute top-1/2 left-1/2 h-[240px] w-[185px] cursor-pointer overflow-hidden rounded-[18px] border-4 border-white bg-white shadow-lift sm:h-[270px] sm:w-[205px]"
              animate={{
                x: `calc(-50% + ${pos * 28 - 48}px)`,
                y: `calc(-50% + ${pos * -14 + 20}px)`,
                z: -pos * 70,
                rotateZ: pos * 4 - 6,
                opacity: pos > 3 ? 0 : 1,
              }}
              transition={{ type: 'spring', stiffness: 140, damping: 20 }}
              style={{ zIndex: deck.length - pos }}
              onClick={() => setOrder((o) => [...o.slice(1), o[0]])}
            >
              <img src={p.image} alt={fullName(p)} className="h-full w-full object-cover" />
              <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/45 via-white/0 to-navy/10" />
              <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[22px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6),inset_0_-30px_40px_-30px_rgba(32,38,87,0.35)]" />
              {pos === 0 && (
                <Link
                  to={`/products/${p.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/90 px-4 py-2.5 text-left backdrop-blur"
                >
                  <span className="block text-[0.6rem] font-bold tracking-[0.2em] text-gold-deep uppercase">{p.brand}</span>
                  <span className="block font-display text-lg font-medium text-navy">{p.name}</span>
                </Link>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ───────────── Services: icons orbiting the emblem on a tilted 3D ring ───────────── */
export function ServiceOrbitVisual() {
  const [hover, setHover] = useState<number | null>(null);
  const items = services;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[320px]">
      <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,#e4f5f8_55%,#a9dce7)] shadow-[0_40px_60px_-25px_rgba(32,38,87,0.45),inset_0_-12px_30px_rgba(61,143,184,0.25)]" />
      <div className="absolute inset-[6%] rounded-full border border-dashed border-navy/15" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <img src="/images/emblem-navy.png" alt="" className="mx-auto h-14 w-auto" />
          <AnimatePresence mode="wait">
            <motion.p
              key={hover ?? 'all'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-2 max-w-[130px] font-display text-base leading-tight font-medium text-navy"
            >
              {hover === null ? `${items.length} services` : items[hover].title}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      <div className="absolute inset-0 animate-[spin_40s_linear_infinite] hover:[animation-play-state:paused] [&:hover_.counter]:[animation-play-state:paused]">
        {items.map((s, i) => {
          const a = (i / items.length) * Math.PI * 2;
          return (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${50 + Math.cos(a) * 44}%`, top: `${50 + Math.sin(a) * 44}%` }}
              aria-label={s.title}
            >
              <span className="counter grid h-10 w-10 animate-[spin_40s_linear_infinite_reverse] place-items-center rounded-2xl bg-gradient-to-b from-navy-soft to-navy-deep text-gold shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-3px_6px_rgba(0,0,0,0.25),0_12px_22px_-8px_rgba(32,38,87,0.6)] ring-1 ring-white/10 transition hover:scale-115 hover:from-gold hover:to-gold-deep hover:text-navy-deep sm:h-11 sm:w-11">
                <ServiceIcon name={s.icon} size={18} />
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────── Installation: realistic schematic — tank → purifier → chrome tap → glass ───────────── */
export function InstallFlowVisual() {
  return (
    <svg viewBox="0 0 440 340" className="mx-auto w-full max-w-md drop-shadow-[0_30px_40px_rgba(32,38,87,0.18)]" role="img" aria-label="Animated diagram of water flowing from a tank through a purifier into a glass">
      <defs>
        <linearGradient id="iv-chrome" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".45" stopColor="#c9d0d8" />
          <stop offset=".55" stopColor="#9aa4b0" />
          <stop offset="1" stopColor="#e9edf1" />
        </linearGradient>
        <linearGradient id="iv-chrome-v" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".45" stopColor="#c9d0d8" />
          <stop offset=".55" stopColor="#9aa4b0" />
          <stop offset="1" stopColor="#e9edf1" />
        </linearGradient>
        <linearGradient id="iv-water" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#d4f0f8" stopOpacity=".9" />
          <stop offset="1" stopColor="#4fa9cc" stopOpacity=".95" />
        </linearGradient>
        <linearGradient id="iv-body" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#2a3170" />
          <stop offset=".5" stopColor="#202657" />
          <stop offset="1" stopColor="#141838" />
        </linearGradient>
        <linearGradient id="iv-tank" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".6" stopColor="#eef3f6" />
          <stop offset="1" stopColor="#cfd8de" />
        </linearGradient>
        <linearGradient id="iv-glass" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".9" />
          <stop offset=".2" stopColor="#ffffff" stopOpacity=".15" />
          <stop offset=".8" stopColor="#ffffff" stopOpacity=".1" />
          <stop offset="1" stopColor="#ffffff" stopOpacity=".7" />
        </linearGradient>
        <clipPath id="iv-glass-clip"><path d="M343 236 L389 236 L383 304 Q382 310 376 310 L356 310 Q350 310 349 304 Z" /></clipPath>
        <clipPath id="iv-pipe1"><path d="M58 108 V176 H178" fill="none" stroke="#000" strokeWidth="9" /></clipPath>
        <filter id="iv-soft"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <style>{`
        .iv-flow { stroke-dasharray: 3 14; animation: iv-flow 1s linear infinite; }
        @keyframes iv-flow { to { stroke-dashoffset: -34; } }
        .iv-fill { animation: iv-fill 6s cubic-bezier(.4,0,.2,1) infinite; transform-origin: 366px 310px; transform-box: view-box; }
        @keyframes iv-fill { 0%,8% { transform: scaleY(0); } 72%,90% { transform: scaleY(1); } 100% { transform: scaleY(0); } }
        .iv-stream { animation: iv-stream 6s linear infinite; }
        @keyframes iv-stream { 0%,6% { opacity: 0; } 9%,72% { opacity: 1; } 76%,100% { opacity: 0; } }
        .iv-led { animation: iv-led 1.4s ease-in-out infinite; }
        @keyframes iv-led { 50% { opacity: .25; } }
        .iv-wave { animation: iv-wave 3s ease-in-out infinite; }
        @keyframes iv-wave { 50% { transform: translateX(-12px); } }
      `}</style>

      {/* floor shadow */}
      <ellipse cx="240" cy="318" rx="170" ry="10" fill="#202657" opacity=".12" filter="url(#iv-soft)" />

      {/* Overhead tank (rotomoulded) */}
      <g>
        <rect x="14" y="18" width="88" height="90" rx="20" fill="url(#iv-tank)" stroke="#202657" strokeOpacity=".12" />
        {[40, 60, 80].map((y) => <line key={y} x1="16" x2="100" y1={y} y2={y} stroke="#202657" strokeOpacity=".06" />)}
        <clipPath id="iv-tank-clip"><rect x="18" y="22" width="80" height="82" rx="16" /></clipPath>
        <g clipPath="url(#iv-tank-clip)">
          <g className="iv-wave"><path d="M0 58 Q 15 52 30 58 T 60 58 T 90 58 T 120 58 V 120 H 0 Z" fill="url(#iv-water)" opacity=".75" /></g>
        </g>
        <rect x="22" y="24" width="10" height="76" rx="5" fill="#fff" opacity=".7" />
        <text x="58" y="44" textAnchor="middle" fontSize="9" fontWeight="700" fill="#202657" letterSpacing="2">TANK</text>
      </g>

      {/* Inlet pipe: chrome shell + clear core with flowing water */}
      <path d="M58 108 V176 H178" fill="none" stroke="url(#iv-chrome)" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M58 108 V176 H178" fill="none" stroke="#bfe6f0" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M58 108 V176 H178" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" className="iv-flow" />

      {/* Purifier */}
      <g>
        <rect x="178" y="92" width="128" height="158" rx="22" fill="url(#iv-body)" />
        <rect x="182" y="96" width="10" height="150" rx="5" fill="#fff" opacity=".08" />
        <rect x="190" y="106" width="104" height="82" rx="12" fill="#eaf6fa" opacity=".18" stroke="#fff" strokeOpacity=".25" />
        {[
          { x: 200, c: '#f1ede2' },
          { x: 224, c: '#2b2d31' },
          { x: 248, c: '#2e66b8' },
          { x: 272, c: '#c07a45' },
        ].map((f) => (
          <g key={f.x}>
            <rect x={f.x} y="114" width="14" height="64" rx="7" fill={f.c} />
            <rect x={f.x + 2} y="116" width="3" height="58" rx="1.5" fill="#fff" opacity=".35" />
            <rect x={f.x - 1} y="112" width="16" height="6" rx="3" fill="#f7f7f7" />
          </g>
        ))}
        <rect x="190" y="106" width="104" height="82" rx="12" fill="url(#iv-glass)" />
        <circle cx="204" cy="222" r="4.5" fill="#25D366" className="iv-led" />
        <circle cx="219" cy="222" r="4.5" fill="#7fd0ee" className="iv-led" style={{ animationDelay: '.4s' }} />
        <circle cx="234" cy="222" r="4.5" fill="#c6ad7c" />
        <text x="282" y="226" textAnchor="end" fontSize="10" fontFamily="Marcellus, serif" fill="#c6ad7c" letterSpacing="2">ZAM ZAM</text>
      </g>

      {/* Outlet pipe to the tap */}
      <path d="M306 176 H366 V214" fill="none" stroke="url(#iv-chrome-v)" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M306 176 H366 V214" fill="none" stroke="#d9f3fa" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M306 176 H366 V214" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" className="iv-flow" />
      <rect x="356" y="208" width="20" height="14" rx="4" fill="url(#iv-chrome-v)" />

      {/* Falling stream */}
      <g className="iv-stream">
        <rect x="364" y="222" width="4" height="84" rx="2" fill="#bfe6f0" opacity=".85" />
        <rect x="364.6" y="222" width="1.2" height="84" fill="#fff" />
      </g>

      {/* Glass + water */}
      <g clipPath="url(#iv-glass-clip)">
        <g className="iv-fill">
          <rect x="336" y="248" width="60" height="64" fill="url(#iv-water)" />
          <path d="M336 249 Q 366 244 396 249" stroke="#fff" strokeOpacity=".8" strokeWidth="2" fill="none" />
        </g>
        {[352, 362, 372, 380].map((x, i) => (
          <motion.circle key={x} cx={x} r={1.6 + (i % 2)} fill="#fff" opacity=".8" animate={{ cy: [306, 256], opacity: [0.9, 0] }} transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.5, ease: 'easeIn' }} />
        ))}
      </g>
      <path d="M343 236 L389 236 L383 304 Q382 310 376 310 L356 310 Q350 310 349 304 Z" fill="url(#iv-glass)" stroke="#202657" strokeOpacity=".22" strokeWidth="1.5" />
      <ellipse cx="366" cy="236" rx="23" ry="3" fill="none" stroke="#202657" strokeOpacity=".2" />

      {/* Labels */}
      {[
        { x: 118, y: 196, t: '1 · Inlet' },
        { x: 242, y: 272, t: '2 · Purify' },
        { x: 366, y: 334, t: '3 · Pure water' },
      ].map((l) => (
        <text key={l.t} x={l.x} y={l.y} textAnchor="middle" fontSize="11" fontWeight="600" fill="#6b7194">{l.t}</text>
      ))}
    </svg>
  );
}

/* ───────────── About: the word PURE filled with real, moving water ───────────── */
export function PureWaveVisual() {
  const wave = 'M0 92 Q 62 74 125 92 T 250 92 T 375 92 T 500 92 T 625 92 T 750 92 T 875 92 T 1000 92 V 260 H 0 Z';
  return (
    <div className="relative mx-auto w-full max-w-md">
      <svg viewBox="0 0 500 220" className="w-full drop-shadow-[0_24px_30px_rgba(16,40,70,0.25)]" role="img" aria-label="The word PURE filling with water">
        <defs>
          <clipPath id="pure-text">
            <text x="250" y="175" textAnchor="middle" fontFamily="Marcellus, serif" fontSize="170" letterSpacing="6">PURE</text>
          </clipPath>
          <mask id="pure-level">
            <motion.g animate={{ y: [34, -6, 34] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
              <motion.path d={wave} fill="#fff" animate={{ x: [0, -250] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }} />
            </motion.g>
          </mask>
        </defs>
        {/* empty glass letters */}
        <text x="250" y="175" textAnchor="middle" fontFamily="Marcellus, serif" fontSize="170" letterSpacing="6" fill="rgba(255,255,255,0.55)" stroke="#202657" strokeOpacity=".22" strokeWidth="1.5">
          PURE
        </text>
        <g clipPath="url(#pure-text)">
          <g mask="url(#pure-level)">
            {/* real underwater photo, drifting slowly inside the letters */}
            <motion.image
              href="/images/water-turquoise-sm.webp"
              x="-40"
              y="-60"
              width="620"
              height="420"
              preserveAspectRatio="xMidYMid slice"
              animate={{ x: [-40, -10, -40], y: [-60, -40, -60] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />
          </g>
          {/* bright meniscus line riding the wave */}
          <motion.g animate={{ y: [34, -6, 34] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
            <motion.path
              d="M0 92 Q 62 74 125 92 T 250 92 T 375 92 T 500 92 T 625 92 T 750 92 T 875 92 T 1000 92"
              fill="none"
              stroke="#ffffff"
              strokeOpacity=".85"
              strokeWidth="2.5"
              animate={{ x: [0, -250] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
            />
          </motion.g>
          {[70, 130, 190, 245, 300, 360, 420].map((x, i) => (
            <motion.circle
              key={x}
              cx={x}
              r={2 + (i % 3)}
              fill="rgba(255,255,255,0.15)"
              stroke="#fff"
              strokeOpacity=".85"
              strokeWidth="1.1"
              animate={{ cy: [205, 120], cx: [x, x + (i % 2 ? 6 : -6), x], opacity: [0, 0.95, 0] }}
              transition={{ duration: 2.6 + (i % 3) * 0.6, repeat: Infinity, delay: i * 0.45, ease: 'easeOut' }}
            />
          ))}
        </g>
      </svg>
      <p className="-mt-2 text-center font-display text-2xl text-gold-deep italic">— forever —</p>
    </div>
  );
}

/* ───────────── Contact: radar map with service areas and live Erode time ───────────── */
export function RadarMapVisual() {
  const [time, setTime] = useState('');
  const areas = business.serviceAreas.slice(0, 8);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit' });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-full bg-navy shadow-lift">
      {/* grid + rings */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#a9dce7 1px, transparent 1px), linear-gradient(90deg, #a9dce7 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      {[0.25, 0.5, 0.75].map((r) => (
        <span key={r} className="absolute rounded-full border border-ice/25" style={{ inset: `${r * 50}%` }} />
      ))}
      {/* sweep */}
      <div
        className="absolute inset-0 animate-[spin_5s_linear_infinite] rounded-full"
        style={{ background: 'conic-gradient(from 0deg, rgba(198,173,124,0.45), transparent 22%)' }}
      />
      {/* pings */}
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          className="absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold"
          animate={{ scale: [0.3, 4], opacity: [0.9, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 1.5 }}
        />
      ))}
      {/* areas */}
      {areas.map((a, i) => {
        const ang = (i / areas.length) * Math.PI * 2 - Math.PI / 2;
        const rad = i % 2 ? 30 : 38;
        return (
          <motion.span
            key={a}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 px-2 py-0.5 text-[0.62rem] font-medium whitespace-nowrap text-pearl backdrop-blur"
            style={{ left: `${50 + Math.cos(ang) * rad}%`, top: `${50 + Math.sin(ang) * rad}%` }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.08 }}
          >
            {a}
          </motion.span>
        );
      })}
      {/* centre */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold text-navy-deep shadow-glow">
          <MapPin size={22} />
        </span>
        <p className="mt-2 font-royal text-[0.65rem] tracking-[0.2em] text-gold">POONDURAI ROAD</p>
      </div>
      <p className="absolute bottom-[11%] left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-[0.7rem] font-semibold text-pearl">
        Erode · {time}
      </p>
    </div>
  );
}
