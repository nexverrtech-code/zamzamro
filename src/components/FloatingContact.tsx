import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CalendarCheck, MessageCircle, Phone } from 'lucide-react';
import { telLink, whatsappLink } from '../data/business';

const waHello = whatsappLink('Hello Zam Zam Pure Water System, I would like to know more about your RO purifiers and services.');

export default function FloatingContact() {
  return (
    <>
      {/* Desktop: floating buttons */}
      <div className="fixed right-5 bottom-6 z-40 hidden flex-col gap-3 lg:flex">
        <motion.a
          href={waHello}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="group relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lift"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" />
          <MessageCircle size={24} className="relative" />
          <span className="pointer-events-none absolute right-16 rounded-full bg-navy px-3 py-1.5 text-xs whitespace-nowrap text-pearl opacity-0 transition group-hover:opacity-100">
            Chat on WhatsApp
          </span>
        </motion.a>
        <motion.a
          href={telLink}
          aria-label="Call Zam Zam"
          className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-navy-soft to-navy text-pearl shadow-lift ring-4 ring-white/60"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <Phone size={22} />
        </motion.a>
      </div>

      {/* Mobile: bottom action bar */}
      <nav aria-label="Quick contact" className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-3 gap-1 rounded-full glass p-1.5 shadow-lift lg:hidden">
        <a href={telLink} className="flex flex-col items-center gap-0.5 rounded-full py-2 text-[0.68rem] font-semibold text-navy">
          <Phone size={18} /> Call
        </a>
        <a href={waHello} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 rounded-full bg-[#25D366] py-2 text-[0.68rem] font-semibold text-white">
          <MessageCircle size={18} /> WhatsApp
        </a>
        <Link to="/contact#enquiry" className="flex flex-col items-center gap-0.5 rounded-full bg-navy py-2 text-[0.68rem] font-semibold text-pearl">
          <CalendarCheck size={18} /> Book
        </Link>
      </nav>
    </>
  );
}
