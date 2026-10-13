import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Search, X } from 'lucide-react';
import Seo, { breadcrumb } from '../components/Seo';
import PageHero from '../components/PageHero';
import ProductCard from '../components/ProductCard';
import CtaBanner from '../components/CtaBanner';
import { ProductDeckVisual } from '../components/HeroVisuals';
import { brands, categories, fullName, products, type Category } from '../data/products';
import { routeMeta } from '../data/seo';
import { SITE_URL } from '../data/business';

export default function Products() {
  const [params, setParams] = useSearchParams();
  const cat = (params.get('category') as Category | null) ?? 'all';
  const brand = params.get('brand') ?? 'all';
  const [query, setQuery] = useState('');

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value === 'all') next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (cat === 'all' || p.category === cat) &&
        (brand === 'all' || p.brand === brand) &&
        (!q || `${p.brand} ${p.name} ${p.series ?? ''} ${p.technology.join(' ')} ${p.tagline}`.toLowerCase().includes(q)),
    );
  }, [cat, brand, query]);

  const meta = routeMeta.products;
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Water purifiers and water solutions at Zam Zam Pure Water System, Erode',
    itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/products/${p.slug}`, name: fullName(p) })),
  };

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={meta.path} jsonLd={[itemList, breadcrumb([{ name: 'Home', path: '/' }, { name: 'Products', path: '/products' }])]} />
      <PageHero
        crumb="Products"
        eyebrow="The Zam Zam collection"
        title={<>RO water purifiers <em className="text-gold-shimmer">in Erode</em></>}
        intro="Copper, zinc & alkaline purifiers, stainless-steel systems, softeners, controllers and UPS batteries — all installed and serviced by us. Tap the deck to shuffle."
        visual={<ProductDeckVisual />}
      />

      <section className="container-royal grid gap-6 pt-6 pb-4 lg:grid-cols-[232px_1fr]">
        {/* Filters — every option visible at a glance, with counts */}
        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Product filters">
          <div className="card-royal p-4">
            <label className="relative block">
              <span className="sr-only">Search products</span>
              <Search size={15} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-mist" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search copper, alkaline…"
                className="w-full rounded-full border border-navy/10 bg-pearl py-2 pr-8 pl-9 text-[0.82rem] outline-none focus:border-gold focus:bg-white"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="absolute top-1/2 right-3 -translate-y-1/2 text-mist" aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
            </label>

            <p className="mt-4 text-[0.62rem] font-medium tracking-[0.28em] text-gold-deep uppercase">Category</p>
            <div className="mt-2 flex flex-wrap gap-1.5 lg:flex-col">
              {categories.map((c) => {
                const on = cat === c.id;
                const count = c.id === 'all' ? products.length : products.filter((p) => p.category === c.id).length;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => update('category', c.id)}
                    aria-pressed={on}
                    className={`flex items-center justify-between gap-3 rounded-full px-3 py-1.5 text-left text-[0.8rem] transition lg:rounded-xl ${on ? 'bg-navy text-pearl' : 'bg-pearl text-navy hover:bg-aqua'}`}
                  >
                    {c.label}
                    <span className={`rounded-full px-1.5 text-[0.65rem] ${on ? 'bg-white/15' : 'bg-white text-mist'}`}>{count}</span>
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-[0.62rem] font-medium tracking-[0.28em] text-gold-deep uppercase">Brand</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {['all', ...brands].map((b) => {
                const on = brand === b;
                const count = b === 'all' ? products.length : products.filter((p) => p.brand === b).length;
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => update('brand', b)}
                    aria-pressed={on}
                    className={`rounded-full border px-2.5 py-1 text-[0.75rem] transition ${on ? 'border-navy bg-navy text-pearl' : 'border-navy/10 text-navy hover:border-gold'}`}
                  >
                    {b === 'all' ? 'All' : b} <span className="opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>

            {(cat !== 'all' || brand !== 'all' || query) && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setParams(new URLSearchParams(), { replace: true });
                }}
                className="mt-4 text-[0.72rem] font-medium text-gold-deep underline-offset-4 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center gap-2 text-[0.82rem] text-mist">
            <span><strong className="font-medium text-navy">{list.length}</strong> {list.length === 1 ? 'product' : 'products'}</span>
            {cat !== 'all' && <span className="rounded-full bg-aqua px-2.5 py-0.5 text-[0.72rem] text-navy">{categories.find((c) => c.id === cat)?.label}</span>}
            {brand !== 'all' && <span className="rounded-full bg-aqua px-2.5 py-0.5 text-[0.72rem] text-navy">{brand}</span>}
          </div>

          <motion.div layout className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <motion.div key={p.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }}>
                  <ProductCard product={p} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {list.length === 0 && (
            <div className="py-14 text-center">
              <p className="font-display text-2xl text-navy">No match — yet.</p>
              <p className="mt-1 text-sm text-mist">We stock more than we can list. Ask us on WhatsApp for the model you have in mind.</p>
            </div>
          )}
        </div>
      </section>

      <CtaBanner title="Not sure which purifier to choose?" text="Tell us your water source and family size — we’ll shortlist the right models and test your water at home." />
    </>
  );
}
