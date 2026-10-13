import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export interface FanItem {
  key: string;
  image: string;
  alt: string;
  tag: string;
  title: string;
  text?: string;
  cta: string;
  to?: string;
  href?: string;
}

// Hand-dealt look: each card sits at its own small angle and height, overlapping its neighbour.
const tilt = [-3.2, 1.6, -1.1, 2.6];
const lift = [14, 0, -4, 8];

/** Four overlapping, slightly tilted cards that straighten and rise on hover. */
export default function FanCards({ items }: { items: FanItem[] }) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pt-6 pb-10 lg:mx-0 lg:justify-center lg:gap-0 lg:overflow-visible lg:px-0">
      {items.map((it, i) => {
        const cls =
          'block bg-white shadow-[0_30px_50px_-28px_rgba(20,24,56,0.45)] ring-1 ring-navy/5 transition-shadow duration-500 group-hover:shadow-[0_40px_70px_-25px_rgba(20,24,56,0.55)]';
        const body = (
          <>
            <div className="aspect-[4/3.1] overflow-hidden bg-aqua">
              <img src={it.image} alt={it.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
            </div>
            <div className="px-5 pt-4 pb-5">
              <p className="text-[0.62rem] font-medium tracking-[0.28em] text-gold-deep uppercase">{it.tag}</p>
              <h3 className="mt-1.5 text-[1.45rem] leading-tight font-medium">{it.title}</h3>
              {it.text && <p className="mt-1.5 line-clamp-2 text-[0.8rem] leading-relaxed text-mist">{it.text}</p>}
              <span className="mt-3 inline-flex items-center gap-2 text-[0.64rem] font-medium tracking-[0.26em] text-navy/70 uppercase transition group-hover:text-navy">
                {it.cta} <ArrowUpRight size={13} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </>
        );
        return (
          <motion.article
            key={it.key}
            className="group relative w-[78vw] shrink-0 snap-center sm:w-[300px] lg:-ml-6 lg:w-[27%] lg:first:ml-0"
            initial={{ opacity: 0, y: 80, rotate: 0 }}
            whileInView={{ opacity: 1, y: lift[i % 4], rotate: tilt[i % 4] }}
            viewport={{ once: true, margin: '-60px' }}
            whileHover={{ y: -12, rotate: 0, scale: 1.03, zIndex: 30, transition: { type: 'spring', stiffness: 260, damping: 22 } }}
            transition={{ type: 'spring', stiffness: 90, damping: 16, delay: i * 0.09 }}
            style={{ zIndex: 10 + i }}
          >
            {it.to ? (
              <Link to={it.to} className={cls}>{body}</Link>
            ) : (
              <a href={it.href} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a>
            )}
          </motion.article>
        );
      })}
    </div>
  );
}
