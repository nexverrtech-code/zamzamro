import { motion } from 'motion/react';
import { ClipboardCheck, Droplet, GlassWater, Hammer, MessageSquare, Plug, ShowerHead, Ruler, Smile, TestTube2 } from 'lucide-react';
import Seo, { breadcrumb } from '../components/Seo';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import EnquiryForm from '../components/EnquiryForm';
import FaqList from '../components/FaqList';
import { InstallFlowVisual } from '../components/HeroVisuals';
import { routeMeta } from '../data/seo';
import { faqs } from '../data/faqs';

const steps = [
  { icon: MessageSquare, title: 'You reach out', text: 'Call, WhatsApp or send the enquiry form with your area and preferred time.' },
  { icon: TestTube2, title: 'Water check', text: 'We check your water source and TDS so the recommendation fits your actual water.' },
  { icon: ClipboardCheck, title: 'Right recommendation', text: 'We explain the options — RO, copper, alkaline, softener — and what each one does for you.' },
  { icon: Hammer, title: 'Careful installation', text: 'Secure mounting, neat tubing and leak-free fittings at the inlet, outlet and drain.' },
  { icon: GlassWater, title: 'Tested & demonstrated', text: 'We test output water on site and show your family the indicators and daily care.' },
  { icon: Smile, title: 'Always reachable', text: 'Filter reminders, service visits and quick help whenever you need it.' },
];

const requirements = [
  { icon: Droplet, title: 'Water inlet line', text: 'A tap or line near the installation point.' },
  { icon: Plug, title: 'Power socket', text: 'A working 5/6 A socket within reach.' },
  { icon: ShowerHead, title: 'Drain outlet', text: 'For RO reject water — or we can suggest reuse.' },
  { icon: Ruler, title: 'Wall space', text: 'Clear wall area near the kitchen sink.' },
];

export default function Installation() {
  const meta = routeMeta.installation;

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={meta.path} jsonLd={breadcrumb([{ name: 'Home', path: '/' }, { name: 'Installation', path: '/installation' }])} />
      <PageHero
        crumb="Installation"
        eyebrow="Doorstep installation"
        title={<>RO purifier installation <em className="text-gold-shimmer">in Erode</em></>}
        intro="Purifiers, softeners and water level controllers — installed neatly, tested on site and explained to your family."
        visual={<InstallFlowVisual />}
      />

      <section className="container-royal py-8" aria-labelledby="process-title">
        <SectionHeading eyebrow="How it works" title={<span id="process-title">Six calm steps to <em className="text-gold-shimmer">pure water</em></span>} />
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              className="group relative flex gap-3.5 rounded-2xl border border-navy/8 bg-white p-4 shadow-soft"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy text-gold transition group-hover:rotate-[-6deg]">
                <s.icon size={17} />
              </span>
              <div>
                <p className="text-[0.6rem] font-medium tracking-[0.28em] text-gold-deep">STEP {String(i + 1).padStart(2, '0')}</p>
                <h3 className="text-lg leading-snug font-medium">{s.title}</h3>
                <p className="mt-0.5 text-[0.8rem] leading-relaxed text-mist">{s.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="bg-white py-8" aria-labelledby="req-title">
        <div className="container-royal">
          <SectionHeading align="center" eyebrow="Before we arrive" title={<span id="req-title">What your site needs</span>} intro="Don’t worry if something is missing — our technician will advise on the spot." />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {requirements.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.08} className="flex items-center gap-3 rounded-2xl border border-navy/8 bg-pearl p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-aqua text-navy"><r.icon size={18} strokeWidth={1.5} /></span>
                <span>
                  <h3 className="text-lg leading-tight font-medium">{r.title}</h3>
                  <p className="text-[0.78rem] text-mist">{r.text}</p>
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="enquiry" className="container-royal grid scroll-mt-28 gap-8 py-9 lg:grid-cols-[1fr_1.3fr]" aria-labelledby="book-title">
        <div>
          <SectionHeading eyebrow="Book installation" title={<span id="book-title">Request a <em className="text-gold-shimmer">visit</em></span>} intro="Choose what you need and we’ll confirm a convenient time on WhatsApp." />
          <div className="mt-6">
            <FaqList items={faqs.filter((f) => /install|need ready|controller/i.test(f.q))} />
          </div>
        </div>
        <EnquiryForm defaultService="ro-installation" />
      </section>
    </>
  );
}
