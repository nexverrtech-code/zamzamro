import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, Phone } from 'lucide-react';
import Logo from './Logo';
import { business, fullAddress, mapsLink, telLink, whatsappLink } from '../data/business';
import { services } from '../data/services';
import { navItems } from './Navbar';

export default function Footer() {
  return (
    <footer className="relative mt-12 bg-gradient-to-b from-navy via-navy to-[#171c45] text-pearl">
      <svg aria-hidden viewBox="0 0 1440 90" preserveAspectRatio="none" className="absolute -top-[47px] left-0 h-[48px] w-full text-navy">
        <path fill="currentColor" d="M0,60 C240,10 480,10 720,45 C960,80 1200,80 1440,30 L1440,90 L0,90 Z" />
      </svg>

      <div className="container-royal grid gap-6 py-8 text-[0.82rem] sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1.5fr_1.3fr]">
        <div>
          <Logo light />
          <p className="mt-3 max-w-xs leading-relaxed text-pearl/70">
            RO water purifier sales, service and installation in Erode — plus water softeners, UPS batteries and automatic water level controllers.
          </p>
          <p className="mt-3 flex items-center gap-3 font-display text-lg text-gold italic">
            <span className="h-px w-8 bg-gold" /> Pure Forever
          </p>
        </div>

        <div>
          <h3 className="font-sans text-[0.68rem] font-medium tracking-[0.3em] !text-gold">EXPLORE</h3>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-1">
            {[...navItems, { to: '/faq', label: 'FAQs' }, { to: '/privacy', label: 'Privacy Policy' }].map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="text-pearl/75 transition hover:text-pearl">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-[0.68rem] font-medium tracking-[0.3em] !text-gold">SERVICES</h3>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to={`/services#${s.slug}`} className="text-pearl/75 transition hover:text-pearl">{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-[0.68rem] font-medium tracking-[0.3em] !text-gold">VISIT &amp; CALL</h3>
          <address className="mt-3 space-y-2.5 not-italic">
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="flex gap-3 text-pearl/80 hover:text-pearl">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold" /> {fullAddress}
            </a>
            <a href={telLink} className="flex items-center gap-3 text-pearl/80 hover:text-pearl">
              <Phone size={16} className="text-gold" /> {business.phoneDisplay}
            </a>
            <a href={whatsappLink('Hello Zam Zam, I have an enquiry.')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-pearl/80 hover:text-pearl">
              <MessageCircle size={16} className="text-gold" /> WhatsApp us
            </a>
          </address>
          {business.hours.length > 0 && (
            <ul className="mt-3 space-y-1 text-pearl/70">
              {business.hours.map((h) => <li key={h.days}>{h.days}: {h.time}</li>)}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-pearl/10">
        <div className="container-royal flex flex-col items-center justify-between gap-3 py-4 pb-24 text-[0.72rem] text-pearl/55 sm:flex-row lg:pb-4">
          <p>© {new Date().getFullYear()} {business.name}, Erode. All rights reserved.</p>
          <p>Brand names and logos belong to their respective owners.</p>
        </div>
      </div>
    </footer>
  );
}
