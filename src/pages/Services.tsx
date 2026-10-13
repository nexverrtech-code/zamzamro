import { Link } from 'react-router-dom';
import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import Seo, { breadcrumb } from '../components/Seo';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import ServiceIcon from '../components/ServiceIcon';
import CtaBanner from '../components/CtaBanner';
import SectionHeading from '../components/SectionHeading';
import FanCards from '../components/FanCards';
import { works } from '../data/works';
import { ServiceOrbitVisual } from '../components/HeroVisuals';
import { services } from '../data/services';
import { routeMeta } from '../data/seo';
import { SITE_URL, whatsappLink } from '../data/business';

const visuals: Record<string, string> = {
  'ro-water-purifier-sales': '/images/aqua-2090-raga-series.webp',
  'ro-installation': '/images/water-pia-purifier.webp',
  'ro-repair-service': '/images/nile-aqua-jade.webp',
  'filter-membrane-replacement': '/images/triple-stage-commercial-ro.webp',
  'maintenance-sanitisation': '/images/aqua-ultra-all-water-sources.webp',
  'commercial-ro-systems': '/images/water-level-controller-and-commercial-ro.webp',
  'water-softener': '/images/water-softener-installation.webp',
  'water-level-controller': '/images/automatic-water-level-controller-banner.webp',
};

export default function Services() {
  const meta = routeMeta.services;
  const serviceLd = services.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.title,
    description: s.description,
    serviceType: s.title,
    areaServed: { '@type': 'City', name: 'Erode' },
    provider: { '@id': `${SITE_URL}/#business` },
    url: `${SITE_URL}/services#${s.slug}`,
  }));

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={meta.path} jsonLd={[...serviceLd, breadcrumb([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])]} />
      <PageHero
        crumb="Services"
        eyebrow="Service & care"
        title={<>RO repair &amp; service <em className="text-gold-shimmer">in Erode</em></>}
        intro="Purifiers, softeners, UPS batteries and water level controllers — one team, one number, honest work. Tap an icon to jump to a service."
        visual={<ServiceOrbitVisual />}
      />

      <section className="container-royal grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 3) * 0.06}>
            <article id={s.slug} className="group card-royal flex h-full scroll-mt-28 flex-col overflow-hidden hover:shadow-lift">
              <div className="relative h-28 overflow-hidden bg-aqua">
                {visuals[s.slug] ? (
                  <img src={visuals[s.slug]} alt={`${s.title} by Zam Zam Pure Water System, Erode`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
                ) : (
                  <div className="grid h-full place-items-center bg-gradient-to-br from-navy to-navy-soft">
                    <ServiceIcon name={s.icon} size={40} className="text-gold" />
                  </div>
                )}
                <span className="absolute bottom-2.5 left-2.5 grid h-9 w-9 place-items-center rounded-lg bg-navy text-gold shadow-soft">
                  <ServiceIcon name={s.icon} size={16} />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h2 className="text-xl font-medium">{s.title}</h2>
                <p className="mt-1 text-[0.8rem] text-mist">{s.short}</p>
                <ul className="mt-3 mb-4 grid grid-cols-2 gap-x-3 gap-y-1">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-1.5 text-[0.74rem] leading-snug text-ink/80">
                      <Check size={12} className="mt-0.5 shrink-0 text-gold-deep" /> {p}
                    </li>
                  ))}
                </ul>
                <a href={whatsappLink(`Hello Zam Zam, I would like to book: ${s.title}.`)} target="_blank" rel="noopener noreferrer" className="btn-royal mt-auto !py-2.5 !text-xs">
                  <MessageCircle size={15} /> Book this service
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="relative overflow-hidden bg-gradient-to-b from-sky/70 via-pearl to-blush/70 py-10 sm:py-12" aria-labelledby="works-title">
        <div className="container-royal">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Recent work" title={<span id="works-title">Jobs we were <em className="text-gold-shimmer">trusted with</em></span>} />
            <Link to="/contact#enquiry" className="inline-flex shrink-0 items-center gap-2 text-[0.68rem] font-medium tracking-[0.28em] text-navy uppercase hover:text-gold-deep">
              Book yours <ArrowRight size={14} />
            </Link>
          </div>
          <FanCards
            items={works.map((w) => ({
              key: w.key,
              image: w.image,
              alt: `${w.tag} by Zam Zam Pure Water System, Erode`,
              tag: w.tag,
              title: w.title,
              text: w.text,
              cta: 'Enquire',
              href: whatsappLink(`Hello Zam Zam, I saw your "${w.title}" work and would like something similar.`),
            }))}
          />
        </div>
      </section>

      <CtaBanner title="Purifier acting up?" text="Low flow, strange taste, a leak or a blinking light — call us." />
    </>
  );
}
