import { MapPin, Phone, Mail, Clock, Instagram, ExternalLink } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';

const galleryImages = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=400&fit=crop',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=500&h=400&fit=crop',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=500&h=400&fit=crop',
  'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=500&h=400&fit=crop',
];

export default function OurStore() {
  return (
    <div>
      <PageHeader
        title="Our Store"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Our Store' }]}
        backgroundImage="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&h=400&fit=crop"
      />

      {/* Store Info */}
      <section className="bg-[#F5EFE6] py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Info */}
            <div className="lg:col-span-2">
              <h2
                className="text-[#1E1A17] font-bold mb-6"
                style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}
              >
                Suryatji Coffee Farm &amp; Roastery
              </h2>

              <div className="space-y-5">
                <div className="flex gap-3">
                  <MapPin size={18} className="text-[#4A7C3A] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[#8B6F4E] uppercase tracking-wider mb-0.5">Address</p>
                    <p className="text-sm text-[#1E1A17]">Jl. Parakan - Wonosobo Km.11, Kledung, Temanggung, Jawa Tengah</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone size={18} className="text-[#4A7C3A] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[#8B6F4E] uppercase tracking-wider mb-0.5">Phone</p>
                    <a href="tel:081229888033" className="text-sm text-[#1E1A17] hover:text-[#4A7C3A]">0812-2988-8033</a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail size={18} className="text-[#4A7C3A] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[#8B6F4E] uppercase tracking-wider mb-0.5">Email</p>
                    <a href="mailto:saryadisuryatji@gmail.com" className="text-sm text-[#1E1A17] hover:text-[#4A7C3A]">saryadisuryatji@gmail.com</a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Instagram size={18} className="text-[#4A7C3A] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[#8B6F4E] uppercase tracking-wider mb-0.5">Instagram</p>
                    <span className="text-sm text-[#1E1A17]">@suryadisuryatji_coffee</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock size={18} className="text-[#4A7C3A] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[#8B6F4E] uppercase tracking-wider mb-0.5">Working Hours</p>
                    <p className="text-sm text-[#1E1A17]">Monday - Saturday: 08:00 - 17:00 WIB</p>
                  </div>
                </div>
              </div>

              <a
                href="https://maps.app.goo.gl/pr46KDWRbovCkD5g9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 border border-[#4A7C3A] text-[#4A7C3A] font-medium px-6 py-2.5 rounded-full hover:bg-[#4A7C3A] hover:text-white transition-colors"
              >
                <ExternalLink size={16} />
                Open in Google Maps
              </a>
            </div>

            {/* Map */}
            <div className="lg:col-span-3">
              <div className="rounded-xl overflow-hidden h-[400px] bg-[#1E1A17]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.5!2d110.05!3d-7.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMjEnMDAuMCJTIDExMMKwMDMnMDAuMCJF!5e0!3m2!1sen!2sid!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(30%) contrast(1.1)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Suryatji Coffee Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2
            className="text-[#1E1A17] font-bold text-center mb-10"
            style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
          >
            Our Farm Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {galleryImages.map((img, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <img
                  src={img}
                  alt={`Farm gallery ${i + 1}`}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
