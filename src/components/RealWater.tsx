import { useMemo } from 'react';

/**
 * Living backdrop built from real water photography: slow camera drift,
 * a light-shimmer layer, sun shafts and rising bubbles. CSS-only, so it stays light.
 */
export default function RealWater({
  variant = 'deep',
  overlay = '',
  bubbles = 14,
}: {
  variant?: 'deep' | 'surface';
  overlay?: string;
  bubbles?: number;
}) {
  const src = variant === 'deep' ? '/images/water-sunburst.webp' : '/images/water-turquoise.webp';
  const seeds = useMemo(
    () =>
      Array.from({ length: bubbles }, (_, i) => ({
        left: (i * 61) % 100,
        size: 4 + ((i * 7) % 14),
        delay: (i * 1.3) % 9,
        dur: 9 + ((i * 5) % 8),
      })),
    [bubbles],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <img src={src} alt="" className="zz-water-drift absolute inset-0 h-full w-full object-cover" decoding="async" />
      {/* light shimmer: the same photo, screened and drifting the other way */}
      <img src={src} alt="" className="zz-water-shimmer absolute inset-0 h-full w-full object-cover mix-blend-screen" decoding="async" />
      <div className={`zz-water-rays absolute inset-0 ${variant === 'surface' ? 'opacity-60' : ''}`} />
      {seeds.map((b, i) => (
        <span
          key={i}
          className="zz-bubble absolute bottom-[-24px] rounded-full"
          style={{ left: `${b.left}%`, width: b.size, height: b.size, animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s` }}
        />
      ))}
      {overlay && <div className={`absolute inset-0 ${overlay}`} />}
    </div>
  );
}
