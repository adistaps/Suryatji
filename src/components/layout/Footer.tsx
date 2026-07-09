import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1E1A17] relative">
      {/* Green accent bar */}
      <div className="h-1.5 bg-[#4A7C3A] w-full" />

      <div className="max-w-[1200px] mx-auto px-5 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#4A7C3A] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C8.5 2 6 4.5 6 7c0 1.5.5 2.5 1.5 3.5S9 12 9 13.5c0 2-1 3.5-3 4.5v1.5c2.5 1 6 1.5 6 1.5s3.5-.5 6-1.5V18c-2-1-3-2.5-3-4.5 0-1.5.5-2.5 1.5-3.5S18 8.5 18 7c0-2.5-2.5-5-6-5zm0 2c2 0 3.5 1.5 3.5 3S14 10 12 10 8.5 8.5 8.5 7 10 4 12 4z" />
                </svg>
              </div>
              <span className="text-white font-semibold text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>
                Suryatji Coffee
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-[280px]">
              Farm &amp; Roastery from the foothills of Mount Sindoro, Kledung, Temanggung.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-[#4A7C3A] hover:border-[#4A7C3A] transition-colors"
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5" style={{ fontFamily: '"Playfair Display", serif' }}>
              Contact Info
            </h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin size={18} className="text-[#4A7C3A] mt-0.5 shrink-0" />
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Our location:</p>
                  <p className="text-white/70 text-sm">Jl. Parakan - Wonosobo Km.11, Kledung, Temanggung, Jawa Tengah</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone size={18} className="text-[#4A7C3A] mt-0.5 shrink-0" />
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Phones:</p>
                  <a href="tel:081229888033" className="text-white/70 text-sm hover:text-[#4A7C3A] transition-colors">
                    0812-2988-8033
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail size={18} className="text-[#4A7C3A] mt-0.5 shrink-0" />
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Email:</p>
                  <a href="mailto:saryadisuryatji@gmail.com" className="text-white/70 text-sm hover:text-[#4A7C3A] transition-colors">
                    saryadisuryatji@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Subscribe */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5" style={{ fontFamily: '"Playfair Display", serif' }}>
              Subscribe
            </h4>
            <div className="flex gap-2 mb-3">
              <input
                type="email"
                placeholder="Your email ..."
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#4A7C3A]"
              />
              <button className="bg-[#4A7C3A] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#3d6b2f] transition-colors">
                Subscribe
              </button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-white/30 accent-[#4A7C3A]" />
              <span className="text-white/50 text-xs">I have read and agree to the terms &amp; conditions</span>
            </label>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            Suryatji Coffee &copy; All Rights Reserved - 2025
          </p>
          <Link to="/shop" className="text-white/40 text-xs hover:text-[#4A7C3A] transition-colors">
            Purchase
          </Link>
        </div>
      </div>
    </footer>
  );
}
