import { Link } from 'react-router-dom';

export default function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="Zam Zam Pure Water System — Home">
      <img
        src={light ? '/images/emblem-white.png' : '/images/emblem-navy.png'}
        alt="Zam Zam water drop emblem"
        width={40}
        height={56}
        className={`${compact ? 'h-10' : 'h-12'} w-auto transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-[-4deg]`}
      />
      <span className="leading-none">
        <span className={`block font-royal ${compact ? 'text-xl' : 'text-2xl'} tracking-[0.12em] ${light ? 'text-pearl' : 'text-navy'}`}>
          ZAM ZAM
        </span>
        <span className={`mt-1 block font-royal text-[0.58rem] tracking-[0.28em] ${light ? 'text-pearl/80' : 'text-navy/75'}`}>
          PURE WATER SYSTEM
        </span>
      </span>
    </Link>
  );
}
