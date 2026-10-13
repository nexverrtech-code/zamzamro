import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Droplet, Filter, Layers, ShieldCheck, Sparkles, Wind } from 'lucide-react';
import SectionHeading from './SectionHeading';
import RealWater from './RealWater';

const stages = [
  { icon: Wind, name: 'Sediment Filter', text: 'Traps sand, rust, silt and visible particles from borewell or tanker water.', tint: '#c9b48a' },
  { icon: Layers, name: 'Activated Carbon', text: 'Absorbs chlorine, odour and organic compounds for clean, fresh taste.', tint: '#9fb3c8' },
  { icon: Filter, name: 'RO Membrane', text: 'Reduces dissolved salts and high TDS — the heart of every RO purifier.', tint: '#3d8fb8' },
  { icon: ShieldCheck, name: 'Post-Carbon Polish', text: 'A final polish that refines taste before water reaches the tank.', tint: '#6fb3cf' },
  { icon: Sparkles, name: 'Copper · Zinc · Alkaline', text: 'Selected models add mineral enrichment to balance purified water.', tint: '#c6ad7c' },
  { icon: Droplet, name: 'Pure Water', text: 'Clear, safe, great-tasting drinking water — pure, forever.', tint: '#a9dce7' },
];

/** Compact, auto-playing journey of a drop through a typical RO purifier (click a stage to jump). */
export default function PurificationJourney() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % stages.length), 2600);
    return () => clearInterval(id);
  }, [paused]);

  const pct = (active / (stages.length - 1)) * 100;
  const Icon = stages[active].icon;

  return (
    <section
      className="relative overflow-hidden bg-navy py-10 text-pearl sm:py-12"
      aria-labelledby="journey-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <RealWater overlay="bg-gradient-to-r from-navy-deep/88 via-navy/70 to-ocean/30" bubbles={12} />
      <div className="container-royal relative grid items-center gap-8 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <SectionHeading light eyebrow="Inside your purifier" title={<span id="journey-title">The journey of <em className="text-gold-shimmer">one drop</em></span>} />
          <ol className="mt-5 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {stages.map((s, i) => (
              <li key={s.name}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${i === active ? 'bg-white/15 ring-1 ring-white/20' : 'opacity-55 hover:opacity-90'}`}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full" style={{ background: i <= active ? s.tint : 'rgb(255 255 255 / 0.1)' }}>
                    <s.icon size={13} className={i <= active ? 'text-navy-deep' : 'text-pearl/70'} />
                  </span>
                  <span className="text-[0.72rem] leading-tight font-medium tracking-[0.04em]">{s.name}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex items-stretch gap-4">
          {/* the pipe */}
          <div className="relative w-12 shrink-0 rounded-full border border-white/15 bg-white/5 p-1">
            <motion.div
              className="absolute inset-x-1 top-1 rounded-full bg-gradient-to-b from-gold/70 via-ocean to-ice"
              animate={{ height: `${Math.max(pct, 6)}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="relative h-[230px]">
              <motion.div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" animate={{ top: `${pct}%` }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                <div className="relative">
                  <motion.div className="absolute inset-0 rounded-full bg-[#8a7349] blur-md" animate={{ opacity: Math.max(0, 0.75 - active * 0.18) }} />
                  <Droplet size={32} fill="#e4f5f8" className="relative text-white drop-shadow-[0_0_12px_rgba(169,220,231,0.9)]" />
                </div>
              </motion.div>
            </div>
          </div>
          {/* active stage */}
          <div className="flex flex-1 items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 24, filter: 'blur(6px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -16, filter: 'blur(4px)' }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-[20px] border border-white/15 bg-white/[0.07] p-5 backdrop-blur"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: stages[active].tint }}>
                  <Icon size={20} className="text-navy-deep" />
                </span>
                <p className="mt-4 text-[0.62rem] font-medium tracking-[0.28em] text-gold">STAGE {active + 1} OF {stages.length}</p>
                <h3 className="mt-1 text-2xl font-medium !text-pearl">{stages[active].name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-pearl/75">{stages[active].text}</p>
                <div className="mt-4 h-0.5 overflow-hidden rounded-full bg-white/10">
                  {!paused && (
                    <motion.div key={active} className="h-full bg-gold" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2.6, ease: 'linear' }} />
                  )}
                </div>
                <p className="mt-3 text-[0.65rem] text-pearl/40">Illustrative — stages vary by model.</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
