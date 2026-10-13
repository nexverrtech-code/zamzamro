import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { services } from '../data/services';
import { fullName, products } from '../data/products';
import { business, whatsappLink } from '../data/business';

const timeSlots = ['Any time', 'Morning (9 – 12)', 'Afternoon (12 – 4)', 'Evening (4 – 8)'];

const field = 'mt-1 w-full rounded-lg border border-navy/15 bg-pearl px-3.5 py-2.5 text-[0.85rem] text-ink outline-none transition focus:border-gold focus:bg-white';
const label = 'block text-[0.8rem] font-medium text-navy';

/**
 * Standard enquiry form. Nothing is stored on a server — on submit the details are
 * composed into a WhatsApp message the visitor sends themselves.
 */
export default function EnquiryForm({ defaultService = '' }: { defaultService?: string }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    service: defaultService,
    product: '',
    area: '',
    date: '',
    slot: timeSlots[0],
    message: '',
  });
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceTitle = services.find((s) => s.slug === form.service)?.title ?? 'General enquiry';
    const message = [
      `Hello ${business.name}!`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Service: ${serviceTitle}`,
      form.product && `Product: ${form.product}`,
      `Area: ${form.area}`,
      form.date && `Preferred date: ${form.date}`,
      `Preferred time: ${form.slot}`,
      form.message && `Message: ${form.message}`,
    ]
      .filter(Boolean)
      .join('\n');
    window.open(whatsappLink(message), '_blank', 'noopener');
  };

  return (
    <form onSubmit={submit} className="card-royal grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
      <div className="sm:col-span-2">
        <h3 className="text-xl font-medium">Enquiry form</h3>
        <p className="mt-1 text-sm text-mist">Fields marked * are required.</p>
      </div>

      <label className={label}>
        Full name *
        <input required value={form.name} onChange={set('name')} className={field} autoComplete="name" />
      </label>
      <label className={label}>
        Phone number *
        <input required type="tel" inputMode="tel" pattern="[0-9+\s-]{10,15}" value={form.phone} onChange={set('phone')} className={field} autoComplete="tel" placeholder="10-digit mobile" />
      </label>

      <label className={label}>
        Service required *
        <select required value={form.service} onChange={set('service')} className={field}>
          <option value="" disabled>Select a service</option>
          {services.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
        </select>
      </label>
      <label className={label}>
        Product <span className="font-normal text-mist">(optional)</span>
        <select value={form.product} onChange={set('product')} className={field}>
          <option value="">Not sure / other brand</option>
          {products.map((p) => <option key={p.slug} value={fullName(p)}>{fullName(p)}</option>)}
        </select>
      </label>

      <label className={`${label} sm:col-span-2`}>
        Area / locality in Erode *
        <input required value={form.area} onChange={set('area')} className={field} placeholder="e.g. Surampatti" />
      </label>

      <label className={label}>
        Preferred date
        <input type="date" value={form.date} onChange={set('date')} className={field} min={new Date().toISOString().slice(0, 10)} />
      </label>
      <label className={label}>
        Preferred time
        <select value={form.slot} onChange={set('slot')} className={field}>
          {timeSlots.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>

      <label className={`${label} sm:col-span-2`}>
        Message
        <textarea rows={3} value={form.message} onChange={set('message')} className={`${field} resize-none`} placeholder="Tell us about the issue or requirement" />
      </label>

      <button type="submit" className="btn mt-1 bg-[#25D366] text-white hover:brightness-95 sm:col-span-2">
        <MessageCircle size={17} /> Send enquiry
      </button>
      <p className="text-center text-xs text-mist sm:col-span-2">Sends your details to us on WhatsApp. Nothing is stored on this website.</p>
    </form>
  );
}
