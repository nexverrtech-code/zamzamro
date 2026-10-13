// Per-route metadata. Also read by scripts/postbuild-seo.mjs to emit static HTML per route + sitemap.
export interface RouteMeta {
  path: string;
  title: string;
  description: string;
}

export const routeMeta: Record<string, RouteMeta> = {
  home: {
    path: '/',
    title: 'RO Water Purifier Sales, Service & Installation in Erode | Zam Zam Pure Water System',
    description:
      'Zam Zam Pure Water System, Poondurai Road, Erode — RO water purifier sales, doorstep installation and repair. Nile, Clean Water, LX One, Aqua 2090, Water Pia. Call 818 99 717 17.',
  },
  products: {
    path: '/products',
    title: 'RO Water Purifiers in Erode — Nile, Clean Water, LX One, Aqua 2090 | Zam Zam',
    description:
      'Explore home RO purifiers, copper & alkaline models, stainless-steel commercial systems, water softeners, water level controllers and UPS batteries at Zam Zam, Erode.',
  },
  services: {
    path: '/services',
    title: 'RO Water Purifier Repair & Service in Erode | Zam Zam Pure Water System',
    description:
      'RO repair, filter & membrane replacement, sanitisation, softener, UPS battery and water level controller service across Erode. Book on WhatsApp 818 99 717 17.',
  },
  installation: {
    path: '/installation',
    title: 'RO Water Purifier Installation in Erode — Doorstep & Leak-Free | Zam Zam',
    description:
      'Professional RO purifier, softener and water level controller installation in Erode. Site check, leak-free fitting, on-site water test and a full family demo.',
  },
  about: {
    path: '/about',
    title: 'About Zam Zam Pure Water System, Erode — Pure Forever',
    description:
      'The story behind Zam Zam Pure Water System — an Erode water purification specialist built on honest advice, careful installation and dependable after-sales care.',
  },
  contact: {
    path: '/contact',
    title: 'Contact Zam Zam Pure Water System, Erode | Call 818 99 717 17',
    description:
      'Visit us at 125/2 Jeevanandham Street, near N.R. Mahal, Poondurai Road, Erode 638002. Call or WhatsApp 818 99 717 17 for RO sales, service and installation.',
  },
  faq: {
    path: '/faq',
    title: 'RO Water Purifier FAQs — Erode Water, Filters, TDS & Installation | Zam Zam',
    description:
      'Answers to common questions about RO purifiers for Erode borewell water, filter changes, copper & alkaline models, softeners, water level controllers and UPS batteries.',
  },
  privacy: {
    path: '/privacy',
    title: 'Privacy Policy | Zam Zam Pure Water System',
    description: 'How Zam Zam Pure Water System handles the information you share through enquiries on this website.',
  },
};
