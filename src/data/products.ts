// Product catalogue — features are taken from the brand creatives supplied by Zam Zam.
// No prices or capacity figures are listed; customers are invited to enquire for current specs.

export type Category = 'domestic' | 'commercial' | 'softener' | 'smart';

export interface Product {
  slug: string;
  brand: string;
  name: string;
  series?: string;
  category: Category;
  tagline: string;
  summary: string;
  technology: string[];
  highlights: string[];
  colours?: { name: string; hex: string }[];
  idealFor: string[];
  image: string;
  gallery: string[];
  featured?: boolean;
  badge?: string;
}

export const categories: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All Products' },
  { id: 'domestic', label: 'Home RO Purifiers' },
  { id: 'commercial', label: 'Commercial & SS Systems' },
  { id: 'softener', label: 'Water Softeners' },
  { id: 'smart', label: 'Controllers & Power' },
];

const img = (name: string) => `/images/${name}.webp`;

export const products: Product[] = [
  {
    slug: 'aqua-2090-raga-series',
    brand: 'Aqua 2090',
    name: 'Aqua 2090 Raga',
    series: 'Raga Series',
    category: 'domestic',
    tagline: 'RO + Copper with Alkaline in six designer shades.',
    summary:
      'The Raga Series pairs advanced RO purification with copper enrichment and an alkaline stage, wrapped in a matte cabinet that looks at home in any modern kitchen. Choose a shade that matches your interiors.',
    technology: ['Reverse Osmosis', 'Copper enrichment', 'Alkaline stage'],
    highlights: ['Six designer colours', 'Front LED status panel', 'Chrome-finish dispensing tap', 'Ribbed smoked storage tank'],
    colours: [
      { name: 'Sky Blue', hex: '#a6dbe2' },
      { name: 'Rose Pink', hex: '#f1bcb6' },
      { name: 'Mint Green', hex: '#a8cf8e' },
      { name: 'Champagne', hex: '#d8cfa6' },
      { name: 'Royal Purple', hex: '#4f3a5c' },
      { name: 'Graphite', hex: '#4b4f56' },
    ],
    idealFor: ['Homes', 'Apartments', 'Borewell & municipal water'],
    image: img('aqua-2090-sky'),
    gallery: [img('aqua-2090-sky'), img('aqua-2090-pink'), img('aqua-2090-mint'), img('aqua-2090-purple'), img('aqua-2090-graphite'), img('aqua-2090-raga-series')],
    featured: true,
    badge: 'Designer pick',
  },
  {
    slug: 'lx-one-titanium-gun-metal',
    brand: 'LX One',
    name: 'LX One Titanium',
    series: 'Titanium Series · Gun Metal',
    category: 'domestic',
    tagline: 'Engineered for purity. Designed for life.',
    summary:
      'A statement purifier in a premium gun-metal finish. The Titanium Series is built tough for daily use and pairs advanced purification with an intelligent touch panel showing power, tank-full and purifying status.',
    technology: ['Advanced multi-stage purification', 'Intelligent status panel'],
    highlights: ['Premium gun-metal finish', 'Titanium-tough build', 'Smoked transparent tank', 'Touch-style indicator panel'],
    colours: [{ name: 'Gun Metal', hex: '#4a4c50' }],
    idealFor: ['Premium kitchens', 'Villas', 'Offices'],
    image: img('lx-one-titanium-gun-metal'),
    gallery: [img('lx-one-titanium-gun-metal')],
    featured: true,
    badge: 'Premium',
  },
  {
    slug: 'water-pia',
    brand: 'Water Pia',
    name: 'Water Pia',
    series: 'Aqua Fresh Technology',
    category: 'domestic',
    tagline: 'Experience the luxury of perfection.',
    summary:
      'Water Pia brings a sculpted, light-ray design with Aqua Fresh Technology and a smart LED indicator, so you always know when your purifier is working, full or needs attention.',
    technology: ['Aqua Fresh Technology', 'RO purification', 'Smart LED indicator'],
    highlights: ['Smart LED indicator', 'Five colour options', 'See-through tank windows', 'Elegant light-ray artwork'],
    colours: [
      { name: 'Ocean White', hex: '#5c8fc7' },
      { name: 'Royal Maroon', hex: '#6e1d26' },
      { name: 'Teal White', hex: '#57b4c4' },
      { name: 'Midnight Copper', hex: '#1d1d1f' },
      { name: 'Pearl Grey', hex: '#9b9c9e' },
    ],
    idealFor: ['Homes', 'Small offices'],
    image: img('water-pia-purifier'),
    gallery: [img('water-pia-purifier')],
    featured: true,
  },
  {
    slug: 'nile-aqua-jade',
    brand: 'Nile',
    name: 'Nile Aqua Jade',
    category: 'domestic',
    tagline: 'Start drinking safe & healthy water.',
    summary:
      'From Nile — “the name inspires trust” — Aqua Jade combines purification with Zinc, Copper and Alkaline enrichment. A spacious transparent tank and a clean, compact body make it a family favourite.',
    technology: ['RO purification', 'Zinc + Copper + Alkaline'],
    highlights: ['Zinc, copper & alkaline enrichment', 'Large transparent storage', 'LED status indicators', 'Five colourways'],
    colours: [
      { name: 'Aqua', hex: '#38b6c8' },
      { name: 'Onyx', hex: '#2b2b2d' },
      { name: 'Teal', hex: '#2f7d95' },
      { name: 'Silver', hex: '#b9bcc0' },
      { name: 'Royal Blue', hex: '#2f6cc0' },
    ],
    idealFor: ['Families', 'Apartments'],
    image: img('nile-aqua-jade'),
    gallery: [img('nile-aqua-jade')],
    featured: true,
    badge: 'Family favourite',
  },
  {
    slug: 'nile-aqua-v5',
    brand: 'Nile',
    name: 'Nile Aqua V5',
    category: 'domestic',
    tagline: 'Premium, perfectly sized.',
    summary:
      'Aqua V5 is a compact, premium purifier from Nile with a soft-blue finish, chrome tap and a central touch-style display. Zinc, copper and alkaline enrichment keep every glass tasting fresh.',
    technology: ['RO purification', 'Zinc + Copper + Alkaline'],
    highlights: ['Compact footprint', 'Central indicator panel', 'Chrome dispensing tap', 'Soft powder-blue finish'],
    colours: [{ name: 'Powder Blue', hex: '#9db8d8' }],
    idealFor: ['Compact kitchens', 'Couples & small families'],
    image: img('nile-aqua-v5'),
    gallery: [img('nile-aqua-v5')],
  },
  {
    slug: 'clean-water-aqua-ultra',
    brand: 'Clean Water',
    name: 'Aqua Ultra · Mountain Water',
    category: 'domestic',
    tagline: 'Pure & safe water — from any source.',
    summary:
      'Built for real Indian water conditions, Aqua Ultra works efficiently with TDS levels up to 2000 PPM. Borewell, tanker, municipal, corporation or well water — it delivers fresh, mountain-like taste every day.',
    technology: ['RO purification', 'High-TDS capable (up to 2000 PPM)'],
    highlights: ['Works with TDS up to 2000 PPM', 'Suits borewell, tanker, well & municipal water', 'Large blue transparent tank', 'Push-style tap & LED indicators'],
    colours: [{ name: 'Royal Blue & White', hex: '#1f4fb8' }],
    idealFor: ['Borewell water', 'Tanker water', 'High-TDS areas'],
    image: img('aqua-ultra-all-water-sources'),
    gallery: [img('aqua-ultra-all-water-sources')],
    featured: true,
    badge: 'High TDS',
  },
  {
    slug: 'clean-water-mountain-water-black',
    brand: 'Clean Water',
    name: 'Mountain Water · Mt. Black',
    category: 'domestic',
    tagline: 'BIS-compatible, food-grade RO cabinet.',
    summary:
      'Made as per RO industry standards, the Mountain Water cabinet uses high-quality, food-grade, BIS-compatible materials — now with an LED indicator — in a bold matte-black finish.',
    technology: ['RO purification', 'Food-grade BIS-compatible cabinet', 'LED indicator'],
    highlights: ['Food-grade cabinet', 'BIS-compatible materials', 'LED indicator', 'Matte black finish'],
    colours: [{ name: 'Mt. Black', hex: '#141414' }],
    idealFor: ['Homes', 'Shops'],
    image: img('clean-water-mountain-water-black'),
    gallery: [img('clean-water-mountain-water-black')],
  },
  {
    slug: 'clean-water-hi-flo',
    brand: 'Clean Water',
    name: 'Hi-Flo',
    series: 'Metallic Cherry',
    category: 'domestic',
    tagline: 'A water purification system with presence.',
    summary:
      'Hi-Flo stands out with a metallic cherry body, smoked transparent tank and wave artwork. Status LEDs and front stage indicators make day-to-day use effortless.',
    technology: ['RO purification', 'Stage indicators', 'LED status lights'],
    highlights: ['Metallic cherry finish', 'Smoked transparent tank', 'Front stage indicators', 'Wave artwork panel'],
    colours: [{ name: 'Metallic Cherry', hex: '#7a1424' }],
    idealFor: ['Homes', 'Living-dining spaces'],
    image: img('clean-water-hi-flo-metallic-cherry'),
    gallery: [img('clean-water-hi-flo-metallic-cherry')],
  },
  {
    slug: 'aqua-roma-gold',
    brand: 'Aqua Roma',
    name: 'Aqua Roma',
    series: 'Gold',
    category: 'domestic',
    tagline: 'Refreshing water, regal finish.',
    summary:
      'A curved champagne-gold cabinet with a chrome diamond emblem and side-swept tap. Aqua Roma is for homes that want their purifier to feel like a piece of décor.',
    technology: ['RO purification', 'LED status indicators'],
    highlights: ['Champagne-gold finish', 'Curved sculpted body', 'Chrome diamond emblem', 'Side-swept chrome tap'],
    colours: [{ name: 'Gold', hex: '#c9b48a' }],
    idealFor: ['Luxury interiors', 'Gifting'],
    image: img('aqua-roma-gold'),
    gallery: [img('aqua-roma-gold')],
    featured: true,
    badge: 'Royal gold',
  },
  {
    slug: 'zamzam-standard-ss-system',
    brand: 'Zam Zam',
    name: 'Standard Pure Water System',
    series: 'Stainless Steel',
    category: 'commercial',
    tagline: 'Compact, rust-proof stainless steel dispenser.',
    summary:
      'Zam Zam’s own stainless-steel pure water system with power, purifier, tank-full and call-service indicators. A compact, rust-proof body built for long life and low maintenance.',
    technology: ['Multi-stage purification', 'Service indicator panel'],
    highlights: ['Compact design', 'Rust-proof stainless body', 'Low maintenance', 'Long life'],
    idealFor: ['Offices', 'Schools', 'Clinics', 'Shops'],
    image: img('ss-standard-system'),
    gallery: [img('ss-standard-system'), img('water-level-controller-and-commercial-ro')],
    featured: true,
    badge: 'Zam Zam brand',
  },
  {
    slug: 'zamzam-hot-normal-ss-system',
    brand: 'Zam Zam',
    name: 'Hot & Normal Pure Water System',
    series: 'Stainless Steel',
    category: 'commercial',
    tagline: 'Hot and normal water from one stainless unit.',
    summary:
      'Dual taps for hot and normal water with advanced purification, a stainless-steel body and energy-efficient heating — ideal for workplaces and institutions that serve tea, coffee and drinking water all day.',
    technology: ['Advanced purification', 'Hot & normal dispensing'],
    highlights: ['Hot & normal water', 'Advanced purification', 'Stainless steel body', 'Energy efficient'],
    idealFor: ['Offices', 'Hospitals', 'Hostels', 'Restaurants'],
    image: img('ss-hot-normal-system'),
    gallery: [img('ss-hot-normal-system'), img('automatic-water-level-controller-banner')],
  },
  {
    slug: 'triple-stage-commercial-ro',
    brand: 'Zam Zam',
    name: 'Triple Stage Water Purifier',
    series: 'Commercial RO Plant',
    category: 'commercial',
    tagline: 'Three-stage filtration for high-demand spaces.',
    summary:
      'A frame-mounted commercial RO system with three jumbo filter housings and twin pumps. It removes impurities and improves water quality for businesses that need a steady supply of safe drinking water.',
    technology: ['3-stage filtration', 'Commercial RO', 'Twin booster pumps'],
    highlights: ['3-stage filtration', 'Removes impurities', 'Improves water quality', 'Stainless-steel frame'],
    idealFor: ['Factories', 'Schools & colleges', 'Hotels', 'Water businesses'],
    image: img('triple-stage-commercial-ro'),
    gallery: [img('triple-stage-commercial-ro'), img('water-level-controller-and-commercial-ro')],
  },
  {
    slug: 'water-softener-system',
    brand: 'Zam Zam',
    name: 'Whole-House Water Softener',
    category: 'softener',
    tagline: 'Say goodbye to hard-water scaling.',
    summary:
      'A complete softener installation with resin vessel, automatic control valve, brine tank and pre-filter. Protects taps, geysers, washing machines and tiles from hard-water scale across your home.',
    technology: ['Ion-exchange softening', 'Automatic control valve', 'Pre-filtration'],
    highlights: ['Protects geysers & appliances', 'Reduces scaling on tiles & taps', 'Softer bathing water', 'Neat, professional plumbing'],
    idealFor: ['Independent houses', 'Villas', 'Apartments with borewell supply'],
    image: img('water-softener-installation'),
    gallery: [img('water-softener-installation')],
    featured: true,
  },
  {
    slug: 'automatic-water-level-controller',
    brand: 'Zam Zam',
    name: 'Automatic Water Level Controller',
    category: 'smart',
    tagline: 'Smart control · Save water · Save life.',
    summary:
      'Automatically switches your pump on when the tank is low and off when it is full. Dry-run and overflow protection safeguard your motor and stop wastage — no more climbing to the terrace to check the tank.',
    technology: ['High-accuracy level sensors', 'Dry-run protection', 'Overflow protection'],
    highlights: [
      'Automatic water level control',
      'Dry-run protection',
      'Overflow protection',
      'Easy installation',
      'High-accuracy sensors',
      'Suitable for all pumps',
      'Energy saving',
      'Durable & reliable',
    ],
    idealFor: ['Overhead tanks', 'Sumps', 'Homes, apartments & businesses'],
    image: img('water-level-controller'),
    gallery: [img('automatic-water-level-controller-banner'), img('water-level-controller-and-commercial-ro')],
    featured: true,
    badge: 'Smart home',
  },
  {
    slug: 'ups-battery',
    brand: 'Zam Zam',
    name: 'UPS & Inverter Batteries',
    category: 'smart',
    tagline: 'Uninterrupted power, sold and serviced locally.',
    summary:
      'Reliable UPS batteries for homes and businesses — with honest advice on the right capacity, doorstep installation, and replacement support when your old battery gives up.',
    technology: ['Sales', 'Installation', 'Replacement & service'],
    highlights: ['Guidance on the right capacity', 'Doorstep installation', 'Old battery replacement', 'Local after-sales support'],
    idealFor: ['Homes', 'Shops', 'Offices'],
    image: '',
    gallery: [],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const brands = Array.from(new Set(products.map((p) => p.brand)));
/** "Nile Aqua Jade" rather than "Nile Nile Aqua Jade". */
export const fullName = (p: Pick<Product, 'brand' | 'name'>) => (p.name.startsWith(p.brand) ? p.name : `${p.brand} ${p.name}`);
/** Name + series for page titles, skipping a series word the name already contains. */
export const seoName = (p: Product) =>
  p.series && !p.name.toLowerCase().includes(p.series.split(' ')[0].toLowerCase()) ? `${fullName(p)} ${p.series}` : fullName(p);
