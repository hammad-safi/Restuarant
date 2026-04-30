import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileNav from '@/components/MobileNav'
import WhatsAppFAB from '@/components/WhatsAppFAB'

export const metadata = {
  title: 'Contact Us | ZAIQA EXPRESS',
  description: 'Get in touch with ZAIQA EXPRESS. Call us, email us, or visit our locations.',
}

export default function ContactPage() {
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
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-surface-container-highest flex flex-col gap-4 group hover:bg-red-50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary-container group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">phone</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Call Us</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">+92 21 3456 7890</p>
                <p className="font-body-md text-body-md text-on-surface-variant">Mon - Sun: 11 AM - 1 AM</p>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-surface-container-highest flex flex-col gap-4 group hover:bg-secondary-container transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-on-secondary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Email Us</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">hello@zaiqaexpress.pk</p>
                <p className="font-body-md text-body-md text-on-surface-variant">support@zaiqaexpress.pk</p>
              </div>
            </div>

            {/* WhatsApp Highlight Card */}
            <div className="bg-on-tertiary-fixed p-8 rounded-3xl shadow-sm flex flex-col gap-4 text-white relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center text-white z-10">
                <span className="material-symbols-outlined">chat</span>
              </div>
              <div className="z-10">
                <h3 className="font-headline-md text-headline-md">Instant WhatsApp</h3>
                <p className="font-body-md text-body-md text-white/80">Order via chat for the fastest service.</p>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-white/5 group-hover:rotate-12 transition-transform">chat</span>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="md:col-span-8 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-surface-container-highest">
            <h2 className="font-display-lg text-display-lg text-primary mb-8">Send a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label-bold text-label-bold uppercase text-on-surface-variant ml-1">Full Name</label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Zaid Khan"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-bold text-label-bold uppercase text-on-surface-variant ml-1">Email Address</label>
                  <input
                    className="w-full bg-surface-container-low border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all"
                    placeholder="zaid@email.com"
                    type="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-bold text-label-bold uppercase text-on-surface-variant ml-1">How can we help?</label>
                <textarea
                  className="w-full bg-surface-container-low border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Your message here..."
                  rows={4}
                ></textarea>
              </div>
              <button
                className="w-full md:w-auto bg-primary text-on-primary px-12 py-4 rounded-2xl font-label-bold text-label-bold uppercase shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all"
                type="submit"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* Map Section */}
        <section className="mb-16">
          <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-sm border border-surface-container-highest">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoj6fTWzMPuLQYWlv6W7f-u4emPO15M5_0iQ0ZDBdwprIepD33dTVsPWIQHDlEv8-O-pSkKwMbo8NkzumonFGURjvnuZ5rkbP3_qW8VBChYTzRV79KghdSP-Mia3JdmtRKE24i7JpHdT7uobCeFnDdWLx2T5t0PAb1bpiOP0UuijCXB6ZnX-x8LRSyOh-qtV8R1_UnW2oYOIuJIA815mWUZjcoEJopvHZsQU3vfGkvnHWRXQ2x7EsLSwBQv4crubMcaW1m4dihPXPG"
              alt="Map"
            />
            <div className="absolute top-6 left-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs border border-gray-100">
              <h4 className="font-headline-md text-headline-md text-primary mb-2">Our Main Hub</h4>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Plot 42, Block 3, Bahadurabad Shopping Area, Karachi, Pakistan
              </p>
              <div className="mt-4 flex items-center gap-2 text-primary font-label-bold cursor-pointer hover:underline">
                <span className="material-symbols-outlined text-sm">directions</span>
                Get Directions
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Grid */}
        <section className="mb-16">
          <h2 className="font-display-lg text-display-lg text-center mb-12 uppercase tracking-tight">Join the Tribe</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <a
              className="bg-white p-8 rounded-3xl border border-surface-container-highest flex flex-col items-center gap-4 hover:border-primary transition-all group"
              href="#"
            >
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">camera</span>
              </div>
              <span className="font-label-bold text-label-bold uppercase text-on-surface-variant">Instagram</span>
            </a>
            <a
              className="bg-white p-8 rounded-3xl border border-surface-container-highest flex flex-col items-center gap-4 hover:border-primary transition-all group"
              href="#"
            >
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-[#1877F2] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">public</span>
              </div>
              <span className="font-label-bold text-label-bold uppercase text-on-surface-variant">Facebook</span>
            </a>
            <a
              className="bg-white p-8 rounded-3xl border border-surface-container-highest flex flex-col items-center gap-4 hover:border-primary transition-all group"
              href="#"
            >
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">video_library</span>
              </div>
              <span className="font-label-bold text-label-bold uppercase text-on-surface-variant">TikTok</span>
            </a>
            <a
              className="bg-white p-8 rounded-3xl border border-surface-container-highest flex flex-col items-center gap-4 hover:border-primary transition-all group"
              href="#"
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
