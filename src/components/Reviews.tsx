import { Star } from 'lucide-react';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { business } from '../data/business';
import { reviews } from '../data/reviews';

/** Shows genuine Google reviews from data/reviews.ts; falls back to a review invitation. */
export default function Reviews() {
  return (
    <section className="py-10 sm:py-12" aria-labelledby="reviews-title">
      <div className="container-royal">
        <SectionHeading
          align="center"
          eyebrow="Kind words"
          title={<span id="reviews-title">Trusted in homes <em className="text-gold-shimmer">across Erode</em></span>}
        />
        {reviews.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.08} className="card-royal p-7">
                <div className="flex gap-1 text-gold">{Array.from({ length: r.rating }).map((_, k) => <Star key={k} size={16} fill="currentColor" />)}</div>
                <blockquote className="mt-4 font-display text-xl leading-snug text-navy">“{r.text}”</blockquote>
                <p className="mt-5 text-sm font-semibold text-navy">{r.name}</p>
                <p className="text-xs text-mist">{r.area} · Google review</p>
              </Reveal>
            ))}
          </div>
        )}
        <Reveal className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-5 rounded-[28px] border border-gold/40 bg-gradient-to-br from-white to-blush p-8 text-center shadow-soft sm:flex-row sm:text-left">
          <div className="flex shrink-0 gap-1 text-gold">{[0, 1, 2, 3, 4].map((k) => <Star key={k} size={22} fill="currentColor" />)}</div>
          <p className="flex-1 text-sm text-ink/80">Had a great experience with Zam Zam? A quick review on Google means the world to our small team.</p>
          <a href={business.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="btn-royal shrink-0 !py-3">Write a review</a>
        </Reveal>
      </div>
    </section>
  );
}
