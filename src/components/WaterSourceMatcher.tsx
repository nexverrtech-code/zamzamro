import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Building, Droplets, Factory, MessageCircle, Mountain, Truck, Waves } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { getProduct, type Product } from '../data/products';
import { whatsappLink } from '../data/business';

const sources = [
  { id: 'borewell', label: 'Borewell', icon: Mountain, tds: 900 },
  { id: 'tanker', label: 'Tanker', icon: Truck, tds: 700 },
  { id: 'municipal', label: 'Municipal', icon: Droplets, tds: 300 },
  { id: 'corporation', label: 'Corporation', icon: Building, tds: 350 },
  { id: 'well', label: 'Open Well', icon: Waves, tds: 600 },
  { id: 'commercial', label: 'Office / Business', icon: Factory, tds: 600 },
] as const;

type SourceId = (typeof sources)[number]['id'];

function recommend(source: SourceId, tds: number): { title: string; note: string; picks: Product[] } {
  const pick = (...slugs: string[]) => slugs.map((s) => getProduct(s)!).filter(Boolean);
  if (source === 'commercial')
    return {
      title: 'Commercial RO or stainless-steel system',
      note: 'High daily demand calls for a triple-stage commercial RO or a Zam Zam SS dispenser sized to your headcount.',
      picks: pick('triple-stage-commercial-ro', 'zamzam-hot-normal-ss-system', 'zamzam-standard-ss-system'),
    };
  if (tds > 1200)
    return {
      title: 'High-TDS RO purifier',
      note: 'At this level you need an RO purifier rated for high TDS. A softener can also protect bathrooms and appliances from scaling.',
      picks: pick('clean-water-aqua-ultra', 'water-softener-system', 'nile-aqua-jade'),
    };
  if (tds > 500)
    return {
      title: 'RO with mineral enrichment',
      note: 'RO handles the dissolved salts, while copper, zinc or alkaline stages bring back a balanced taste.',
      picks: pick('aqua-2090-raga-series', 'nile-aqua-jade', 'clean-water-aqua-ultra'),
    };
  return {
    title: 'Compact RO purifier with taste enhancement',
    note: 'Even softer supply water benefits from RO and carbon polishing for better taste and fewer impurities.',
    picks: pick('nile-aqua-v5', 'water-pia', 'lx-one-titanium-gun-metal'),
  };
}

/** Interactive helper: pick your water source and TDS to see suitable purifier types. */
export default function WaterSourceMatcher() {
  const [source, setSource] = useState<SourceId>('borewell');
  const [tds, setTds] = useState(900);
  const result = useMemo(() => recommend(source, tds), [source, tds]);
  const level = tds < 300 ? 'Low' : tds < 600 ? 'Moderate' : tds < 1200 ? 'High' : 'Very high';
  const clarity = Math.max(0, 1 - tds / 2000);

  return (
    <section className="relative overflow-hidden py-8 sm:py-10" aria-labelledby="matcher-title">
      <div className="container-royal">
        <SectionHeading
          eyebrow="Water source matcher"
          title={<span id="matcher-title">Every source, <em className="text-gold-shimmer">a perfect match</em></span>}
          intro="Pick your water source and TDS — we’ll suggest the purifiers that fit."
        />

        <div className="mt-6 grid items-stretch gap-5 lg:grid-cols-2">
          <div className="card-royal flex flex-col p-5 sm:p-6">
            <p className="text-[0.82rem] font-medium text-navy">1 · Where does your water come from?</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {sources.map((s) => {
                const on = s.id === source;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSource(s.id);
                      setTds(s.tds);
                    }}
                    aria-pressed={on}
                    className={`relative flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-[0.75rem] font-medium transition ${
                      on ? 'border-navy bg-navy text-pearl shadow-soft' : 'border-navy/10 bg-pearl text-navy hover:border-gold'
                    }`}
                  >
                    <s.icon size={18} strokeWidth={1.5} className={on ? 'text-gold' : 'text-navy/70'} />
                    {s.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-baseline justify-between">
              <label htmlFor="tds" className="text-[0.82rem] font-medium text-navy">2 · Approximate TDS (if known)</label>
              <span className="font-display text-2xl font-medium text-navy">{tds}<span className="ml-1 text-sm text-mist">ppm</span></span>
            </div>
            <input
              id="tds"
              type="range"
              min={50}
              max={2000}
              step={50}
              value={tds}
              onChange={(e) => setTds(Number(e.target.value))}
              className="mt-2 w-full accent-[#202657]"
            />
            <div className="mt-1 flex justify-between text-[0.7rem] text-mist">
              <span>50</span>
              <span className="font-semibold text-gold-deep">{level}</span>
              <span>2000</span>
            </div>

            {/* Glass of water that clears as TDS drops */}
            <div className="mt-auto flex items-end gap-4 pt-4">
              <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-b-[22px] rounded-t-md border-2 border-navy/15 bg-white">
                <motion.div
                  className="absolute inset-x-0 bottom-0 h-[78%]"
                  animate={{ backgroundColor: `rgba(${Math.round(169 + (1 - clarity) * 40)}, ${Math.round(220 - (1 - clarity) * 70)}, ${Math.round(231 - (1 - clarity) * 140)}, ${0.35 + (1 - clarity) * 0.5})` }}
                  transition={{ duration: 0.6 }}
                />
                <motion.div className="absolute inset-x-0 bottom-[78%] h-1.5 bg-white/80" animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity }} />
              </div>
              <p className="text-[0.8rem] leading-relaxed text-mist">
                Most purifiers we install bring drinking water to a comfortable taste range. Don’t know your TDS? <strong className="text-navy">We test it for you.</strong>
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={result.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45 }}
              className="relative flex h-full flex-col overflow-hidden rounded-[20px] bg-gradient-to-br from-navy to-navy-soft p-5 text-pearl shadow-lift sm:p-6"
            >
              <p className="text-[0.62rem] font-medium tracking-[0.3em] text-gold">OUR SUGGESTION</p>
              <h3 className="mt-2 text-2xl font-medium !text-pearl sm:text-[1.7rem]">{result.title}</h3>
              <p className="mt-1.5 text-[0.85rem] text-pearl/75">{result.note}</p>
              <ul className="mt-4 mb-4 space-y-2">
                {result.picks.map((p) => (
                  <li key={p.slug}>
                    <Link to={`/products/${p.slug}`} className="flex items-center gap-3 rounded-xl bg-white/8 p-2 transition hover:bg-white/15">
                      {p.image && <img src={p.image} alt="" className="h-11 w-11 rounded-lg object-cover" loading="lazy" />}
                      <span>
                        <span className="block text-[0.65rem] font-bold tracking-[0.2em] text-gold uppercase">{p.brand}</span>
                        <span className="font-display text-lg">{p.name}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <a
                href={whatsappLink(`Hello Zam Zam, my water source is ${source} with about ${tds} ppm TDS. Please suggest a suitable purifier and arrange a water test.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold mt-auto w-full"
              >
                <MessageCircle size={16} /> Book a water check on WhatsApp
              </a>
              <p className="mt-2 text-center text-[0.65rem] text-pearl/45">General guidance only. Final recommendation after an on-site test.</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
