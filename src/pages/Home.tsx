import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star, Check, Phone
} from 'lucide-react';
import { fetchProducts, fetchVariantsByProductId } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Product, ProductVariant } from '@/types';

gsap.registerPlugin(ScrollTrigger);

// Data untuk 4 kategori proses
const processSteps = [
  {
    num: '01',
    title: 'Arabica Green',
    desc: 'Biji kopi mentah Arabica pilihan yang dipanen langsung dari ketinggian lereng gunung.',
    img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=300&h=300&fit=crop'
  },
  {
    num: '02',
    title: 'Arabica Roasted',
    desc: 'Disangrai dengan tingkat kematangan presisi untuk memunculkan profil rasa yang kompleks.',
    img: '/images/pics2.webp'
  },
  {
    num: '03',
    title: 'Robusta Roasted',
    desc: 'Robusta murni dengan body yang tebal dan aroma kuat, cocok untuk penikmat kopi pekat.',
    img: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=300&h=300&fit=crop'
  },
  {
    num: '04',
    title: 'Mixed Sorts',
    desc: 'Blend khusus perpaduan Arabica dan Robusta untuk menciptakan harmoni rasa yang seimbang.',
    img: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=300&h=300&fit=crop'
  }
];

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [productVariants, setProductVariants] = useState<Record<string, ProductVariant[]>>({});
  const [productsLoading, setProductsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        const dbProducts = await fetchProducts();
        setDisplayProducts(dbProducts.slice(0, 5)); // 1 hero + 4 grid
        const variants: Record<string, ProductVariant[]> = {};
        await Promise.all(
          dbProducts.slice(0, 5).map(async (product) => {
            const vars = await fetchVariantsByProductId(product.id);
            variants[product.id] = vars;
          })
        );
        setProductVariants(variants);
      } catch (err) {
        console.error('[Home] Failed to load products from DB:', err);
      } finally {
        setProductsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div className="font-sans text-[#1E1A17] overflow-x-hidden bg-[#F9F8F4]">

      {/* ====== HERO SECTION ====== */}
      <section className="relative w-full bg-[#141414] text-white pt-36 pb-28 md:pt-56 md:pb-52 flex items-center justify-center min-h-[80vh] md:min-h-screen overflow-hidden">
        {/* Hero Content */}
        <div className="text-center relative z-10 px-5 max-w-2xl mx-auto">
          <h2 className="text-[#659A4B] text-xl md:text-4xl font-bold mb-2 tracking-tight">
            Kopi Asli
          </h2>
          <h1 className="text-3xl md:text-7xl font-black mb-5 tracking-tight uppercase leading-none">
            Suryatji Coffee
          </h1>
          <p className="max-w-xl mx-auto text-white/70 text-xs md:text-sm leading-relaxed tracking-wide">
            Menghadirkan cita rasa kopi murni dari dataran tinggi Temanggung. Diproses dengan dedikasi tinggi dari biji kopi pilihan untuk pengalaman ngopi terbaik Anda.
          </p>
        </div>

        {/* Background Coffee Beans Pattern */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&h=900&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#141414] to-transparent pointer-events-none z-0" />
      </section>

      {/* ====== GREEN OVERLAP & BIG BEANS ====== */}
      <section className="bg-[#3B662F] relative h-[120px] md:h-[240px]">
        {/* Biji Kopi Besar Overlapping */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-[120px] sm:-top-[220px] md:-top-[280px] z-20 w-[90%] sm:w-[70%] md:w-[800px] flex justify-center pointer-events-none select-none">
          <img
            src="/images/kopi.webp"
            alt="Giant Coffee Beans"
            className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)]"
          />
        </div>

        {/* Seamless Green Background Pattern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
            backgroundSize: '100px'
          }}
        />
      </section>

      {/* ====== EXCLUSIVE PLANTED COFFEE ====== */}
      <section ref={addToRefs} className="max-w-[1200px] mx-auto px-5 md:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <h3 className="text-[#4A7C3A] text-xl md:text-3xl font-bold mb-1">Arabica & Robusta</h3>
            <h2 className="text-2xl md:text-5xl font-extrabold mb-4 md:mb-6 tracking-tight text-[#1E1A17]">Kopi Pilihan Eksklusif</h2>
            <p className="text-[#666] leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
              Kami merawat perkebunan kopi kami dengan sepenuh hati di wilayah Kledung, Temanggung.
              Kombinasi iklim pegunungan yang ideal dan tanah vulkanis yang subur menghasilkan biji
              kopi berkualitas tinggi dengan profil rasa yang unik dan tak tertandingi.
            </p>

            <div className="space-y-3 mb-8 md:mb-10 font-bold">
              <a href="#" className="flex items-center gap-3 hover:text-[#4A7C3A] transition text-sm md:text-base">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-white shadow-md flex items-center justify-center text-[#4A7C3A] rounded flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                </div>
                Unduh Pricelist
              </a>
              <a href="tel:6281229888033" className="flex items-center gap-3 hover:text-[#4A7C3A] transition text-sm md:text-base">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-white shadow-md flex items-center justify-center text-[#4A7C3A] rounded flex-shrink-0">
                  <Phone size={18} />
                </div>
                +62 812-2988-8033
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link to="/about" className="bg-[#4A7C3A] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold hover:bg-[#3d6b2f] transition text-center text-sm md:text-base">Lebih Lanjut</Link>
              <Link to="/shop" className="bg-[#1A1A1A] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold hover:bg-black transition text-center text-sm md:text-base">Belanja Sekarang</Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative">
              {/* Gambar Petani dengan Bentuk Organik (Blob) */}
              <img
                src="/images/pics1.webp"
                alt="Petani Kopi"
                className="w-[280px] h-[320px] md:w-[450px] md:h-[500px] object-cover"
                style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
              />
              {/* Badge Since 2016 */}
              <div className="absolute top-4 -left-4 md:top-10 md:-left-12 w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-[#F9F8F4] z-10">
                <div className="border border-dashed border-[#4A7C3A] w-[80px] h-[80px] md:w-[110px] md:h-[110px] rounded-full flex flex-col items-center justify-center">
                  <span className="text-[10px] md:text-xs font-bold uppercase text-black">sejak</span>
                  <span className="text-[#4A7C3A] text-xl md:text-2xl font-extrabold leading-none">2016</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 4 PROCESS STEPS ====== */}
      <section ref={addToRefs} className="bg-[#F4EFE6] py-16 md:py-24 relative" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
            <h2 className="text-base md:text-2xl font-bold leading-snug">
              Dedikasi kami tercurah di setiap tahapan. Dari pemilihan benih, perawatan pohon, hingga
              pemanenan dan penyangraian. Semuanya dilakukan dengan <span className="text-[#4A7C3A]">standar kontrol mutu</span> yang ketat
              untuk memastikan kualitas tetap terjaga.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
            {processSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="relative mb-4 md:mb-6">
                  <img src={step.img} alt={step.title} className="w-28 h-28 md:w-48 md:h-48 rounded-full object-cover shadow-lg border-4 md:border-[6px] border-white" />
                  <div className="absolute top-1 -left-1 md:top-2 md:-left-2 w-7 h-7 md:w-10 md:h-10 bg-[#4A7C3A] text-white rounded-full flex items-center justify-center font-bold text-[10px] md:text-sm border-2 border-white">
                    {step.num}
                  </div>
                </div>
                <h4 className="text-sm md:text-lg font-extrabold mb-1 md:mb-3">{step.title}</h4>
                <p className="text-[#666] text-xs md:text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== DIVINE AROMA BANNER (3 Columns) ====== */}
      <section ref={addToRefs} className="w-full grid grid-cols-1 md:grid-cols-3 min-h-[300px] md:h-[600px]">
        {/* Left: Beans & Scoop */}
        <div className="bg-cover bg-center relative min-h-[250px] md:min-h-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=800&fit=crop)' }}>
          {/* Quality Stamp */}
          <div className="absolute top-6 right-6 md:top-10 md:right-10 w-20 h-20 md:w-24 md:h-24 border-2 border-white/50 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 border border-dashed border-white/50 rounded-full flex items-center justify-center">
              <span className="text-white text-[10px] md:text-xs text-center font-bold uppercase tracking-widest leading-tight w-12">Quality<br />Guar<br />antee</span>
            </div>
          </div>
        </div>

        {/* Middle: Green Text Box */}
        <div className="bg-[#4A7C3A] p-8 md:p-16 flex flex-col justify-center relative overflow-hidden text-white">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-6xl font-extrabold mb-4 md:mb-6 leading-[1.1] tracking-tight">
              Aroma<br />Murni<br />di Setiap<br />Cangkir
            </h2>
            <p className="text-white/80 mb-6 md:mb-10 max-w-sm text-sm md:text-base">
              Kami percaya bahwa secangkir kopi yang baik berawal dari proses yang jujur. Rasakan keotentikan aroma kopi Temanggung yang sesungguhnya.
            </p>
            <Link to="/about" className="inline-block bg-[#1A1A1A] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold hover:bg-black transition text-sm">
              Tentang Kami
            </Link>
          </div>
          {/* Sketsa Biji Kopi di Background */}
          <img src="https://cdn-icons-png.flaticon.com/512/3032/3032986.png" className="absolute -bottom-10 right-0 w-48 md:w-64 opacity-10 pointer-events-none" alt="" />
        </div>

        {/* Right: Woman Drinking Coffee */}
        <div className="bg-cover bg-center min-h-[250px] md:min-h-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&fit=crop)' }}>
        </div>
      </section>

      {/* ====== FEATURES WITH CENTER CUP ====== */}
      <section ref={addToRefs} className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6 relative">

          {/* Mobile: Stacked layout with cup on top */}
          <div className="flex flex-col lg:hidden items-center gap-8">
            {/* Cup Image */}
            <div className="w-[200px] h-[200px] relative flex justify-center items-center">
              <div className="w-[200px] h-[200px] bg-[#f9f9f9] rounded-full shadow-inner absolute inset-0 -z-10"></div>
              <img src="/images/cangkir.webp" alt="Cangkir Kopi" className="w-full" />
            </div>

            {/* Features Grid - 2 columns on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {[
                { title: 'Biji Kopi Murni', desc: 'Kami hanya menggunakan 100% biji kopi murni tanpa campuran untuk menjaga keaslian rasa.', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
                { title: 'Varian Beragam', desc: 'Tersedia dalam berbagai tingkat sangrai dan profil rasa menyesuaikan selera Anda.', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
                { title: 'Teknik Roasting Presisi', desc: 'Disangrai oleh roaster berpengalaman agar setiap batch mengeluarkan potensi rasa maksimalnya.', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg> },
                { title: 'Kualitas Premium', desc: 'Kopi yang disajikan telah melewati proses penyortiran ketat dari biji defect (cacat).', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> },
                { title: 'Gilingan Sesuai Kebutuhan', desc: 'Pilih tingkat kehalusan gilingan yang paling pas dengan metode seduh favorit Anda.', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg> },
                { title: 'Aroma Menggoda', desc: 'Packaging khusus kami menjaga aroma kopi agar tetap wangi dan segar hingga sampai ke tangan Anda.', icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg> },
              ].map((feature, i) => (
                <div key={i} className="flex gap-3 items-start bg-[#F9F8F4] rounded-xl p-4">
                  <div className="text-[#4A7C3A] flex-shrink-0 mt-0.5">{feature.icon}</div>
                  <div>
                    <h4 className="font-extrabold text-sm mb-1">{feature.title}</h4>
                    <p className="text-[#666] text-xs leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Original 3-column layout with cup in center */}
          <div className="hidden lg:flex items-center justify-between gap-10">
            {/* Left Features */}
            <div className="flex-1 space-y-16 text-right z-10">
              <div className="flex justify-end gap-5">
                <div>
                  <h4 className="font-extrabold text-lg">Biji Kopi Murni</h4>
                  <p className="text-[#666] text-sm mt-2 max-w-[250px]">Kami hanya menggunakan 100% biji kopi murni tanpa campuran untuk menjaga keaslian rasa.</p>
                </div>
                <div className="text-[#4A7C3A] w-10 flex-shrink-0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg></div>
              </div>
              <div className="flex justify-end gap-5">
                <div>
                  <h4 className="font-extrabold text-lg">Varian Beragam</h4>
                  <p className="text-[#666] text-sm mt-2 max-w-[250px]">Tersedia dalam berbagai tingkat sangrai (roast) dan profil rasa menyesuaikan selera Anda.</p>
                </div>
                <div className="text-[#4A7C3A] w-10 flex-shrink-0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div>
              </div>
              <div className="flex justify-end gap-5">
                <div>
                  <h4 className="font-extrabold text-lg">Teknik Roasting Presisi</h4>
                  <p className="text-[#666] text-sm mt-2 max-w-[250px]">Disangrai oleh roaster berpengalaman agar setiap batch mengeluarkan potensi rasa maksimalnya.</p>
                </div>
                <div className="text-[#4A7C3A] w-10 flex-shrink-0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg></div>
              </div>
            </div>

            {/* Center Cup */}
            <div className="w-[350px] h-[350px] flex-shrink-0 relative flex justify-center items-center z-0">
              <div className="w-[350px] h-[350px] bg-[#f9f9f9] rounded-full shadow-inner absolute inset-0 -z-10"></div>
              <img src="/images/cangkir.webp"
                alt="Cangkir Kopi" />

              {/* Floating Leaves & Beans (Simulated) */}
              <div className="absolute -top-4 -right-10 w-16 h-16 bg-[#4A7C3A] rounded-full opacity-10 blur-xl"></div>
              <div className="absolute -bottom-8 -left-10 w-20 h-20 bg-[#4A7C3A] rounded-full opacity-10 blur-xl"></div>
            </div>

            {/* Right Features */}
            <div className="flex-1 space-y-16 text-left z-10">
              <div className="flex justify-start gap-5">
                <div className="text-[#4A7C3A] w-10 flex-shrink-0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg></div>
                <div>
                  <h4 className="font-extrabold text-lg">Kualitas Premium</h4>
                  <p className="text-[#666] text-sm mt-2 max-w-[250px]">Kopi yang disajikan telah melewati proses penyortiran ketat dari biji defect (cacat).</p>
                </div>
              </div>
              <div className="flex justify-start gap-5">
                <div className="text-[#4A7C3A] w-10 flex-shrink-0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg></div>
                <div>
                  <h4 className="font-extrabold text-lg">Gilingan Sesuai Kebutuhan</h4>
                  <p className="text-[#666] text-sm mt-2 max-w-[250px]">Pilih tingkat kehalusan gilingan yang paling pas dengan metode seduh favorit Anda (Espresso, V60, dll).</p>
                </div>
              </div>
              <div className="flex justify-start gap-5">
                <div className="text-[#4A7C3A] w-10 flex-shrink-0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg></div>
                <div>
                  <h4 className="font-extrabold text-lg">Aroma Menggoda</h4>
                  <p className="text-[#666] text-sm mt-2 max-w-[250px]">Packaging khusus kami menjaga aroma kopi agar tetap wangi dan segar hingga sampai ke tangan Anda.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ====== VIDEO SECTION (BACKGROUND VIDEO ONLY) ====== */}
      <section
        ref={addToRefs}
        className="relative w-full flex flex-col items-center justify-center text-center overflow-hidden min-h-[50vh] md:min-h-[85vh]"
      >
        {/* Video Element sebagai Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/video.mp4" type="video/mp4" />
          {/* Fallback image jika video gagal dimuat */}
          <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&fit=crop" alt="Coffee Background" />
        </video>

        {/* Gelap / Overlay Kontras */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </section>

      {/* ====== STATS BANNER ====== */}
      <section className="bg-[#4A7C3A] relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600')] bg-cover mix-blend-multiply"></div>
        <div className="max-w-[1200px] mx-auto px-5 md:px-6 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center text-white">
          <div>
            <h3 className="text-3xl md:text-6xl font-extrabold mb-1 md:mb-2">37</h3>
            <p className="font-bold text-xs md:text-sm tracking-wide">Varietas Pilihan</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-6xl font-extrabold mb-1 md:mb-2">259</h3>
            <p className="font-bold text-xs md:text-sm tracking-wide">Hektar Perkebunan</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-6xl font-extrabold mb-1 md:mb-2">140</h3>
            <p className="font-bold text-xs md:text-sm tracking-wide">Petani Mitra</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-6xl font-extrabold mb-1 md:mb-2">15</h3>
            <p className="font-bold text-xs md:text-sm tracking-wide">Kota Distributor</p>
          </div>
        </div>
      </section>

      {/* ====== POPULAR PRODUCTS (FETCH FROM DB) ====== */}
      <section ref={addToRefs} className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-5 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-[#4A7C3A] text-xs font-bold uppercase tracking-widest mb-2 block">Toko Online</span>
            <h2 className="text-2xl md:text-5xl font-extrabold tracking-tight mb-3 md:mb-4">Produk Populer</h2>
            <p className="text-[#666] max-w-2xl mx-auto text-sm md:text-base">
              Temukan produk kopi unggulan dari Suryatji Coffee. Kualitas ekspor dengan rasa lokal yang khas.
            </p>
          </div>

          {/* Loading skeleton */}
          {productsLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-[#4A7C3A] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#666] text-sm">Memuat produk...</p>
            </div>
          )}

          {/* Featured Product (Top Large Card) - Index [0] dari Database */}
          {!productsLoading && displayProducts.length > 0 && (
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-14 md:mb-20">
              <div className="flex-1 relative flex justify-center">
                <img src={displayProducts[0].image} alt={displayProducts[0].name} className="w-[250px] md:w-[400px] h-auto drop-shadow-2xl z-10 object-contain" />
                <div className="absolute -left-10 top-1/4 w-32 h-32 bg-[url('https://cdn-icons-png.flaticon.com/512/3032/3032986.png')] opacity-20 bg-contain bg-no-repeat -z-0 hidden md:block"></div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex text-[#FFB800] mb-3 justify-center md:justify-start">
                  <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
                </div>
                <h3 className="text-2xl md:text-4xl font-extrabold mb-3 md:mb-4">{displayProducts[0].name}</h3>
                <p className="text-[#666] mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                  {displayProducts[0].description || 'Produk unggulan kami yang diproses dari biji kopi pilihan kualitas terbaik.'}
                </p>
                <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8 text-left mx-auto md:mx-0 max-w-[280px] md:max-w-none">
                  <li className="flex items-center gap-3 text-xs md:text-sm font-semibold"><Check size={16} className="text-[#4A7C3A] flex-shrink-0" /> 100% Kopi Murni</li>
                  <li className="flex items-center gap-3 text-xs md:text-sm font-semibold"><Check size={16} className="text-[#4A7C3A] flex-shrink-0" /> Cita Rasa Menggugah</li>
                  <li className="flex items-center gap-3 text-xs md:text-sm font-semibold"><Check size={16} className="text-[#4A7C3A] flex-shrink-0" /> Roasting Sempurna</li>
                  <li className="flex items-center gap-3 text-xs md:text-sm font-semibold"><Check size={16} className="text-[#4A7C3A] flex-shrink-0" /> Kualitas Premium</li>
                </ul>
                <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8 justify-center md:justify-start">
                  <span className="text-[#4A7C3A] text-2xl md:text-3xl font-extrabold">
                    {productVariants[displayProducts[0].id]?.[0]
                      ? `Rp ${productVariants[displayProducts[0].id][0].price.toLocaleString('id-ID')}`
                      : 'Hubungi kami'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
                  <button
                    onClick={() => addToCart(displayProducts[0], productVariants[displayProducts[0].id]?.[0], 1)}
                    disabled={!productVariants[displayProducts[0].id]?.[0]}
                    className="bg-[#4A7C3A] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold hover:bg-[#3d6b2f] transition disabled:opacity-50 text-sm md:text-base"
                  >
                    Masukkan Keranjang
                  </button>
                  <Link to={`/shop/${displayProducts[0].slug}`} className="bg-[#1A1A1A] text-white px-6 md:px-10 py-3 md:py-4 rounded-full font-bold hover:bg-black transition text-sm md:text-base text-center">
                    Detail Produk
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* 4 Small Products Grid - Index [1-4] dari Database */}
          {!productsLoading && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {displayProducts.slice(1, 5).map((product) => (
                <Link to={`/shop/${product.slug}`} key={product.id} className="bg-[#F9F8F4] p-4 md:p-6 text-center group cursor-pointer hover:shadow-lg transition block rounded-xl">
                  <div className="relative mb-4 md:mb-6 flex justify-center">
                    <img src={product.image} alt={product.name} className="w-28 h-32 md:w-48 md:h-56 object-contain group-hover:scale-105 transition duration-300" />
                    {product.isNew && (
                      <span className="absolute top-1 right-1 md:top-2 md:right-2 bg-[#4A7C3A] text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 md:py-1 rounded-full uppercase">Baru</span>
                    )}
                  </div>
                  <div className="flex justify-center text-[#FFB800] mb-1 md:mb-2">
                    <Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" /><Star size={10} fill="currentColor" />
                  </div>
                  <h4 className="font-extrabold text-xs md:text-sm mb-1 md:mb-2 line-clamp-2">{product.name}</h4>
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-[#4A7C3A] font-extrabold text-xs md:text-sm">
                      {productVariants[product.id]?.[0]
                        ? `Rp ${productVariants[product.id][0].price.toLocaleString('id-ID')}`
                        : '-'}
                    </span>
                  </div>
                </Link>
              ))}
              {displayProducts.length === 0 && (
                <div className="col-span-2 lg:col-span-4 text-center py-10 text-[#666]">
                  Belum ada produk. Tambahkan produk melalui <Link to="/admin/dashboard" className="text-[#4A7C3A] font-semibold">Admin Dashboard</Link>.
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-8 md:mt-12">
            <Link to="/shop" className="inline-block bg-[#4A7C3A] text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-bold hover:bg-[#3d6b2f] transition text-sm md:text-base">
              Lihat Semua Produk
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}