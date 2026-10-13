import type { ReactNode } from 'react';
import Reveal from './Reveal';

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  light?: boolean;
}) {
  const center = align === 'center';
  return (
    <Reveal className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      <p className={`eyebrow ${center ? 'justify-center' : ''}`}>{eyebrow}</p>
      <h2 className={`mt-2.5 text-[1.9rem] leading-[1.08] font-medium sm:text-4xl lg:text-[2.75rem] ${light ? '!text-pearl' : ''}`}>{title}</h2>
      {intro && <p className={`mt-2.5 text-[0.95rem] leading-relaxed ${light ? 'text-pearl/75' : 'text-mist'}`}>{intro}</p>}
    </Reveal>
  );
}
