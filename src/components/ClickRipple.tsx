import { useEffect, useState } from 'react';

interface Ripple { id: number; x: number; y: number }

/** Soft water ripple wherever the visitor clicks or taps. */
export default function ClickRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let id = 0;
    const onDown = (e: PointerEvent) => {
      const r = { id: ++id, x: e.clientX, y: e.clientY };
      setRipples((rs) => [...rs.slice(-4), r]);
      setTimeout(() => setRipples((rs) => rs.filter((x) => x.id !== r.id)), 900);
    };
    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute h-3 w-3 rounded-full border border-ocean/60"
          style={{ left: r.x - 6, top: r.y - 6, animation: 'zz-ripple 0.9s ease-out forwards' }}
        />
      ))}
      <style>{`@keyframes zz-ripple{from{transform:scale(1);opacity:.9}to{transform:scale(9);opacity:0}}`}</style>
    </div>
  );
}
