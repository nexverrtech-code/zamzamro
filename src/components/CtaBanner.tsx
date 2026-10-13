import { Link } from 'react-router-dom';
import { MessageCircle, Phone } from 'lucide-react';
import Reveal from './Reveal';
import RealWater from './RealWater';
import { business, telLink, whatsappLink } from '../data/business';

/** Compact call-to-action strip over real moving water. */
export default function CtaBanner({
  title = 'Pure water is one call away.',
  text = 'Purchase, installation or a quick repair — speak to the Zam Zam team in Erode today.',
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="container-royal py-8">
      <Reveal className="relative overflow-hidden rounded-[24px] bg-navy px-6 py-7 text-pearl shadow-lift sm:px-9">
        <RealWater overlay="bg-gradient-to-r from-navy-deep/85 via-navy/60 to-ocean/25" bubbles={8} />
        <div className="relative flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <img src="/images/emblem-white.png" alt="" className="hidden h-12 w-auto opacity-90 sm:block" loading="lazy" />
            <div>
              <h2 className="text-2xl font-medium !text-pearl sm:text-[1.75rem]">{title}</h2>
              <p className="mt-1 max-w-lg text-sm text-pearl/70">{text}</p>
            </div>
          </div>
          <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:flex-nowrap">
            <a href={telLink} className="btn-gold"><Phone size={15} /> {business.phoneDisplay}</a>
            <a href={whatsappLink('Hello Zam Zam, I would like to book a visit.')} target="_blank" rel="noopener noreferrer" className="btn bg-[#25D366] text-white">
              <MessageCircle size={15} /> WhatsApp
            </a>
            <Link to="/contact#enquiry" className="btn border border-pearl/30 text-pearl hover:bg-pearl/10">Book online</Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
