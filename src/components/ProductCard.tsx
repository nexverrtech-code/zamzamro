import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, BatteryCharging, MessageCircle } from 'lucide-react';
import { fullName, type Product } from '../data/products';
import { whatsappLink } from '../data/business';

export function productEnquiry(p: Product) {
  return whatsappLink(`Hello Zam Zam, I'm interested in the ${fullName(p)}${p.series ? ` (${p.series})` : ''}. Please share the price and details.`);
}

export function ProductVisual({ product, className = '' }: { product: Product; className?: string }) {
  if (!product.image) {
    return (
      <div className={`grid place-items-center bg-gradient-to-br from-navy to-navy-soft ${className}`}>
        <div className="relative">
          <span className="absolute inset-0 animate-ping rounded-full bg-gold/20" />
          <BatteryCharging size={72} strokeWidth={1.2} className="relative text-gold" />
        </div>
      </div>
    );
  }
  return (
    <img
      src={product.image}
      alt={`${fullName(product)} — available at Zam Zam Pure Water System, Erode`}
      loading="lazy"
      decoding="async"
      className={`object-cover ${className}`}
    />
  );
}

/** Product card with a gentle 3D tilt that follows the pointer. */
export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });
  const glare = useTransform([mx, my], ([x, y]) => `radial-gradient(circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(255,255,255,0.45), transparent 55%)`);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="group card-royal relative flex h-full flex-col overflow-hidden hover:shadow-lift"
      >
        <Link to={`/products/${product.slug}`} className="relative block aspect-[4/3.1] overflow-hidden bg-aqua" aria-label={`View ${product.name}`}>
          <ProductVisual product={product} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
          <motion.div className="pointer-events-none absolute inset-0" style={{ background: glare }} />
          {product.badge && (
            <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[0.58rem] font-medium tracking-[0.18em] text-gold-deep uppercase backdrop-blur">
              {product.badge}
            </span>
          )}
        </Link>

        <div className="flex flex-1 flex-col p-4" style={{ transform: 'translateZ(30px)' }}>
          <p className="text-[0.62rem] font-medium tracking-[0.26em] text-gold-deep uppercase">{product.brand}</p>
          <h3 className="mt-1 text-[1.3rem] leading-tight font-medium">
            <Link to={`/products/${product.slug}`} className="hover:text-navy-soft">{product.name}</Link>
          </h3>
          {product.series && <p className="text-[0.78rem] text-mist">{product.series}</p>}
          <p className="mt-2 line-clamp-2 text-[0.82rem] leading-relaxed text-ink/75">{product.tagline}</p>

          {product.colours && product.colours.length > 1 && (
            <div className="mt-3 flex items-center gap-1.5" aria-label="Available colours">
              {product.colours.map((c) => (
                <span key={c.name} title={c.name} className="h-3.5 w-3.5 rounded-full ring-2 ring-white shadow" style={{ background: c.hex }} />
              ))}
            </div>
          )}

          <div className="mt-auto flex items-center gap-2 pt-4">
            <a href={productEnquiry(product)} target="_blank" rel="noopener noreferrer" className="btn-royal flex-1 !py-2.5 !text-xs">
              <MessageCircle size={15} /> Enquire
            </a>
            <Link to={`/products/${product.slug}`} className="grid h-10 w-10 place-items-center rounded-full border border-navy/15 text-navy transition hover:border-gold hover:bg-gold hover:text-navy-deep" aria-label={`Details of ${product.name}`}>
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
