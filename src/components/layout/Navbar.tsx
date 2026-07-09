import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, ShoppingBag, Search, Menu, X, User, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  {
    label: 'Products',
    path: '/shop',
    children: [
      { label: 'Arabica Green', path: '/shop?category=arabica-green' },
      { label: 'Arabica Roasted', path: '/shop?category=arabica-roasted' },
      { label: 'Black Coffee', path: '/shop?category=black-coffee' },
      { label: 'Mixed Sorts', path: '/shop?category=mixed-sorts' },
      { label: 'Robusta Roasted', path: '/shop?category=robusta-roasted' },
    ],
  },
  { label: 'Our Store', path: '/our-store' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#1E1A17]/95 backdrop-blur-md border-b border-white/10'
            : 'bg-[#1E1A17]'
        }`}
        style={{ height: 80 }}
      >
        <div className="max-w-[1200px] mx-auto px-5 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4A7C3A] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C8.5 2 6 4.5 6 7c0 1.5.5 2.5 1.5 3.5S9 12 9 13.5c0 2-1 3.5-3 4.5v1.5c2.5 1 6 1.5 6 1.5s3.5-.5 6-1.5V18c-2-1-3-2.5-3-4.5 0-1.5.5-2.5 1.5-3.5S18 8.5 18 7c0-2.5-2.5-5-6-5zm0 2c2 0 3.5 1.5 3.5 3S14 10 12 10 8.5 8.5 8.5 7 10 4 12 4z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg hidden sm:block" style={{ fontFamily: '"Playfair Display", serif' }}>
              Suryatji Coffee
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.path}
                className="relative"
                onMouseEnter={() => link.children && setProductsOpen(true)}
                onMouseLeave={() => link.children && setProductsOpen(false)}
              >
                <Link
                  to={link.path}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.label}
                  {link.children && <ChevronDown size={14} />}
                  {location.pathname === link.path && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#4A7C3A] rounded-full" />
                  )}
                </Link>
                {link.children && productsOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-[#1E1A17] border border-white/10 rounded-lg shadow-xl py-2 min-w-[200px]">
                    {link.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <a href="tel:081229888033" className="hidden md:flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
              <Phone size={16} />
              <span>0812-2988-8033</span>
            </a>
            <Link to="/admin/login" className="hidden md:block text-white/70 hover:text-white transition-colors">
              <User size={20} />
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-white/70 hover:text-white transition-colors"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#4A7C3A] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button className="hidden md:block text-white/70 hover:text-white transition-colors">
              <Search size={20} />
            </button>
            <button
              className="lg:hidden text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#1E1A17]">
          <div className="flex justify-end p-5">
            <button onClick={() => setMobileMenuOpen(false)} className="text-white">
              <X size={28} />
            </button>
          </div>
          <div className="flex flex-col items-center gap-8 pt-10">
            {navLinks.map((link) => (
              <div key={link.path} className="text-center">
                <Link
                  to={link.path}
                  className="text-2xl text-white font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="mt-3 flex flex-col gap-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="text-sm text-white/60 hover:text-[#4A7C3A]"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
