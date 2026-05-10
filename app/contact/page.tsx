import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'
import WhatsAppFAB from '@/components/WhatsAppFAB'
import ContactForm from '@/components/ContactForm'
import prisma from '@/lib/prisma'

export const metadata = {
  title: 'Contact Us | ZAIQA EXPRESS',
  description: 'Get in touch with ZAIQA EXPRESS. Call us, email us, or visit our locations.',
}

async function getSettings() {
  const settings = await prisma.setting.findMany();
  return settings.reduce((acc: any, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
}

export default async function ContactPage() {
  const settings = await getSettings();

  const contactInfo = {
    phone: settings.phone || '+92 21 3456 7890',
    email: settings.email || 'hello@zaiqaexpress.pk',
    whatsapp: settings.whatsapp || '923456789000',
    address: settings.address || 'Plot 42, Block 3, Bahadurabad Shopping Area, Karachi, Pakistan',
    socials: {
      instagram: settings.social_instagram || '#',
      facebook: settings.social_facebook || '#',
      tiktok: settings.social_tiktok || '#',
      youtube: settings.social_youtube || '#',
    }
  };

  // Create a Google Maps embed URL from the address if map_embed is not provided
  const mapEmbedUrl = settings.map_embed || `https://www.google.com/maps/embed/v1/place?key=REPLACE_WITH_YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(contactInfo.address)}`;
  
  // For a free embed without API key, use the search URL
  const freeMapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(contactInfo.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="relative h-[300px] md:h-[450px] w-full rounded-3xl overflow-hidden mb-8 shadow-sm">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoSj915zj8K_vcjiOOVugQEbaVAyjitUDzs9D5mkkuKWaC-OB4KQ3tNroozYElRcfqGNwtvck0d7U-xvNGPEPfJffhJGLeWg-hmT2x4Lt2C2SZQgduU5MenjN_uo693wKTUfKlE3QV0MIq4mQkmsUpTAYeKtXMXMtSaUZUDSRlW2fcZxhgYEk9-Ll7V78qzY3IST9z8R-sA6DoT0wpl8CG1h7p2F9slriEYC_x7oNwWYbZrkfzGWbnixd3cBceA-3icdtR-jrovwG8"
              alt="Street Food"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8 md:p-12">
              <div>
                <h1 className="font-display-xl text-display-xl text-white mb-2 uppercase">Get In Touch</h1>
                <p className="font-body-lg text-body-lg text-white/90 max-w-2xl">
                  Craving authentic flavors? We&apos;re just a message away. Reach out for orders, feedback, or just to say Salam!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Contact Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-base mb-16">
          {/* Contact Info Cards */}
          <div className="md:col-span-4 flex flex-col gap-base">
            {/* Phone Card */}
            <a 
              href={`tel:${contactInfo.phone}`}
              className="bg-white p-8 rounded-3xl shadow-sm border border-surface-container-highest flex flex-col gap-4 group hover:bg-red-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary-container group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">phone</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Call Us</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{contactInfo.phone}</p>
                <p className="font-body-md text-body-md text-on-surface-variant">Mon - Sun: 11 AM - 1 AM</p>
              </div>
            </a>

            {/* Email Card */}
            <a 
              href={`mailto:${contactInfo.email}`}
              className="bg-white p-8 rounded-3xl shadow-sm border border-surface-container-highest flex flex-col gap-4 group hover:bg-secondary-container transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-on-secondary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Email Us</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{contactInfo.email}</p>
              </div>
            </a>

            {/* WhatsApp Highlight Card */}
            <a 
              href={`https://wa.me/${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-on-tertiary-fixed p-8 rounded-3xl shadow-sm flex flex-col gap-4 text-white relative overflow-hidden group hover:opacity-90 transition-opacity"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center text-white z-10">
                <span className="material-symbols-outlined">chat</span>
              </div>
              <div className="z-10">
                <h3 className="font-headline-md text-headline-md">Instant WhatsApp</h3>
                <p className="font-body-md text-body-md text-white/80">Order via chat for the fastest service.</p>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-white/5 group-hover:rotate-12 transition-transform">chat</span>
            </a>
          </div>

          {/* Contact Form Section */}
          <ContactForm />
        </section>

        {/* Map Section */}
        <section className="mb-16">
          <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-sm border border-surface-container-highest">
            <iframe
              className="w-full h-full border-0"
              src={freeMapEmbed}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute top-6 left-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs border border-gray-100 hidden md:block">
              <h4 className="font-headline-md text-headline-md text-primary mb-2">Our Main Hub</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {contactInfo.address}
              </p>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contactInfo.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2 text-primary font-label-bold cursor-pointer hover:underline"
              >
                <span className="material-symbols-outlined text-sm">directions</span>
                Get Directions
              </a>
            </div>
          </div>
        </section>

        {/* Social Media Grid */}
        <section className="mb-16">
          <h2 className="font-display-lg text-display-lg text-center mb-12 uppercase tracking-tight">Join the Tribe</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <a
              className="bg-white p-8 rounded-3xl border border-surface-container-highest flex flex-col items-center gap-4 hover:border-primary transition-all group"
              href={contactInfo.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">camera</span>
              </div>
              <span className="font-label-bold text-label-bold uppercase text-on-surface-variant">Instagram</span>
            </a>
            <a
              className="bg-white p-8 rounded-3xl border border-surface-container-highest flex flex-col items-center gap-4 hover:border-primary transition-all group"
              href={contactInfo.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-[#1877F2] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">public</span>
              </div>
              <span className="font-label-bold text-label-bold uppercase text-on-surface-variant">Facebook</span>
            </a>
            <a
              className="bg-white p-8 rounded-3xl border border-surface-container-highest flex flex-col items-center gap-4 hover:border-primary transition-all group"
              href={contactInfo.socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">video_library</span>
              </div>
              <span className="font-label-bold text-label-bold uppercase text-on-surface-variant">TikTok</span>
            </a>
            <a
              className="bg-white p-8 rounded-3xl border border-surface-container-highest flex flex-col items-center gap-4 hover:border-primary transition-all group"
              href={contactInfo.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">smart_display</span>
              </div>
              <span className="font-label-bold text-label-bold uppercase text-on-surface-variant">YouTube</span>
            </a>
          </div>
        </section>
      </main>

      <MobileNav />
      <WhatsAppFAB />
      <Footer />
    </>
  )
}
