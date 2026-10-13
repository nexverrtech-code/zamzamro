import { Droplets, Eye, HandHeart, Sparkles } from 'lucide-react';
import Seo, { breadcrumb } from '../components/Seo';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import CtaBanner from '../components/CtaBanner';
import RealWater from '../components/RealWater';
import { PureWaveVisual } from '../components/HeroVisuals';
import { routeMeta } from '../data/seo';

const pillars = [
  { icon: Droplets, title: 'Purity', text: 'We only offer products we would install in our own homes, from brands with a track record.' },
  { icon: Eye, title: 'Transparency', text: 'Clear explanations, no jargon and no unnecessary parts — you always know what you are paying for.' },
  { icon: HandHeart, title: 'Care', text: 'Every home is treated with respect: shoe covers, tidy work and a clean kitchen when we leave.' },
  { icon: Sparkles, title: 'Craft', text: 'Neat tubing, sturdy mounting and a final water test. The details are the job.' },
];

const offer = [
  'RO water purifiers for homes',
  'Stainless-steel systems for workplaces',
  'Triple-stage commercial RO',
  'Whole-house water softeners',
  'Automatic water level controllers',
  'UPS batteries',
];

export default function About() {
  const meta = routeMeta.about;
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={meta.path} jsonLd={breadcrumb([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])} />
      <PageHero
        crumb="About"
        eyebrow="Our story"
        title={<>A name that means <em className="text-gold-shimmer">pure water</em></>}
        intro="Zam Zam is a name long associated with pure, life-giving water. We chose it as a promise — and work every day to deserve it."
        visual={<PureWaveVisual />}
      />

      <section className="container-royal grid items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="relative">
          <div className="relative overflow-hidden rounded-[24px] bg-white p-7 shadow-lift">
            <img src="/images/zamzam-logo.webp" alt="Zam Zam Pure Water System logo — Pure Forever" className="mx-auto w-full max-w-xs" loading="lazy" />
          </div>
          <div className="absolute -bottom-5 -left-3 hidden rounded-2xl bg-navy px-5 py-3 text-pearl shadow-lift sm:block">
            <p className="text-[0.6rem] font-medium tracking-[0.28em] text-gold">POONDURAI ROAD</p>
            <p className="font-display text-lg">Erode, Tamil Nadu</p>
          </div>
        </Reveal>
        <div>
          <SectionHeading eyebrow="Who we are" title="Rooted in Erode, devoted to every drop" />
          <div className="mt-3 space-y-2.5 text-[0.9rem] leading-relaxed text-mist">
            <p>
              Zam Zam Pure Water System is a water purification specialist on Poondurai Road, Erode. We help families, shops, offices and institutions get safe, great-tasting water — and keep it that way.
            </p>
            <p>
              Erode’s water varies from street to street: hard borewell supply in one home, tanker or corporation water in the next. That is why we start with your water, not a catalogue, and recommend only what genuinely fits.
            </p>
                      </div>
          <ul className="mt-5 grid gap-1.5 sm:grid-cols-2">
            {offer.map((o) => (
              <li key={o} className="flex items-center gap-2 text-[0.82rem] text-navy">
                <span className="h-1.5 w-1.5 rotate-45 bg-gold" /> {o}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy py-10 text-pearl" aria-labelledby="values-title">
        <RealWater overlay="bg-navy/85" bubbles={10} />
        <div className="container-royal relative">
          <SectionHeading light align="center" eyebrow="What we stand for" title={<span id="values-title">Four promises behind <em className="text-gold-shimmer">Pure Forever</em></span>} />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08} className="rounded-2xl border border-white/12 bg-white/[0.06] p-5 backdrop-blur">
                <p.icon size={22} strokeWidth={1.3} className="text-gold" />
                <h3 className="mt-3 text-2xl font-medium !text-pearl">{p.title}</h3>
                <p className="mt-1 text-[0.82rem] leading-relaxed text-pearl/70">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
