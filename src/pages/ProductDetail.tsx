import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Check, ChevronRight, MessageCircle, Phone, ShieldCheck, Truck, Wrench } from 'lucide-react';
import Seo, { breadcrumb } from '../components/Seo';
import ProductCard, { ProductVisual, productEnquiry } from '../components/ProductCard';
import CtaBanner from '../components/CtaBanner';
import NotFound from './NotFound';
import { fullName, getProduct, products, seoName } from '../data/products';
import { business, SITE_URL, telLink } from '../data/business';

export default function ProductDetail() {
  const { slug = '' } = useParams();
  return <ProductView key={slug} slug={slug} />;
}

function ProductView({ slug }: { slug: string }) {
  const product = getProduct(slug);
  const [shot, setShot] = useState(0);
  const [colour, setColour] = useState(0);

  if (!product) return <NotFound />;

  const gallery = product.gallery.length ? product.gallery : product.image ? [product.image] : [];
  const related = products.filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, 3);
  const title = `${seoName(product)} in Erode | Zam Zam Pure Water System`;
  const description = `${product.tagline} ${product.summary}`.slice(0, 158);

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: fullName(product),
    brand: { '@type': 'Brand', name: product.brand },
    description: product.summary,
    image: gallery.map((g) => `${SITE_URL}${g}`),
    category: product.category === 'domestic' ? 'Water purifier' : product.name,
    url: `${SITE_URL}/products/${product.slug}`,
  };

  return (
    <>
      <Seo
        title={title}
        description={description}
        path={`/products/${product.slug}`}
        image={gallery[0]}
        jsonLd={[productLd, breadcrumb([{ name: 'Home', path: '/' }, { name: 'Products', path: '/products' }, { name: product.name, path: `/products/${product.slug}` }])]}
      />

      <section className="water-bg pt-24 pb-10 sm:pt-28">
        <div className="container-royal">
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-[0.72rem] font-medium text-mist">
            <Link to="/" className="hover:text-navy">Home</Link>
            <ChevronRight size={14} />
            <Link to="/products" className="hover:text-navy">Products</Link>
            <ChevronRight size={14} />
            <span className="text-navy">{product.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Gallery */}
            <div>
              <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-[24px] bg-white shadow-lift">
                <AnimatePresence mode="wait">
                  {gallery.length ? (
                    <motion.img
                      key={gallery[shot]}
                      src={gallery[shot]}
                      alt={`${fullName(product)} water purifier — Zam Zam, Erode`}
                      className="h-full w-full object-contain"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  ) : (
                    <ProductVisual product={product} className="h-full w-full" />
                  )}
                </AnimatePresence>
                {product.badge && (
                  <span className="absolute top-5 left-5 rounded-full bg-navy px-3.5 py-1.5 text-[0.65rem] font-bold tracking-[0.18em] text-gold uppercase">{product.badge}</span>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="mx-auto mt-3 grid max-w-md grid-cols-6 gap-2">
                  {gallery.map((g, i) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setShot(i)}
                      className={`aspect-square w-full overflow-hidden rounded-xl border-2 bg-white transition ${i === shot ? 'border-gold' : 'border-transparent opacity-70 hover:opacity-100'}`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img src={g} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <p className="eyebrow">{product.brand}</p>
              <h1 className="mt-2 text-[2.3rem] leading-[1.05] font-medium sm:text-5xl">{product.name}</h1>
              {product.series && <p className="mt-2 font-display text-2xl text-gold-deep italic">{product.series}</p>}
              <p className="mt-3 text-[0.92rem] leading-relaxed text-ink/80">{product.summary}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {product.technology.map((t) => (
                  <span key={t} className="rounded-full border border-navy/10 bg-white px-3 py-1.5 text-[0.72rem] text-navy">{t}</span>
                ))}
              </div>

              {product.colours && (
                <div className="mt-5">
                  <p className="text-[0.82rem] font-medium text-navy">
                    Colour: <span className="font-normal text-mist">{product.colours[colour].name}</span>
                  </p>
                  <div className="mt-2 flex gap-2.5">
                    {product.colours.map((c, i) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setColour(i)}
                        aria-label={c.name}
                        aria-pressed={i === colour}
                        className={`h-8 w-8 rounded-full shadow-soft ring-offset-2 ring-offset-pearl transition ${i === colour ? 'ring-2 ring-gold' : 'hover:scale-110'}`}
                        style={{ background: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <a
                  href={productEnquiry({ ...product, series: product.colours ? `${product.series ?? ''} ${product.colours[colour].name}`.trim() : product.series })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn flex-1 bg-[#25D366] text-white"
                >
                  <MessageCircle size={17} /> Get price on WhatsApp
                </a>
                <a href={telLink} className="btn-royal flex-1"><Phone size={16} /> Call {business.phoneDisplay}</a>
              </div>

              <ul className="mt-5 grid gap-2 border-t border-navy/10 pt-5 text-[0.8rem] text-navy sm:grid-cols-3">
                <li className="flex items-center gap-2"><Truck size={18} className="text-gold-deep" /> Delivery in Erode</li>
                <li className="flex items-center gap-2"><Wrench size={18} className="text-gold-deep" /> Expert installation</li>
                <li className="flex items-center gap-2"><ShieldCheck size={18} className="text-gold-deep" /> Local after-sales</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container-royal grid gap-6 py-9 md:grid-cols-2">
        <div className="card-royal p-5">
          <h2 className="text-2xl font-medium">Highlights</h2>
          <ul className="mt-3 space-y-2 text-[0.88rem]">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-ink/80">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/20 text-gold-deep"><Check size={13} strokeWidth={3} /></span>
                {h}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-royal p-5">
          <h2 className="text-2xl font-medium">Ideal for</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {product.idealFor.map((h) => (
              <li key={h} className="rounded-full bg-aqua px-4 py-2 text-sm font-medium text-navy">{h}</li>
            ))}
          </ul>
          <p className="mt-4 text-[0.82rem] leading-relaxed text-mist">
            Detailed specifications, current price and offers vary by model and stock. Message us and we’ll share the latest details — and help you check if it suits your water.
          </p>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-royal pb-10">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-medium">You may also like</h2>
            <Link to="/products" className="hidden items-center gap-2 text-sm font-semibold text-navy sm:flex"><ArrowLeft size={16} /> All products</Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
          </div>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
