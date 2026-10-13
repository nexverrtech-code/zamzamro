import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Search, X } from 'lucide-react';
import Seo, { breadcrumb } from '../components/Seo';
import PageHero from '../components/PageHero';
import FaqList from '../components/FaqList';
import CtaBanner from '../components/CtaBanner';
import { faqs } from '../data/faqs';
import { routeMeta } from '../data/seo';

const topics = ['Borewell', 'Filters', 'Copper', 'Installation', 'Softener', 'Controller', 'UPS', 'Offices'];

export default function FAQ() {
  const meta = routeMeta.faq;
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? faqs.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(q)) : faqs;
  }, [query]);

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  /* Hero visual: a live "ask us" search with tappable topic bubbles. */
  const visual = (
    <div className="card-royal mx-auto w-full max-w-md p-5 sm:p-6">
      <label className="relative block">
        <span className="sr-only">Search questions</span>
        <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-mist" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything… e.g. TDS"
          className="w-full rounded-full border border-navy/15 bg-pearl py-3.5 pr-10 pl-11 text-sm outline-none focus:border-gold focus:bg-white"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} className="absolute top-1/2 right-4 -translate-y-1/2 text-mist" aria-label="Clear search">
            <X size={16} />
          </button>
        )}
      </label>
      <div className="mt-5 flex flex-wrap gap-2">
        {topics.map((t, i) => (
          <motion.button
            key={t}
            type="button"
            onClick={() => setQuery(t)}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
            transition={{ delay: 0.3 + i * 0.05, y: { duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut' } }}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${query === t ? 'bg-navy text-pearl' : 'bg-aqua text-navy hover:bg-gold/30'}`}
          >
            {t}
          </motion.button>
        ))}
      </div>
      <p className="mt-5 text-sm text-mist">
        <span className="font-display text-3xl font-medium text-navy">{results.length}</span> {results.length === 1 ? 'answer' : 'answers'} found
      </p>
    </div>
  );

  return (
    <>
      <Seo title={meta.title} description={meta.description} path={meta.path} jsonLd={[faqLd, breadcrumb([{ name: 'Home', path: '/' }, { name: 'FAQs', path: '/faq' }])]} />
      <PageHero
        crumb="FAQs"
        eyebrow="Answers"
        title={<>RO purifier questions, <em className="text-gold-shimmer">answered</em></>}
        intro="Purifiers, filters, TDS, softeners, water level controllers and UPS batteries — search or tap a topic."
        visual={visual}
      />
      <section className="container-royal max-w-3xl py-8">
        {results.length ? (
          <FaqList key={query} items={results} />
        ) : (
          <p className="py-10 text-center text-mist">No match — call us and we’ll answer it personally.</p>
        )}
      </section>
      <CtaBanner title="Still have a question?" text="Ask us directly — happy to help, even if you’re not buying today." />
    </>
  );
}
