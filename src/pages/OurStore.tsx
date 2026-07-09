import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Leaf, Coffee, Award, ShieldCheck, Play, Utensils, Star } from 'lucide-react';
import { fetchProducts, fetchVariantsByProductId } from '@/lib/products';
import type { Product, ProductVariant } from '@/types';

// Kategori dummy di atas
const categories = [
  { name: 'Kopi Tubruk', img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=200&h=200&fit=crop' },
  { name: 'Espresso Based', img: 'images/pics2.webp' },
  { name: 'Biji Kopi Roasting', img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=200&h=200&fit=crop' },
  { name: 'Snack & Pastry', img: 'images/pic4.webp' },
];

const menuItems = [
  { name: 'Kopi Luwak Arabica', desc: 'Biji luwak liar pilihan, proses alami.', price: '35', type: 'Coffee' },
  { name: 'Robusta Temanggung', desc: 'Cita rasa khas dengan body tebal.', price: '8', type: 'Coffee' },
  { name: 'Fullwash Sindoro', desc: 'Arabica clean dengan acidity seimbang.', price: '10', type: 'Coffee' },
  { name: 'V60 Manual Brew', desc: 'Metode seduh manual untuk aroma maksimal.', price: '17', type: 'Coffee' },
  { name: 'Es Kopi Susu Gula Aren', desc: 'Espresso, susu segar, dan aren alami.', price: '17', type: 'Specialties' },
  { name: 'Vietnam Drip', desc: 'Kopi tetes klasik dengan susu kental manis.', price: '15', type: 'Specialties' },
  { name: 'Croissant', desc: 'Pastri mentega yang renyah dan berlapis.', price: '20', type: 'Snacks' },
  { name: 'Roti Bakar', desc: 'Pendamping setia secangkir kopi panas.', price: '15', type: 'Snacks' },
];

export default function OurStore() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [productVariants, setProductVariants] = useState<Record<string, ProductVariant[]>>({});
  const [loading, setLoading] = useState(true);

  const menuSectionRef = useRef<HTMLDivElement>(null);

  const menuTabs = ['All', 'Coffee', 'Specialties', 'Snacks'];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();
        // Ambil 4 produk pertama untuk section "Shop Now / Take With You"
        const selectedProducts = products.slice(0, 4);
        setDbProducts(selectedProducts);

        const variants: Record<string, ProductVariant[]> = {};
        await Promise.all(
          selectedProducts.map(async (prod) => {
            const vars = await fetchVariantsByProductId(prod.id);
            variants[prod.id] = vars;
          })
        );
        setProductVariants(variants);
      } catch (error) {
        console.error('Failed to load products in OurStore:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const scrollToMenu = () => {
    if (menuSectionRef.current) {
      menuSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredMenu = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.type === activeCategory);

  return (
    <div className="font-sans text-[#1E1A17] bg-[#FDFBF7] min-h-screen">

      {/* 0. HERO SECTION */}
      <header className="relative w-full h-[600px] lg:h-[800px] flex flex-col justify-center items-center overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1600&fit=crop"
            alt="Coffee Shop Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-5 max-w-4xl mx-auto pt-24">
          <h3 className="text-[#4A7C3A] text-sm md:text-lg font-bold tracking-[0.3em] uppercase mb-4">
            Rich Taste
          </h3>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 tracking-tight drop-shadow-xl">
            Great Aroma
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed mb-10">
            Dapatkan pengalaman ngopi tak terlupakan dengan biji kopi pilihan terbaik langsung dari dataran tinggi Temanggung. Dirawat sepenuh hati, diseduh untuk menemani hari Anda.
          </p>
          <button
            onClick={scrollToMenu}
            className="bg-[#4A7C3A] hover:bg-[#3b662f] text-white px-10 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Lihat Menu
          </button>
        </div>
      </header>

      {/* 1. TASTY PRODUCTS (Kategori) */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <p className="text-[#4A7C3A] text-xs font-bold uppercase tracking-widest mb-2">Kategori Kami</p>
          <h2 className="text-4xl font-extrabold mb-12">Produk Pilihan</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
              <div key={i} className="flex flex-col items-center group cursor-default">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-transparent group-hover:border-[#4A7C3A] transition-all duration-300">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-bold text-[#1E1A17]">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-2 max-w-[150px]">Pilihan varian terbaik dari kebun kami.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. DARK BANNER PROMO - DENGAN PESAN SEKARANG DAN LIHAT SELENGKAPNYA DIHAPUS */}
      <section className="relative bg-[#1A1A1A] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600')] bg-cover bg-center"></div>

        <div className="max-w-6xl mx-auto px-5 relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
              <span className="text-[#4A7C3A]">Roasted Coffee</span><br />
              for Your Mood
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed">
              Nikmati secangkir kopi murni langsung dari dataran tinggi Sindoro-Sumbing. Diproses dengan dedikasi untuk menciptakan aroma dan rasa yang sempurna untuk menemani hari Anda.
            </p>
          </div>

          <div className="hidden md:block relative h-[450px]">
            <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=400&fit=crop" alt="Coffee Beans 1" className="absolute top-0 right-10 w-72 h-72 object-cover rounded-full border-8 border-[#1A1A1A] shadow-2xl z-20" />
            <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&fit=crop" alt="Coffee Beans 2" className="absolute bottom-0 right-32 w-60 h-60 object-cover rounded-full border-8 border-[#1A1A1A] shadow-xl z-10" />
          </div>
        </div>
      </section>

      {/* 3. GREEN FEATURES BAR */}
      <section className="bg-[#4A7C3A] py-16">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center text-white">
            <div className="flex flex-col items-center">
              <Award size={40} className="mb-4 opacity-90" />
              <h4 className="font-bold text-sm tracking-wide">Premium Quality</h4>
            </div>
            <div className="flex flex-col items-center">
              <Leaf size={40} className="mb-4 opacity-90" />
              <h4 className="font-bold text-sm tracking-wide">100% Asli Nusantara</h4>
            </div>
            <div className="flex flex-col items-center">
              <Coffee size={40} className="mb-4 opacity-90" />
              <h4 className="font-bold text-sm tracking-wide">Freshly Roasted</h4>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck size={40} className="mb-4 opacity-90" />
              <h4 className="font-bold text-sm tracking-wide">Standar Higienis</h4>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MENU SECTION (COFFEE HOUSE) - FIXED HEIGHT TO PREVENT JUMP */}
      <section ref={menuSectionRef} className="py-24 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-16">
            <p className="text-[#4A7C3A] text-xs font-bold uppercase tracking-widest mb-2">Our Menu</p>
            <h2 className="text-4xl font-extrabold text-[#1E1A17]">Coffee House</h2>

            {/* Menu Filters */}
            <div className="flex flex-wrap justify-center gap-8 mt-10 text-sm font-bold text-gray-400 uppercase tracking-wide">
              {menuTabs.map((tab) => (
                <span
                  key={tab}
                  onClick={() => setActiveCategory(tab)}
                  className={`cursor-pointer transition-colors ${activeCategory === tab
                    ? 'text-[#4A7C3A] border-b-2 border-[#4A7C3A] pb-1'
                    : 'hover:text-[#4A7C3A]'
                    }`}
                >
                  {tab}
                </span>
              ))}
            </div>
          </div>

          {/* Menetapkan min-height tetap agar section tidak mengecil/melompat saat menu di-filter */}
          <div className="min-h-[420px] lg:min-h-[220px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10">
              {filteredMenu.map((item, index) => (
                <div key={index} className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center text-[#4A7C3A] shrink-0 shadow-sm">
                    {item.type === 'Snacks' ? <Utensils size={28} /> : <Coffee size={28} />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-baseline w-full mb-1">
                      <h3 className="font-bold text-lg text-[#1E1A17]">{item.name}</h3>
                      <div className="flex-1 border-b border-dotted border-gray-400 mx-3 relative -top-1 opacity-50"></div>
                      <span className="font-black text-[#4A7C3A] text-xl">{item.price}<span className="text-xs ml-0.5">K</span></span>
                    </div>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. BENTO GRID - BUTTON BUKA MAPS MENGARAHKAN KE CONTACT */}
      <section className="w-full py-10 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 w-full h-auto md:h-[600px]">

          <div className="col-span-1 md:row-span-2 relative group overflow-hidden bg-black h-[400px] md:h-full">
            <img src="images/pics2.webp" alt="Roaster" className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" />
            <button className="w-16 h-16 bg-transparent border-2 border-white rounded-full flex justify-center items-center text-white hover:bg-white hover:text-black transition-colors">
              <Play size={24} className="ml-1" />
            </button>
          </div>

          <div className="col-span-1 row-span-1 bg-[#F5EFE6] p-10 lg:p-16 flex flex-col justify-center">
            <h4 className="text-[#4A7C3A] text-xl font-extrabold mb-6">Jam Operasional</h4>
            <ul className="space-y-4 text-sm font-medium w-full max-w-sm">
              <li className="flex justify-between border-b border-gray-300 pb-3">
                <span className="text-gray-600">Senin - Sabtu</span> <span className="font-bold text-gray-900">08:00 - 17:00</span>
              </li>
              <li className="flex justify-between border-b border-gray-300 pb-3">
                <span className="text-gray-600">Minggu</span> <span className="font-bold text-[#4A7C3A]">Tutup</span>
              </li>
              <li className="flex justify-between pt-2 text-xs text-gray-500">
                *Libur nasional tetap buka.
              </li>
            </ul>
          </div>

          <div className="col-span-1 row-span-1 bg-[#4A7C3A] p-10 lg:p-16 flex flex-col justify-center text-white">
            <h4 className="text-xl font-extrabold mb-4">Hubungi Kami</h4>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              Suryatji Coffee Farm & Roastery<br />
              Jl. Parakan - Wonosobo Km.11, Kledung
            </p>
            <a href="tel:081229888033" className="flex items-center gap-3 mb-6 hover:text-[#D1E2C4] transition-colors">
              <Phone size={20} /> <span className="font-bold tracking-wide">0812-2988-8033</span>
            </a>
            <Link to="/contact" className="bg-[#1A1A1A] hover:bg-black text-white py-3 px-8 rounded-full text-sm font-bold self-start transition-colors text-center">
              Buka Maps
            </Link>
          </div>

          <div className="col-span-1 row-span-1 bg-[#2A3626] relative overflow-hidden group">
            <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&fit=crop" alt="Beans" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 text-white z-10">
              <h4 className="text-2xl font-extrabold mb-2">Kopi Asli Temanggung</h4>
              <p className="text-sm text-gray-300">Kualitas Export, Harga Lokal.</p>
            </div>
          </div>

          <div className="col-span-1 row-span-1 relative group overflow-hidden">
            <img src="images/pics3.webp" alt="Brewing" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>

        </div>
      </section>

      {/* 6. TAKE WITH YOU (Shop Now) - FETCHED DYNAMICALLY FROM SUPABASE DB & ALIGNED GRID */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-16">
            <p className="text-[#4A7C3A] text-xs font-bold uppercase tracking-widest mb-2">Shop Now</p>
            <h2 className="text-4xl font-extrabold mb-4">Take With You</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">Tersedia kemasan retail untuk diseduh sendiri di rumah. Hadirkan cita rasa kopi cafe di ruang keluarga Anda.</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-[#4A7C3A] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm">Memuat produk...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {dbProducts.map((product) => {
                const defaultVariant = productVariants[product.id]?.[0];
                const displayPrice = product.salePrice || (defaultVariant ? defaultVariant.price : 0);

                return (
                  <Link
                    to={`/shop/${product.slug}`}
                    key={product.id}
                    className="flex flex-col items-center group text-center cursor-pointer"
                  >
                    <div className="bg-[#F9F6F1] w-full p-6 rounded-xl mb-6 flex justify-center items-center relative h-72 border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-32 h-44 object-contain group-hover:-translate-y-2 transition-transform duration-300 z-10"
                      />
                      {product.salePrice && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full z-10">
                          SALE
                        </div>
                      )}
                    </div>
                    <div className="flex text-[#FFB800] mb-2 text-xs justify-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          className={s <= product.rating ? 'fill-[#FFB800] text-[#FFB800]' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <h3 className="font-bold text-[#1E1A17] text-base mb-1 group-hover:text-[#4A7C3A] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="font-black text-gray-800 text-sm">
                      Rp {Math.round(displayPrice).toLocaleString('id-ID')}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="text-center mt-16">
            <Link
              to="/shop"
              className="inline-block bg-[#4A7C3A] text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#3b662f] transition-colors shadow-lg"
            >
              Lihat Semua Produk
            </Link>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIAL (Our Clients Say) */}
      <section className="py-28 bg-[#111111] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600')] bg-cover bg-fixed"></div>
        <div className="max-w-4xl mx-auto px-5 relative z-10 text-center text-white">
          <p className="text-[#4A7C3A] text-xs font-bold uppercase tracking-widest mb-2">Testimonials</p>
          <h2 className="text-4xl font-extrabold mb-12">Our Clients Say</h2>

          <div className="text-[#4A7C3A] text-6xl font-serif mb-6 leading-none">"</div>
          <p className="text-xl md:text-3xl font-serif italic mb-12 leading-relaxed text-gray-300">
            Kopi Robusta Temanggung dari Suryatji benar-benar punya body yang tebal dan aroma yang khas. Sangat cocok dijadikan bahan dasar es kopi susu di kedai saya. Kualitasnya selalu konsisten!
          </p>

          <div className="flex flex-col items-center">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" alt="Client Avatar" className="w-16 h-16 rounded-full border-2 border-[#4A7C3A] object-cover mb-4" />
            <h4 className="font-bold text-lg tracking-wide">Budi Santoso</h4>
            <p className="text-xs text-[#4A7C3A] uppercase font-bold tracking-widest mt-1">Pemilik Kedai Kopi</p>
          </div>
        </div>
      </section>

    </div>
  );
}