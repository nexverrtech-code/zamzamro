export interface Service {
  slug: string;
  icon: 'store' | 'wrench' | 'drill' | 'filter' | 'sparkles' | 'building' | 'waves' | 'battery' | 'gauge';
  title: string;
  short: string;
  description: string;
  points: string[];
}

export const services: Service[] = [
  {
    slug: 'ro-water-purifier-sales',
    icon: 'store',
    title: 'RO Purifier Sales',
    short: 'Branded purifiers from Nile, Clean Water, LX One, Aqua 2090, Water Pia & more.',
    description:
      'We help you choose by your water, not by a showroom pitch. Tell us your water source and family size, and we will shortlist purifiers that genuinely suit your home — RO, copper, zinc or alkaline.',
    points: ['Water-source based recommendation', 'Multiple trusted brands under one roof', 'Designer colours & finishes', 'Doorstep delivery in Erode'],
  },
  {
    slug: 'ro-installation',
    icon: 'drill',
    title: 'Expert Installation',
    short: 'Neat, leak-free installation with a full demo at handover.',
    description:
      'Our technicians check the inlet line, power point and drain, mount your purifier securely, and test the output before we leave — then walk your family through daily use and indicator lights.',
    points: ['Site check before mounting', 'Leak-free fittings', 'Output water tested on site', 'Usage demo for the family'],
  },
  {
    slug: 'ro-repair-service',
    icon: 'wrench',
    title: 'RO Repair & Service',
    short: 'Low flow, bad taste, leaks or noise — diagnosed and fixed.',
    description:
      'Whether it is a purifier we sold or another brand, we diagnose the root cause — choked filters, a tired membrane, pump or valve trouble — and explain the fix before any part is replaced.',
    points: ['All major brands serviced', 'Clear diagnosis before repair', 'Genuine compatible spares', 'Doorstep service visits'],
  },
  {
    slug: 'filter-membrane-replacement',
    icon: 'filter',
    title: 'Filter & Membrane Change',
    short: 'Sediment, carbon, RO membrane and mineral cartridges.',
    description:
      'Filters work silently until they don’t. We replace sediment, carbon, membrane and mineral cartridges on schedule so your water stays as pure as the day the purifier was installed.',
    points: ['Sediment & carbon pre-filters', 'RO membranes', 'Copper / alkaline / mineral cartridges', 'TDS check after replacement'],
  },
  {
    slug: 'maintenance-sanitisation',
    icon: 'sparkles',
    title: 'Maintenance & Sanitisation',
    short: 'Tank cleaning, sanitisation and a full health check.',
    description:
      'A routine visit to clean the storage tank, sanitise the lines, check pressure and flow, and record your water TDS — the simple habit that keeps a purifier healthy for years.',
    points: ['Storage tank cleaning', 'Line sanitisation', 'Pressure & flow check', 'TDS reading recorded'],
  },
  {
    slug: 'commercial-ro-systems',
    icon: 'building',
    title: 'Commercial & SS Systems',
    short: 'Stainless-steel dispensers and triple-stage RO plants.',
    description:
      'For offices, schools, clinics, hostels and factories we supply and install Zam Zam stainless-steel pure water systems (standard and hot & normal) and triple-stage commercial RO purifiers.',
    points: ['Standard & hot-normal SS units', 'Triple-stage commercial RO', 'Site survey & sizing', 'Scheduled service visits'],
  },
  {
    slug: 'water-softener',
    icon: 'waves',
    title: 'Water Softener',
    short: 'Whole-house softening against hard-water scaling.',
    description:
      'Hard borewell water leaves white scale on taps, tiles and geysers. A whole-house softener treats water at the inlet so every tap in the home delivers softer water.',
    points: ['Hardness check', 'Resin vessel & brine tank setup', 'Neat inlet plumbing', 'Regeneration guidance'],
  },
  {
    slug: 'ups-battery',
    icon: 'battery',
    title: 'UPS Battery',
    short: 'Sales, installation and replacement of UPS batteries.',
    description:
      'Power cuts should not stop your home or business. We supply the right UPS battery for your load, install it safely and handle replacement when the time comes.',
    points: ['Capacity guidance', 'Safe installation', 'Old battery replacement', 'After-sales support'],
  },
  {
    slug: 'water-level-controller',
    icon: 'gauge',
    title: 'Water Level Controller',
    short: 'Automatic pump control with dry-run & overflow protection.',
    description:
      'Our automatic water level controller fills your tank when it runs low and stops the motor when it is full — protecting the pump from dry running and saving every litre from overflowing.',
    points: ['Automatic pump on/off', 'Dry-run protection', 'Overflow protection', 'Works with all pumps'],
  },
];
