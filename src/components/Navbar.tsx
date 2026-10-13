import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, Phone, X } from 'lucide-react';
import Logo from './Logo';
import { business, telLink } from '../data/business';
import { lockScroll } from '../lib/smoothScroll';

export const navItems = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/services', label: 'Services' },
  { to: '/installation', label: 'Installation' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let last = window.scrollY;
    // Tuck the bar away while reading downwards; glide it back the moment you scroll up.
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 240);
        last = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-5 ${
        hidden && !open ? '-translate-y-[130%]' : 'translate-y-0'
      }`}
    >
      <nav
        aria-label="Main"
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 transition-all duration-500 sm:px-6 ${
          scrolled ? 'glass py-2 shadow-soft' : 'glass py-3 shadow-soft'
        }`}
      >
        <Logo compact={scrolled} />

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${isActive ? 'text-navy' : 'text-navy/65 hover:text-navy'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-aqua" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                    )}
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href={telLink} className="hidden items-center gap-2 text-sm font-semibold text-navy xl:flex">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-aqua"><Phone size={15} /></span>
            {business.phoneDisplay}
          </a>
          <Link to="/contact#enquiry" className="btn-royal hidden !px-5 !py-2.5 sm:inline-flex">
            Book Service
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-11 w-11 place-items-center rounded-full bg-navy text-pearl lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            data-lenis-prevent
            className="fixed inset-0 -z-10 flex flex-col bg-navy px-6 pt-28 pb-10 text-pearl lg:hidden"
            initial={{ clipPath: 'circle(0% at 92% 6%)' }}
            animate={{ clipPath: 'circle(150% at 92% 6%)' }}
            exit={{ clipPath: 'circle(0% at 92% 6%)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="space-y-1">
              {navItems.map((item, i) => (
                <motion.li key={item.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) => `block py-2 font-display text-4xl ${isActive ? 'text-gold' : 'text-pearl'}`}
                  >
                    {item.label}
                  </NavLink>
                </motion.li>
              ))}
              <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <NavLink to="/faq" className="block py-2 font-display text-4xl text-pearl">FAQs</NavLink>
              </motion.li>
            </ul>
            <div className="mt-auto space-y-3">
              <a href={telLink} className="btn-gold w-full"><Phone size={16} /> Call {business.phoneDisplay}</a>
              <Link to="/contact#enquiry" className="btn w-full border border-pearl/30 text-pearl">Book a Service</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
