import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found | Zam Zam Pure Water System" description="This page has evaporated. Return to Zam Zam Pure Water System, Erode." path="/404" />
      <meta name="robots" content="noindex" />
      <section className="relative grid min-h-[90vh] place-items-center overflow-hidden water-bg px-4 pt-28 text-center">
        <div>
          <div className="relative mx-auto h-48 w-36">
            <motion.img
              src="/images/emblem-navy.png"
              alt=""
              className="absolute inset-0 h-full w-full object-contain"
              animate={{ y: [0, -16, 0], rotate: [0, -4, 4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute -bottom-6 left-1/2 h-6 w-36 -translate-x-1/2 rounded-[50%] border border-navy/25"
                animate={{ scale: [0.4, 2], opacity: [0.8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i, ease: 'easeOut' }}
              />
            ))}
          </div>
          <p className="mt-10 font-display text-8xl font-medium text-navy">404</p>
          <h1 className="mt-2 text-3xl font-medium">This page has evaporated</h1>
          <p className="mx-auto mt-3 max-w-md text-mist">The link may be old or mistyped. Let’s get you back to pure water.</p>
          <Link to="/" className="btn-royal mt-6"><ArrowLeft size={16} /> Back to home</Link>
        </div>
      </section>
    </>
  );
}
