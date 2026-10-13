// Single source of truth for business details (NAP must match the Google Business Profile exactly).
// Items marked CONFIRM should be verified with the owner before launch.

export const SITE_URL = 'https://www.zamzampurewater.in'; // CONFIRM: final domain

export const business = {
  name: 'Zam Zam Pure Water System',
  shortName: 'Zam Zam',
  tagline: 'Pure Forever',
  phoneDisplay: '818 99 717 17',
  phoneE164: '+918189971717',
  whatsapp: '918189971717',
  email: '', // CONFIRM: add business email if available
  address: {
    street: '125/2 Jeevanandham Street, Near N.R. Mahal, Poondurai Road',
    locality: 'Erode',
    region: 'Tamil Nadu',
    postalCode: '638002',
    country: 'IN',
  },
  // CONFIRM: set real hours, e.g. [{ days: 'Mon – Sat', time: '9:00 AM – 8:00 PM' }]. Leave empty to hide.
  hours: [] as { days: string; time: string }[],
  // CONFIRM: paste the "Ask for reviews" link from Google Business Profile.
  googleReviewUrl: 'https://www.google.com/search?q=Zam+Zam+Pure+Water+System+Erode',
  mapsQuery: 'Zam Zam Pure Water System, 125/2 Jeevanandham Street, Poondurai Road, Erode 638002',
  // CONFIRM: localities actually served.
  serviceAreas: [
    'Erode Town',
    'Poondurai Road',
    'Surampatti',
    'Veerappanchatram',
    'Thindal',
    'Perundurai Road',
    'Chithode',
    'Bhavani',
    'Perundurai',
    'Kasipalayam',
  ],
};

export const fullAddress = `${business.address.street}, ${business.address.locality} – ${business.address.postalCode}`;
export const telLink = `tel:${business.phoneE164}`;
export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.mapsQuery)}`;
export const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(business.mapsQuery)}&output=embed`;

export function whatsappLink(message: string) {
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;
}
