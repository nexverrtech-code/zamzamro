import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';

export default function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-navy/10 rounded-[20px] border border-navy/8 bg-white px-5 shadow-soft sm:px-6">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <h3 className="font-sans text-[0.9rem]">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-5 py-3.5 text-left font-medium text-navy"
              >
                {f.q}
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${isOpen ? 'bg-gold text-navy-deep' : 'bg-aqua text-navy'}`}>
                  <Plus size={16} />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <p className="pb-4 text-[0.85rem] leading-relaxed text-mist">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
