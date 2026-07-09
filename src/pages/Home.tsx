import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, Check, ArrowRight, Play, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { products, getVariantsByProductId } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const categoryCards = [
  {
    title: 'Arabica Green',
    desc: 'Fresh unroasted arabica beans with vibrant acidity and floral notes, perfect for home roasters.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C8.5 2 6 4.5 6 7c0 1.5.5 2.5 1.5 3.5S9 12 9 13.5c0 2-1 3.5-3 4.5v1.5c2.5 1 6 1.5 6 1.5s3.5-.5 6-1.5V18c-2-1-3-2.5-3-4.5 0-1.5.5-2.5 1.5-3.5S18 8.5 18 7c0-2.5-2.5-5-6-5zm0 2c2 0 3.5 1.5 3.5 3S14 10 12 10 8.5 8.5 8.5 7 10 4 12 4z" />
      </svg>
    ),
  },
  {
    title: 'Arabica Roasted',
    desc: 'Expertly roasted arabica with balanced sweetness, caramel undertones, and a clean finish.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
      </svg>
    ),
  },
  {
    title: 'Robusta Roasted',
    desc: 'Bold and full-bodied robusta with higher caffeine content, earthy flavor, and rich crema.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
        <path d="M8 12s1.5-2 4-2 4 2 4 2M9 15h6" />
      </svg>
    ),
  },
  {
    title: 'Mixed Blends',
    desc: 'Carefully crafted blends combining the best of arabica and robusta for a unique flavor profile.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v12M6 12h12" />
      </svg>
    ),
  },
];

const featureSections = [
  {
    title: 'Pure Grades',
    desc: 'We source only the highest-grade Arabica and Robusta beans from our own plantation and partner farms. Every batch is hand-sorted to ensure consistent quality and flavor excellence.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=600&h=450&fit=crop',
    bg: 'bg-[#F5EFE6]',
    imageLeft: true,
  },
  {
    title: 'Wide Assortment',
    desc: 'From single-origin Arabica to expertly crafted blends, our diverse range caters to every palate. Choose from green beans, roasted whole beans, or ground coffee in various profiles.',
    image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=600&h=450&fit=crop',
    bg: 'bg-white',
    imageLeft: false,
  },
  {
    title: 'Proper Roasting',
    desc: 'Our master roasters use state-of-the-art equipment combined with time-honored techniques. Each batch is carefully monitored to unlock the unique character hidden within every bean.',
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&h=450&fit=crop',
    bg: 'bg-[#F5EFE6]',
    imageLeft: true,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? 'text-[#4A7C3A] fill-[#4A7C3A]' : 'text-[#A89782]'}
        />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: typeof products[0] }) {
  const { addToCart } = useCart();
  const variants = getVariantsByProductId(product.id);
  const defaultVariant = variants[0];

  const handleAdd = () => {
    if (defaultVariant) {
      addToCart(product, defaultVariant, 1);
    }
  };

  const displayPrice = product.salePrice || (defaultVariant ? defaultVariant.price : 0);

  return (
    <div className="group bg-white rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <div className="relative aspect-square bg-[#F9F6F1] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
        />
        {product.salePrice && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            SALE
          </span>
        )}
      </div>
      <div className="p-5">
        <StarRating rating={product.rating} />
        <h3 className="text-[#1E1A17] font-semibold text-lg mt-2" style={{ fontFamily: '"Playfair Display", serif' }}>
          {product.name}
        </h3>
        <p className="text-[#8B6F4E] text-sm mt-1.5 line-clamp-2">{product.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {product.features.map((f, i) => (
            <span key={i} className="flex items-center gap-1 text-xs text-[#4A7C3A]">
              <Check size={12} className="text-[#4A7C3A]" />
              {f}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-4">
          <span className="text-[#4A7C3A] font-bold text-lg">${displayPrice.toFixed(2)}</span>
          {product.salePrice && defaultVariant && (
            <span className="text-[#A89782] line-through text-sm">${defaultVariant.price.toFixed(2)}</span>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleAdd}
            className="flex-1 bg-[#4A7C3A] text-white text-sm font-semibold py-2.5 rounded-full hover:bg-[#3d6b2f] transition-colors"
          >
            Add to cart
          </button>
          <Link
            to={`/shop/${product.slug}`}
            className="flex-1 border border-[#4A7C3A] text-[#4A7C3A] text-sm font-semibold py-2.5 rounded-full text-center hover:bg-[#4A7C3A] hover:text-white transition-colors"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(
        '.hero-title-line',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.2, delay: 0.3 }
      );
      gsap.fromTo(
        '.hero-tagline',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.8 }
      );
      gsap.fromTo(
        '.hero-btn',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1, delay: 1.0 }
      );
      gsap.fromTo(
        '.hero-img',
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out', delay: 0.5 }
      );

      // Section entrances
      sectionsRef.current.forEach((section) => {
        if (!section) return;
        const animItems = section.querySelectorAll('.anim-item');
        gsap.fromTo(
          animItems,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div>
      {/* ====== HERO ====== */}
      <section ref={heroRef} className="relative min-h-[100dvh] bg-[#1E1A17] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-5 pt-32 pb-20 min-h-[100dvh] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center w-full">
            {/* Left: Text */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <p
                className="hero-title-line text-[#4A7C3A] italic mb-2"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                }}
              >
                Natural
              </p>
              <h1
                className="hero-title-line text-white font-bold leading-[0.95]"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 'clamp(3rem, 7vw, 6rem)',
                  letterSpacing: '-0.03em',
                }}
              >
                Indonesian<br />Coffee
              </h1>
              <p className="hero-tagline text-white/70 mt-6 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Suryatji Coffee — Farm &amp; Roastery from the foothills of Mount Sindoro. 
                Premium coffee beans, roasted with passion.
              </p>
              <div className="flex gap-4 mt-8 justify-center lg:justify-start">
                <Link
                  to="/shop"
                  className="hero-btn inline-block bg-[#4A7C3A] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#3d6b2f] transition-all hover:scale-105"
                >
                  Shop Now
                </Link>
                <Link
                  to="/about"
                  className="hero-btn inline-block border border-white/40 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-all"
                >
                  Explore
                </Link>
              </div>
            </div>
            {/* Right: Image */}
            <div className="order-1 lg:order-2 relative">
              <img
                src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=700&fit=crop"
                alt="Coffee beans"
                className="hero-img w-full max-w-lg mx-auto lg:ml-auto rounded-lg object-cover"
                style={{ aspectRatio: '4/5' }}
              />
              {/* Floating leaf particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-8 h-8 opacity-20"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${10 + i * 18}%`,
                      animation: `float ${4 + i}s ease-in-out infinite`,
                      animationDelay: `${i * 0.8}s`,
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="#4A7C3A">
                      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Green accent bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#4A7C3A]" />

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
          }
        `}</style>
      </section>

      {/* ====== ABOUT BANNER ====== */}
      <section ref={addToRefs} className="bg-[#F5EFE6] py-20 lg:py-28">
        <div className="max-w-[1200px] mx-auto px-5 text-center">
          <div className="anim-item w-20 h-20 rounded-full bg-[#4A7C3A] flex items-center justify-center mx-auto mb-8">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.5 2 6 4.5 6 7c0 1.5.5 2.5 1.5 3.5S9 12 9 13.5c0 2-1 3.5-3 4.5v1.5c2.5 1 6 1.5 6 1.5s3.5-.5 6-1.5V18c-2-1-3-2.5-3-4.5 0-1.5.5-2.5 1.5-3.5S18 8.5 18 7c0-2.5-2.5-5-6-5zm0 2c2 0 3.5 1.5 3.5 3S14 10 12 10 8.5 8.5 8.5 7 10 4 12 4z" />
            </svg>
          </div>
          <h2
            className="anim-item text-[#1E1A17] font-bold"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              lineHeight: 1.1,
            }}
          >
            Natural Indonesian Coffee
          </h2>
          <p className="anim-item text-[#8B6F4E] mt-5 max-w-2xl mx-auto leading-relaxed">
            Suryatji Coffee is a farm &amp; roastery located at the foothills of Mount Sindoro, Kledung, Temanggung. 
            We cultivate and roast our own beans, delivering farm-fresh coffee directly to your cup.
          </p>
          <div className="anim-item grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 max-w-3xl mx-auto">
            {[
              { num: '37+', label: 'Selected Varieties' },
              { num: '259', label: 'Hectares of Plantations' },
              { num: '140+', label: 'Coffee Pickers' },
              { num: '75+', label: 'Consumer Countries' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="text-[#4A7C3A] font-bold"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                  }}
                >
                  {stat.num}
                </p>
                <p className="text-[#8B6F4E] text-xs mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TASTY PRODUCTS ====== */}
      <section ref={addToRefs} className="bg-white py-20 lg:py-28">
        <div className="max-w-[900px] mx-auto px-5">
          <div className="text-center mb-14">
            <h2
              className="anim-item text-[#1E1A17] font-bold"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                lineHeight: 1.1,
              }}
            >
              Tasty Products
            </h2>
            <p className="anim-item text-[#8B6F4E] mt-4 max-w-xl mx-auto">
              Explore our curated selection of premium coffee products — each one crafted with care from our farm in Temanggung.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categoryCards.map((card, i) => (
              <div key={i} className="anim-item text-center p-8 rounded-xl hover:bg-[#F9F6F1] transition-colors">
                <div className="w-16 h-16 rounded-full bg-[#4A7C3A] flex items-center justify-center mx-auto mb-5">
                  {card.icon}
                </div>
                <h3 className="text-[#1E1A17] font-semibold text-xl" style={{ fontFamily: '"Playfair Display", serif' }}>
                  {card.title}
                </h3>
                <p className="text-[#8B6F4E] text-sm mt-3 leading-relaxed max-w-xs mx-auto">{card.desc}</p>
                <Link to="/shop" className="inline-flex items-center gap-1 text-[#4A7C3A] text-sm font-medium mt-4 hover:underline">
                  Explore <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== DIVINE AROMA ====== */}
      <section ref={addToRefs} className="bg-[#1E1A17] py-20 lg:py-28 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="anim-item text-[#4A7C3A] font-bold leading-tight"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                }}
              >
                <em>Divine</em> Aroma<br />in Every Cup
              </h2>
              <p className="anim-item text-white/70 mt-6 leading-relaxed max-w-md">
                Our beans are carefully selected and roasted to bring out the divine aroma 
                that defines every cup of Suryatji Coffee. From farm to cup, we ensure the 
                highest quality at every step.
              </p>
              <Link
                to="/about"
                className="anim-item inline-flex items-center gap-1 text-[#4A7C3A] text-sm font-medium mt-6 hover:underline"
              >
                Read More <ArrowRight size={14} />
              </Link>
            </div>
            <div className="anim-item relative">
              <img
                src="https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=700&h=600&fit=crop"
                alt="Coffee beans close-up"
                className="w-full rounded-lg object-cover"
                style={{ aspectRatio: '7/6' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1E1A17]/60 to-transparent rounded-lg" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A7C3A]/30" />
      </section>

      {/* ====== FEATURE ROWS ====== */}
      {featureSections.map((section, i) => (
        <section key={i} ref={addToRefs} className={`${section.bg} py-16 lg:py-24`}>
          <div className="max-w-[1200px] mx-auto px-5">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${!section.imageLeft ? 'lg:flex-row-reverse' : ''}`}>
              {section.imageLeft ? (
                <>
                  <div className="anim-item">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full rounded-xl object-cover"
                      style={{ aspectRatio: '4/3' }}
                    />
                  </div>
                  <div className={`anim-item ${!section.imageLeft ? 'lg:order-1' : ''}`}>
                    <h3
                      className="text-[#1E1A17] font-semibold text-2xl"
                      style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                      {section.title}
                    </h3>
                    <p className="text-[#8B6F4E] mt-4 leading-relaxed">{section.desc}</p>
                    <Link to="/shop" className="inline-flex items-center gap-1 text-[#4A7C3A] text-sm font-medium mt-5 hover:underline">
                      {i === 0 ? 'Learn More' : i === 1 ? 'Explore' : 'Discover'} <ArrowRight size={14} />
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="anim-item lg:order-2">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full rounded-xl object-cover"
                      style={{ aspectRatio: '4/3' }}
                    />
                  </div>
                  <div className="anim-item lg:order-1">
                    <h3
                      className="text-[#1E1A17] font-semibold text-2xl"
                      style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                      {section.title}
                    </h3>
                    <p className="text-[#8B6F4E] mt-4 leading-relaxed">{section.desc}</p>
                    <Link to="/shop" className="inline-flex items-center gap-1 text-[#4A7C3A] text-sm font-medium mt-5 hover:underline">
                      Explore <ArrowRight size={14} />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* ====== PREPARE OUR BEANS ====== */}
      <section ref={addToRefs} className="bg-[#1E1A17] py-20 lg:py-28 relative overflow-hidden">
        <div className="h-1.5 bg-[#4A7C3A] w-full absolute top-0" />
        <div className="max-w-[1200px] mx-auto px-5 text-center relative z-10">
          <h2
            className="anim-item text-white font-bold"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              lineHeight: 1.1,
            }}
          >
            How we Prepare our Beans
          </h2>
          <p className="anim-item text-[#4A7C3A] font-semibold text-xl mt-3" style={{ fontFamily: '"Playfair Display", serif' }}>
            Watch Video
          </p>
          <button className="anim-item mt-8 w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto hover:bg-[#4A7C3A] hover:scale-105 transition-all group">
            <Play size={28} className="text-[#4A7C3A] group-hover:text-white ml-1 transition-colors" fill="currentColor" />
          </button>
          <Link
            to="/about"
            className="anim-item inline-flex items-center gap-1 text-[#4A7C3A] text-sm font-medium mt-8 hover:underline"
          >
            Read More <ArrowRight size={14} />
          </Link>
        </div>
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&h=800&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </section>

      {/* ====== POPULAR PRODUCTS ====== */}
      <section ref={addToRefs} className="bg-white py-20 lg:py-28">
        <div className="max-w-[1000px] mx-auto px-5">
          <div className="text-center mb-14">
            <p className="anim-item text-[#4A7C3A] text-xs font-medium uppercase tracking-wider mb-2">Online Store</p>
            <h2
              className="anim-item text-[#1E1A17] font-bold"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                lineHeight: 1.1,
              }}
            >
              Popular Products
            </h2>
            <p className="anim-item text-[#8B6F4E] mt-4 max-w-xl mx-auto">
              Discover our customers' favorite selections. Each product is carefully crafted and roasted to perfection.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="anim-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="anim-item text-center mt-10">
            <Link
              to="/shop"
              className="inline-block bg-[#4A7C3A] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#3d6b2f] transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIAL ====== */}
      <section ref={addToRefs} className="bg-[#F5EFE6] py-20 lg:py-28">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="anim-item">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&h=700&fit=crop"
                alt="Coffee farm"
                className="w-full rounded-xl object-cover"
                style={{ aspectRatio: '1/1' }}
              />
            </div>
            <div>
              <p className="anim-item text-[#4A7C3A] text-xs font-medium uppercase tracking-wider mb-4">Customer Testimonials</p>
              <blockquote
                className="anim-item text-[#1E1A17] italic font-bold leading-snug"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                }}
              >
                "The best coffee I've ever tasted. The aroma fills my kitchen every morning, and the flavor is consistently rich and smooth."
              </blockquote>
              <p className="anim-item text-[#8B6F4E] text-sm mt-6">— Sarah M., Jakarta</p>
              <div className="anim-item flex gap-2 mt-6">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[#4A7C3A]' : 'bg-[#A89782]'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== NEWSLETTER ====== */}
      <section ref={addToRefs} className="bg-[#1E1A17] py-20 lg:py-24">
        <div className="max-w-[600px] mx-auto px-5 text-center">
          <h2
            className="anim-item text-white font-bold"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              lineHeight: 1.1,
            }}
          >
            Stay Updated
          </h2>
          <p className="anim-item text-white/70 mt-4">
            Subscribe to receive updates on new roasts, farm stories, and exclusive offers.
          </p>
          <div className="anim-item flex gap-3 mt-8 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email ..."
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#4A7C3A] text-sm"
            />
            <button className="bg-[#4A7C3A] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#3d6b2f] transition-colors text-sm">
              Subscribe
            </button>
          </div>
          <label className="anim-item flex items-center justify-center gap-2 mt-4 cursor-pointer">
            <input type="checkbox" className="w-3.5 h-3.5 rounded border-white/30 accent-[#4A7C3A]" />
            <span className="text-white/50 text-xs">I have read and agree to the terms &amp; conditions</span>
          </label>
        </div>
      </section>

      {/* ====== CONTACT INFO CARDS (Mini) ====== */}
      <section ref={addToRefs} className="bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MapPin, title: 'Location', info: 'Jl. Parakan - Wonosobo Km.11, Kledung, Temanggung' },
              { icon: Phone, title: 'Phones', info: '0812-2988-8033' },
              { icon: Mail, title: 'Email', info: 'saryadisuryatji@gmail.com' },
              { icon: Clock, title: 'Working Hours', info: 'Mon - Sat: 08:00 - 17:00 WIB' },
            ].map((item, i) => (
              <div key={i} className="anim-item text-center p-6 rounded-xl hover:bg-[#F9F6F1] transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#4A7C3A] flex items-center justify-center mx-auto mb-4">
                  <item.icon size={20} className="text-white" />
                </div>
                <h4 className="text-[#1E1A17] font-semibold text-sm">{item.title}</h4>
                <p className="text-[#8B6F4E] text-xs mt-2 leading-relaxed">{item.info}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
