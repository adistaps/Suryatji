import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    }
  };

  return (
    <div>
      <PageHeader
        title="Contacts"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Contacts' }]}
        backgroundImage="https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=1600&h=400&fit=crop"
      />

      {/* Contact Info Cards */}
      <section className="bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MapPin, title: 'Location', info: 'Jl. Parakan - Wonosobo Km.11, Kledung, Temanggung, Jawa Tengah' },
              { icon: Phone, title: 'Phones', info: '0812-2988-8033' },
              { icon: Mail, title: 'Email', info: 'saryadisuryatji@gmail.com' },
              { icon: Clock, title: 'Working Hours', info: 'Monday - Saturday: 08:00 - 17:00 WIB' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-xl hover:bg-[#F9F6F1] transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#4A7C3A] flex items-center justify-center mx-auto mb-4">
                  <item.icon size={20} className="text-white" />
                </div>
                <h4 className="text-[#1E1A17] font-semibold">{item.title}</h4>
                <p className="text-[#8B6F4E] text-sm mt-2 leading-relaxed">{item.info}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section>
        <div className="h-[400px] bg-[#1E1A17]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.5!2d110.05!3d-7.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMjEnMDAuMCJTIDExMMKwMDMnMDAuMCJF!5e0!3m2!1sen!2sid!4v1"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(30%) contrast(1.1)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Suryatji Coffee Map"
          />
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-[600px] mx-auto px-5">
          <h2
            className="text-[#1E1A17] font-bold text-center mb-8"
            style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
          >
            Send Message
          </h2>

          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-green-700 font-medium">Thank you! Your message has been sent.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#4A7C3A]"
              />
              <input
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#4A7C3A]"
              />
            </div>
            <input
              type="tel"
              placeholder="Your phone (optional)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#4A7C3A]"
            />
            <textarea
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              rows={5}
              className="w-full border border-gray-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-[#4A7C3A] resize-none"
            />
            <button
              type="submit"
              className="w-full bg-[#4A7C3A] text-white font-semibold py-3.5 rounded-full hover:bg-[#3d6b2f] transition-colors"
            >
              Submit
            </button>
          </form>

          {/* WhatsApp Button */}
          <div className="mt-8 text-center">
            <p className="text-[#8B6F4E] text-sm mb-3">Or contact us directly via WhatsApp</p>
            <a
              href="https://wa.me/6281229888033"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#128C7E] transition-colors"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
