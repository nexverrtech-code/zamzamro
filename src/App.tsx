import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingContact from './components/FloatingContact';
import ScrollProgress from './components/ScrollProgress';
import ClickRipple from './components/ClickRipple';
import Home from './pages/Home';
import { initSmoothScroll, scrollToElement, scrollToTop } from './lib/smoothScroll';

const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Services = lazy(() => import('./pages/Services'));
const Installation = lazy(() => import('./pages/Installation'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  const location = useLocation();

  // The branded preloader plays on every fresh open / reload.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initSmoothScroll();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (location.hash) {
      const el = document.querySelector<HTMLElement>(location.hash);
      if (el) return void setTimeout(() => scrollToElement(el), 450);
    }
    scrollToTop();
  }, [location.pathname, location.hash, loading]);

  const finishLoading = () => setLoading(false);

  return (
    <>
      <AnimatePresence>{loading && <Preloader onDone={finishLoading} />}</AnimatePresence>
      <ScrollProgress />
      <ClickRipple />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={<div className="min-h-screen water-bg" />}>
            <Routes location={location}>
              <Route path="/" element={<Home ready={!loading} />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/services" element={<Services />} />
              <Route path="/installation" element={<Installation />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <FloatingContact />
    </>
  );
}
