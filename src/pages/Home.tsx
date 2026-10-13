import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react';
import { ArrowRight, BadgeCheck, BatteryCharging, Check, Droplets, HeartHandshake, MapPin, MessageCircle, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import Seo from '../components/Seo';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';
import PurificationJourney from '../components/PurificationJourney';
import WaterSourceMatcher from '../components/WaterSourceMatcher';
import Reviews from '../components/Reviews';
import FaqList from '../components/FaqList';
import CtaBanner from '../components/CtaBanner';
import FanCards, { type FanItem } from '../components/FanCards';
import { heroState, ragaShades } from '../components/heroState';
import { getProduct, fullName } from '../data/products';
import { faqs } from '../data/faqs';
import { routeMeta } from '../data/seo';
import { business, whatsappLink } from '../data/business';

const HeroPurifier = lazy(() => import('../components/HeroPurifier'));
const purifyStages = [
  { name: 'Sediment', text: 'Sand, rust & silt', color: '#e8d6aa', at: 0.06 },
  { name: 'Activated carbon', text: 'Chlorine & odour', color: '#9fb3c8', at: 0.11 },
  { name: 'RO membrane', text: 'Dissolved salts & high TDS', color: '#7fd0ee', at: 0.16 },
  { name: 'Copper · Zinc · Alkaline', text: 'Balanced, fresh taste', color: '#f0b27a', at: 0.21 },
];

/** Live colour picker for the 3D Aqua 2090 Raga. */
function ShadePicker() {
  const [active, setActive] = useState(() => Math.max(0, ragaShades.findIndex((s) => s.hex === heroState.colour)));
  return (
    <div className="glass pointer-events-auto flex items-center gap-3 rounded-full py-2 pr-2 pl-4 shadow-soft">
      <Link to="/products/aqua-2090-raga-series" className="hidden text-left leading-tight sm:block">
        <span className="block text-[0.6rem] font-bold tracking-[0.2em] text-gold-deep uppercase">Aqua 2090 Raga</span>
        <span className="block text-xs font-semibold text-navy">{ragaShades[active].name}</span>
      </Link>
      <div className="flex gap-1.5" role="radiogroup" aria-label="Purifier colour">
        {ragaShades.map((s, i) => (
          <button
            key={s.hex}
            type="button"
            role="radio"
            aria-checked={i === active}
            aria-label={s.name}
            onClick={() => {
              heroState.colour = s.hex;
              setActive(i);
            }}
            className={`h-7 w-7 rounded-full shadow-[inset_0_-3px_6px_rgba(0,0,0,0.15),inset_0_2px_3px_rgba(255,255,255,0.6)] transition ${i === active ? 'scale-110 ring-2 ring-navy ring-offset-2 ring-offset-white/60' : 'hover:scale-110'}`}
            style={{ background: s.hex }}
          />
        ))}
      </div>
    </div>
  );
}

/** Panel that fades in and out over a slice of the hero's scroll progress. */
function Stage({ progress, at, children }: { progress: MotionValue<number>; at: [number, number, number, number]; children: ReactNode }) {
  const opacity = useTransform(progress, at, at[0] === 0 ? [1, 1, 1, 0] : [0, 1, 1, at[3] >= 1 ? 1 : 0]);
  const y = useTransform(progress, at, [at[0] === 0 ? 0 : 24, 0, 0, at[3] >= 1 ? 0 : -24]);
  const pointerEvents = useTransform(opacity, (v) => (v > 0.5 ? 'auto' : 'none'));
  return (
    <motion.div style={{ opacity, y, pointerEvents }} className="glass absolute inset-x-0 bottom-0 rounded-[22px] p-5 shadow-soft lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2 lg:p-7">
      {children}
    </motion.div>
  );
}

/**
 * Hero: a photoreal 3D RO purifier. Scrolling turns the machine, lights each filter stage,
 * lifts the chrome tap and pours pure water into a glass.
 */
function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    heroState.progress = v;
    setP(v);
  });
  useEffect(() => {
    heroState.progress = 0;
  }, []);
  const rail = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section ref={ref} className="relative h-[340vh]" aria-labelledby="hero-title">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#1f7aa3]">
        <Suspense fallback={<div className="absolute inset-0 water-bg" />}>
          <HeroPurifier />
        </Suspense>

        <div className="pointer-events-none relative container-royal h-full">
          <div className="absolute inset-x-4 bottom-[5.5rem] min-h-[200px] sm:inset-x-6 lg:inset-x-8 lg:top-0 lg:bottom-0 lg:w-[40%]">
            <Stage progress={scrollYProgress} at={[0, 0.14, 0.17, 0.21]}>
              <motion.p className="eyebrow" {...fade(0.1)}>Erode’s royal standard in pure water</motion.p>
              <h1 id="hero-title" className="mt-3">
                <motion.span className="block text-[2.4rem] leading-[1] font-medium sm:text-5xl lg:text-[3.6rem]" {...fade(0.2)}>
                  Every drop, <em className="text-gold-shimmer block font-medium">pure forever.</em>
                </motion.span>
                <motion.span className="mt-2.5 block font-sans text-[0.95rem] font-normal text-navy/75" {...fade(0.35)}>
                  RO Water Purifier Sales, Service &amp; Installation in Erode
                </motion.span>
              </h1>
              <motion.div className="mt-4 flex flex-col gap-2 sm:flex-row" {...fade(0.5)}>
                <Link to="/products" className="btn-royal">Explore purifiers <ArrowRight size={16} /></Link>
                <Link to="/contact#enquiry" className="btn-ghost"><Wrench size={16} /> Book a service</Link>
              </motion.div>
            </Stage>

            <Stage progress={scrollYProgress} at={[0.18, 0.22, 0.36, 0.41]}>
              <p className="eyebrow">Inside the machine</p>
              <h2 className="mt-2.5 text-[1.8rem] leading-tight font-medium sm:text-[2.4rem]">Four stages of <em className="text-gold-shimmer">purity</em></h2>
              <ol className="mt-4 space-y-1.5">
                {purifyStages.map((st, i) => {
                  const lit = p >= st.at;
                  return (
                    <li key={st.name} className={`flex items-center gap-3 rounded-2xl px-3 py-1.5 transition-all duration-500 ${lit ? 'bg-white/80 shadow-soft' : 'opacity-40'}`}>
                      <span className="h-3 w-3 rounded-full transition" style={{ background: st.color, boxShadow: lit ? `0 0 12px ${st.color}` : 'none' }} />
                      <span className="text-[0.7rem] font-medium tracking-[0.2em] text-navy">{String(i + 1).padStart(2, '0')} · {st.name.toUpperCase()}</span>
                      <span className="ml-auto hidden text-xs text-mist sm:block">{st.text}</span>
                    </li>
                  );
                })}
              </ol>
            </Stage>

            <Stage progress={scrollYProgress} at={[0.38, 0.44, 0.78, 0.84]}>
              <p className="eyebrow">Turn the tap</p>
              <h2 className="mt-2.5 text-[1.8rem] leading-tight font-medium sm:text-[2.4rem]">Clear, cool, <em className="text-gold-shimmer">pure water</em> — every glass.</h2>
              <p className="mt-3 max-w-md text-mist">Purifiers from Nile, Clean Water, LX One, Aqua 2090 and Water Pia — chosen for your water source, installed at your door.</p>
              <ul className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-navy">
                {['Copper · Zinc · Alkaline', 'Up to 2000 ppm TDS', 'Doorstep installation'].map((t) => (
                  <li key={t} className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5"><Check size={12} className="text-gold-deep" /> {t}</li>
                ))}
              </ul>
            </Stage>

            <Stage progress={scrollYProgress} at={[0.82, 0.9, 0.98, 1]}>
              <p className="eyebrow">Pure forever</p>
              <h2 className="mt-2.5 text-[1.8rem] leading-tight font-medium sm:text-[2.4rem]">Ready for your home in <em className="text-gold-shimmer">Erode</em>.</h2>
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <Link to="/installation" className="btn-royal">Book installation <ArrowRight size={16} /></Link>
                <a href={whatsappLink('Hello Zam Zam, I would like to know more about your RO purifiers.')} target="_blank" rel="noopener noreferrer" className="btn bg-[#25D366] text-white">
                  <MessageCircle size={16} /> WhatsApp us
                </a>
              </div>
            </Stage>
          </div>
        </div>

        <div className="absolute top-24 right-4 z-10 sm:top-28 lg:top-auto lg:right-14 lg:bottom-8">
          <ShadePicker />
        </div>

        {/* Progress rail */}
        <div aria-hidden className="absolute top-1/2 right-5 hidden h-48 w-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-navy/10 lg:block">
          <motion.div className="w-full rounded-full bg-gradient-to-b from-gold via-ocean to-navy" style={{ height: rail }} />
        </div>
        <motion.div
          aria-hidden
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] font-semibold tracking-[0.3em] text-navy/55 lg:flex"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.06], [1, 0]) }}
        >
          SCROLL TO POUR
          <motion.span className="h-10 w-px bg-gradient-to-b from-navy/50 to-transparent" animate={{ scaleY: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
        </motion.div>
      </div>
    </section>
  );
}

/** "The collection" — four hand-dealt cards, in the style of an editorial portfolio. */
function Collection() {
  const picks = ['aqua-2090-raga-series', 'lx-one-titanium-gun-metal', 'water-pia', 'nile-aqua-jade'].map((s) => getProduct(s)!);
  const items: FanItem[] = picks.map((p) => ({
    key: p.slug,
    image: p.image,
    alt: `${fullName(p)} water purifier — Zam Zam, Erode`,
    tag: p.series ?? p.brand,
    title: fullName(p),
    cta: 'View purifier',
    to: `/products/${p.slug}`,
  }));
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky/70 via-pearl to-blush/70 py-12 sm:py-14" aria-labelledby="collection-title">
      <div className="container-royal">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="The collection" title={<span id="collection-title">Purifiers our customers <em className="text-gold-shimmer">love</em></span>} />
          <Link to="/products" className="inline-flex shrink-0 items-center gap-2 text-[0.68rem] font-medium tracking-[0.28em] text-navy uppercase hover:text-gold-deep">
            View all products <ArrowRight size={14} />
          </Link>
        </div>
        <FanCards items={items} />
      </div>
    </section>
  );
}

const pillars = [
  { no: '01', title: 'Sales', icon: Droplets, text: 'Purifiers matched to your water, family and kitchen.', to: '/products' },
  { no: '02', title: 'Installation', icon: BadgeCheck, text: 'Leak-free fitting, on-site water test and a family demo.', to: '/installation' },
  { no: '03', title: 'Service', icon: Wrench, text: 'Repairs, filters and sanitisation for most RO brands.', to: '/services' },
];

const beyond = [
  { slug: 'automatic-water-level-controller', tag: 'Smart home', icon: Droplets, contain: true },
  { slug: 'water-softener-system', tag: 'Whole house', icon: Droplets, contain: false },
  { slug: 'zamzam-hot-normal-ss-system', tag: 'Workplaces', icon: Droplets, contain: true },
  { slug: 'ups-battery', tag: 'Power backup', icon: BatteryCharging, contain: false },
];

const values = [
  { icon: ShieldCheck, title: 'Honest advice', text: 'What your water needs — not the costliest box.' },
  { icon: HeartHandshake, title: 'Local & reachable', text: 'A real shop on Poondurai Road, a phone that’s answered.' },
  { icon: Sparkles, title: 'Craft in every fitting', text: 'Neat lines, secure mounting, tested output.' },
  { icon: BadgeCheck, title: 'Genuine parts', text: 'Quality filters, membranes and spares.' },
];

export default function Home({ ready }: { ready: boolean }) {
  const meta = routeMeta.home;

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={meta.path} />
      <Hero ready={ready} />
      <Collection />

      {/* Pillars */}
      <section className="py-10 sm:py-12" aria-labelledby="pillars-title">
        <div className="container-royal">
          <SectionHeading eyebrow="Sales · Service · Installation" title={<span id="pillars-title">One trusted name for <em className="text-gold-shimmer">every drop</em></span>} />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.no} delay={i * 0.08}>
                <Link to={p.to} className="group card-royal relative flex h-full items-center gap-4 overflow-hidden p-4 hover:-translate-y-1 hover:shadow-lift">
                  <span className="absolute -top-3 right-2 font-display text-6xl leading-none text-aqua">{p.no}</span>
                  <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy text-gold transition group-hover:rotate-[-6deg]">
                    <p.icon size={19} strokeWidth={1.5} />
                  </span>
                  <span className="relative">
                    <span className="block font-display text-xl font-medium text-navy">{p.title}</span>
                    <span className="block text-[0.82rem] text-mist">{p.text}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PurificationJourney />
      <WaterSourceMatcher />

      {/* Beyond purifiers — four compact cards */}
      <section className="py-10 sm:py-12" aria-labelledby="beyond-title">
        <div className="container-royal">
          <SectionHeading eyebrow="Beyond purifiers" title={<span id="beyond-title">Smart water, <em className="text-gold-shimmer">all around the home</em></span>} />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {beyond.map((b, i) => {
              const p = getProduct(b.slug)!;
              return (
                <Reveal key={b.slug} delay={i * 0.06}>
                  <Link to={`/products/${p.slug}`} className="group card-royal flex h-full flex-col overflow-hidden hover:-translate-y-1 hover:shadow-lift">
                    <div className="relative h-40 overflow-hidden bg-white">
                      {p.image ? (
                        <img src={p.image} alt={`${p.name} by Zam Zam, Erode`} className={`h-full w-full ${b.contain ? 'object-contain p-3' : 'object-cover'} transition duration-700 group-hover:scale-105`} loading="lazy" />
                      ) : (
                        <div className="grid h-full place-items-center bg-gradient-to-br from-navy to-navy-soft text-gold"><b.icon size={46} strokeWidth={1.2} /></div>
                      )}
                      <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.58rem] font-medium tracking-[0.2em] text-gold-deep uppercase backdrop-blur">{b.tag}</span>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="text-lg leading-snug font-medium">{p.name}</h3>
                      <ul className="mt-2 space-y-1 text-[0.78rem] text-mist">
                        {p.highlights.slice(0, 3).map((h) => (
                          <li key={h} className="flex items-center gap-1.5"><Check size={12} className="shrink-0 text-gold-deep" /> {h}</li>
                        ))}
                      </ul>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[0.62rem] font-medium tracking-[0.24em] text-navy uppercase">Explore <ArrowRight size={12} /></span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Zam Zam */}
      <section className="bg-white py-10 sm:py-12" aria-labelledby="why-title">
        <div className="container-royal">
          <SectionHeading align="center" eyebrow="Why Zam Zam" title={<span id="why-title">Named after purity. <em className="text-gold-shimmer">Run with sincerity.</em></span>} />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06} className="rounded-2xl border border-navy/8 bg-pearl p-4">
                <v.icon size={22} strokeWidth={1.5} className="text-gold-deep" />
                <h3 className="mt-2 text-lg font-medium">{v.title}</h3>
                <p className="mt-0.5 text-[0.82rem] text-mist">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Reviews />

      {/* FAQ + service areas */}
      <section className="py-10" aria-labelledby="faq-title">
        <div className="container-royal grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <SectionHeading eyebrow="Good to know" title={<span id="faq-title">Questions from <em className="text-gold-shimmer">Erode homes</em></span>} />
            <Reveal className="mt-5 rounded-2xl bg-aqua p-5">
              <p className="flex items-center gap-2 font-semibold text-navy"><MapPin size={18} className="text-gold-deep" /> Areas we serve</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {business.serviceAreas.map((a) => (
                  <li key={a} className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-navy">{a}</li>
                ))}
              </ul>
            </Reveal>
            <Link to="/faq" className="btn-ghost mt-5">All FAQs <ArrowRight size={16} /></Link>
          </div>
          <FaqList items={faqs.slice(0, 5)} />
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
