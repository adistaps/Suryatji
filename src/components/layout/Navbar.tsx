import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag, Search, Menu, X,
  Twitter, Facebook, Instagram, Youtube
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Products', path: '/shop' },
  { label: 'Our Store', path: '/our-store' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      setMobileMenuOpen(false);
    }, 0);
    return () => clearTimeout(handle);
  }, [location.pathname]);

  return (
    <>
      <nav
        className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${scrolled
            ? 'bg-[#12100E]/95 backdrop-blur-md shadow-lg py-2 border-b border-white/5'
            : 'bg-transparent py-4'
          }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col w-full relative">

          {/* === BARIS ATAS: Sosmed (Kiri), Logo (Tengah), Aksi (Kanan) === */}
          <div className="flex items-center justify-between lg:justify-center w-full">

            {/* Kiri: Follow Us & Social Media (Hidden di Mobile) */}
            <div className="hidden lg:flex items-center gap-4 absolute left-0">
              <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">Follow us</span>
              <div className="w-6 h-[1px] bg-white/30"></div>
              <div className="flex gap-2">
                <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#4A7C3A] hover:text-[#4A7C3A] hover:bg-white/5 transition-all">
                  <Twitter size={14} strokeWidth={2.5} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#4A7C3A] hover:text-[#4A7C3A] hover:bg-white/5 transition-all">
                  <Facebook size={14} strokeWidth={2.5} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#4A7C3A] hover:text-[#4A7C3A] hover:bg-white/5 transition-all">
                  <Instagram size={14} strokeWidth={2.5} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#4A7C3A] hover:text-[#4A7C3A] hover:bg-white/5 transition-all">
                  <Youtube size={14} strokeWidth={2.5} />
                </a>
              </div>
            </div>

            {/* Tengah: Logo Spesial */}
            <Link to="/" className="flex flex-col items-center justify-center group z-10 lg:mt-2">
              <h1
                className="text-white text-3xl md:text-4xl font-extrabold tracking-wider group-hover:text-[#4A7C3A] transition-colors"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Suryatji
              </h1>
              <span className="text-[#4A7C3A] text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase mt-1">
                Coffee Market
              </span>
            </Link>

            {/* Kanan: Cart & Search & Mobile Menu Toggle */}
            <div className="flex items-center gap-3 absolute right-0">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#4A7C3A] hover:text-[#4A7C3A] hover:bg-white/5 transition-all"
              >
                <ShoppingBag size={16} strokeWidth={2.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#4A7C3A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              <button className="hidden md:flex w-10 h-10 rounded-full border border-white/20 items-center justify-center text-white hover:border-[#4A7C3A] hover:text-[#4A7C3A] hover:bg-white/5 transition-all">
                <Search size={16} strokeWidth={2.5} />
              </button>

              <button
                className="lg:hidden text-white w-9 h-9 rounded-full border border-white/20 flex items-center justify-center"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={16} />
              </button>
            </div>
          </div>

          {/* === BARIS BAWAH: Tautan Menu (Hidden di Mobile) === */}
          <div className={`hidden lg:flex items-center justify-center gap-10 w-full transition-all duration-300 ${scrolled ? 'mt-3 mb-1' : 'mt-5'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center gap-1 text-[13px] font-bold tracking-wide uppercase transition-colors ${location.pathname === link.path
                    ? 'text-[#4A7C3A]'
                    : 'text-white hover:text-[#4A7C3A]'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

        </div>
      </nav>

      {/* === MOBILE MENU OVERLAY === */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#12100E] flex flex-col">
          <div className="flex justify-end p-6 border-b border-white/10">
            <button onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-[#4A7C3A] transition-colors">
              <X size={32} />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 gap-8 pb-20">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-2xl md:text-3xl font-bold uppercase tracking-wider transition-colors ${location.pathname === link.path ? 'text-[#4A7C3A]' : 'text-white'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex gap-6 mt-6">
              <a href="#" className="text-white hover:text-[#4A7C3A]"><Twitter size={24} /></a>
              <a href="#" className="text-white hover:text-[#4A7C3A]"><Facebook size={24} /></a>
              <a href="#" className="text-white hover:text-[#4A7C3A]"><Instagram size={24} /></a>
              <a href="#" className="text-white hover:text-[#4A7C3A]"><Youtube size={24} /></a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}