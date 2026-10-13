import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { routeMeta } from '../data/seo';
import { business } from '../data/business';

export default function Privacy() {
  const meta = routeMeta.privacy;
  return (
    <>
      <Seo title={meta.title} description={meta.description} path={meta.path} />
      <PageHero crumb="Privacy" eyebrow="Your data" title="Privacy policy" intro="Short and simple — because we collect very little." />
      <section className="container-royal max-w-3xl space-y-6 py-16 leading-relaxed text-ink/80">
        <h2 className="text-3xl font-medium">What we collect</h2>
        <p>
          This website does not store enquiry forms on any server. When you use the enquiry assistant, your details are placed into a WhatsApp message on your own device, and you decide whether to send it to {business.name}.
        </p>
        <h2 className="text-3xl font-medium">How we use it</h2>
        <p>Details you send us by WhatsApp or phone are used only to respond to your enquiry, arrange visits and provide service. We do not sell or share them for marketing.</p>
        <h2 className="text-3xl font-medium">Third-party services</h2>
        <p>This site embeds Google Maps and loads fonts from Google Fonts. These services may process technical data such as your IP address under their own privacy policies. Links to WhatsApp open the WhatsApp app or website.</p>
        <h2 className="text-3xl font-medium">Contact</h2>
        <p>Questions about your data? Call {business.phoneDisplay} or visit our store on Poondurai Road, Erode.</p>
      </section>
    </>
  );
}
