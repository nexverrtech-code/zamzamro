import { Clock, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import Seo, { breadcrumb } from '../components/Seo';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import EnquiryForm from '../components/EnquiryForm';
import { RadarMapVisual } from '../components/HeroVisuals';
import { routeMeta } from '../data/seo';
import { business, fullAddress, mapsEmbed, mapsLink, telLink, whatsappLink } from '../data/business';

export default function Contact() {
  const meta = routeMeta.contact;
  const cards = [
    { icon: Phone, label: 'Call us', value: business.phoneDisplay, href: telLink, cta: 'Tap to call' },
    { icon: MessageCircle, label: 'WhatsApp', value: business.phoneDisplay, href: whatsappLink('Hello Zam Zam, I have an enquiry.'), cta: 'Start chat', external: true },
    { icon: MapPin, label: 'Visit the store', value: 'Near N.R. Mahal, Poondurai Road', href: mapsLink, cta: 'Get directions', external: true },
  ];

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={meta.path} jsonLd={breadcrumb([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])} />
      <PageHero
        crumb="Contact"
        eyebrow="Say hello"
        title={<>Let’s talk <em className="text-gold-shimmer">pure water</em></>}
        intro="Sales enquiry, installation booking or a service call — reach the Zam Zam team in Erode the way that suits you."
        visual={<RadarMapVisual />}
      />

      <section className="container-royal grid gap-3 pt-6 md:grid-cols-3">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.08}>
            <a
              href={c.href}
              {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group card-royal flex h-full items-center gap-4 p-4 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy text-gold transition group-hover:scale-110"><c.icon size={19} /></span>
              <span className="min-w-0">
                <span className="block text-[0.6rem] font-medium tracking-[0.26em] text-gold-deep uppercase">{c.label}</span>
                <span className="block truncate font-display text-lg font-medium text-navy">{c.value}</span>
                <span className="block text-[0.72rem] text-ocean">{c.cta} →</span>
              </span>
            </a>
          </Reveal>
        ))}
      </section>

      <section id="enquiry" className="container-royal grid scroll-mt-28 gap-6 py-8 lg:grid-cols-[1fr_1.25fr]" aria-labelledby="enquiry-title">
        <div>
          <SectionHeading
            eyebrow="Enquiry"
            title={<span id="enquiry-title">Send us an <em className="text-gold-shimmer">enquiry</em></span>}
            intro="Fill in your details and we’ll get back to you to confirm a visit."
          />
          <address className="mt-5 space-y-3 text-[0.88rem] not-italic">
            <p className="flex gap-4 text-ink/80">
              <MapPin className="mt-1 shrink-0 text-gold-deep" size={17} />
              <span><strong className="block text-navy">{business.name}</strong>{fullAddress}</span>
            </p>
            <p className="flex gap-4 text-ink/80">
              <Phone className="mt-1 shrink-0 text-gold-deep" size={17} />
              <a href={telLink} className="font-semibold text-navy">{business.phoneDisplay}</a>
            </p>
            {business.hours.length > 0 && (
              <div className="flex gap-4 text-ink/80">
                <Clock className="mt-1 shrink-0 text-gold-deep" size={17} />
                <ul>{business.hours.map((h) => <li key={h.days}>{h.days}: {h.time}</li>)}</ul>
              </div>
            )}
          </address>
          <div className="relative mt-5 overflow-hidden rounded-[20px] shadow-soft">
            <iframe
              title="Zam Zam Pure Water System location on Google Maps"
              src={mapsEmbed}
              className="h-56 w-full border-0 grayscale-[30%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="btn-royal absolute bottom-3 left-3 !px-4 !py-2 !text-xs">
              <Navigation size={14} /> Open in Maps
            </a>
          </div>
        </div>
        <EnquiryForm />
      </section>

    </>
  );
}
