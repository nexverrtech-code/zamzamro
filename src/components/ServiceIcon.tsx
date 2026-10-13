import { BatteryCharging, Building2, Drill, Filter, Gauge, Sparkles, Store, Waves, Wrench, type LucideProps } from 'lucide-react';
import type { Service } from '../data/services';

const map = {
  store: Store,
  wrench: Wrench,
  drill: Drill,
  filter: Filter,
  sparkles: Sparkles,
  building: Building2,
  waves: Waves,
  battery: BatteryCharging,
  gauge: Gauge,
} as const;

export default function ServiceIcon({ name, ...props }: { name: Service['icon'] } & LucideProps) {
  const Icon = map[name];
  return <Icon strokeWidth={1.5} {...props} />;
}
