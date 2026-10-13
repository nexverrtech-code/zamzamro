import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import RealWater from './RealWater';

/** Compact inner-page hero: copy on the left, a page-specific interactive visual on the right. */
export default function PageHero({
  eyebrow,
  title,
  intro,
  crumb,
  visual,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  crumb: string;
  visual?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-pearl pt-[5.5rem] pb-6 sm:pt-28 sm:pb-8">
      <RealWater variant="surface" overlay="bg-gradient-to-r from-pearl via-pearl/85 to-white/10 max-lg:via-pearl/90 max-lg:to-pearl/70" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-pearl" />
      <div className={`container-royal relative grid items-center gap-5 ${visual ? 'lg:grid-cols-[1.1fr_1fr]' : ''}`}>
        <div>
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-[0.72rem] font-medium text-mist">
            <Link to="/" className="hover:text-navy">Home</Link>
            <ChevronRight size={14} />
            <span className="text-navy">{crumb}</span>
          </nav>
          <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            {eyebrow}
          </motion.p>
          <motion.h1
            className="mt-2.5 max-w-2xl text-[2.1rem] leading-[1.05] font-medium sm:text-[2.6rem] lg:text-[3.2rem]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="mt-3 max-w-lg text-[0.95rem] leading-relaxed text-mist"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {intro}
          </motion.p>
          {children}
        </div>
        {visual && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {visual}
          </motion.div>
        )}
      </div>
    </section>
  );
}
