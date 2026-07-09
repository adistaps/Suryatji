import PageHeader from '@/components/layout/PageHeader';
import { Sprout, Hand, Flame, Truck, Quote } from 'lucide-react';

const processSteps = [
  {
    title: 'Cultivate',
    desc: 'We grow our coffee trees in the rich volcanic soil at the foothills of Mount Sindoro.',
    icon: Sprout,
  },
  {
    title: 'Harvest',
    desc: 'Our farmers hand-pick only the ripest coffee cherries at the peak of flavor.',
    icon: Hand,
  },
  {
    title: 'Roast',
    desc: 'Our master roasters carefully develop each batch to unlock its unique character.',
    icon: Flame,
  },
  {
    title: 'Deliver',
    desc: 'We package and ship directly from our farm to ensure maximum freshness.',
    icon: Truck,
  },
];

export default function About() {
  return (
    <div className="font-sans text-[#1E1A17] bg-white overflow-x-hidden">
      <PageHeader
        title="About Us"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'About Us' }]}
        backgroundImage="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&h=400&fit=crop"
      />

      {/* ====== OUR STORY ====== */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Box */}
            <div className="relative">
              {/* Frame aksen diubah menjadi garis border tipis agar lebih clean dan profesional */}
              <div className="absolute inset-0 border-2 border-gray-100 translate-x-4 translate-y-4 rounded-2xl hidden md:block z-0"></div>
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&fit=crop"
                alt="Coffee plantation"
                className="relative w-full rounded-2xl object-cover shadow-lg z-10"
                style={{ aspectRatio: '4/3' }}
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-xl z-20 hidden md:block border border-gray-50">
                <p className="text-4xl font-black text-[#4A7C3A] mb-1">20+</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Years of<br />Dedication</p>
              </div>
            </div>

            {/* Text Content */}
            <div className="lg:pl-8">
              <span className="flex items-center gap-3 text-[#4A7C3A] text-xs font-bold uppercase tracking-widest mb-4">
                <span className="w-8 h-[2px] bg-[#4A7C3A]"></span>
                Our Story
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-[#1E1A17]">
                From Farm to Cup
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                Suryatji Coffee was founded by Saryadi Suryatji with a passion for bringing the finest Indonesian
                coffee from our farm directly to coffee lovers around the world. Located at Jl. Parakan - Wonosobo
                Km.11, Kledung, Temanggung, our farm sits at the fertile foothills of Mount Sindoro.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                We manage every step of the process — from cultivating and hand-picking the coffee cherries,
                to processing, roasting, and packaging. This farm-to-cup approach ensures that every bag of
                Suryatji Coffee delivers the authentic taste of Temanggung terroir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== PROCESS STEPS ====== */}
      {/* Ditambahkan border-t border-gray-100 sebagai pemisah visual karena warna background sama */}
      <section className="bg-white py-24 lg:py-32 border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <span className="text-[#4A7C3A] text-xs font-bold uppercase tracking-widest mb-2 block">
            How We Work
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-20 tracking-tight">
            Our Process
          </h2>

          <div className="relative">
            {/* Connecting line (Desktop only) diperhalus */}
            <div className="hidden lg:block absolute top-[2.5rem] left-[12%] right-[12%] h-[1px] bg-gray-200" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {processSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="relative group cursor-default">
                    {/* Icon Circle */}
                    <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-gray-200 flex items-center justify-center mx-auto mb-8 relative z-10 group-hover:-translate-y-2 group-hover:border-[#4A7C3A] transition-all duration-300">
                      <Icon size={32} className="text-gray-400 group-hover:text-[#4A7C3A] transition-colors duration-300" />
                    </div>
                    {/* Text */}
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-gray-300 font-bold text-lg">0{i + 1}.</span>
                      <h3 className="text-xl font-bold text-[#1E1A17]">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-[240px] mx-auto">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ====== MEET THE FOUNDER ====== */}
      <section className="bg-white py-24 lg:py-32 border-t border-gray-100">
        <div className="max-w-[800px] mx-auto px-6 text-center relative z-10">
          <span className="text-[#4A7C3A] text-xs font-bold uppercase tracking-widest mb-2 block">
            The Visionary
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-12 tracking-tight">
            Meet the Founder
          </h2>

          <div className="relative w-48 h-48 mx-auto mb-8 group">
            {/* Frame outline yang clean */}
            <div className="absolute inset-0 rounded-full border border-gray-200 scale-110 opacity-50 transition-transform duration-500"></div>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
              alt="Saryadi Suryatji"
              className="w-full h-full rounded-full object-cover relative z-10 border-4 border-white shadow-lg"
            />
          </div>

          <h3 className="text-2xl font-bold text-[#1E1A17] mb-1">
            Saryadi Suryatji
          </h3>
          <p className="text-gray-500 font-medium mb-8 uppercase tracking-widest text-xs">
            Founder & Head Roaster
          </p>

          <div className="relative mt-10 px-8">
            <Quote size={32} className="absolute top-0 left-0 text-gray-100 -z-10 rotate-180" />
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-serif">
              "With over two decades of experience in coffee cultivation and roasting, I have
              dedicated my life to perfecting the art of Indonesian coffee. Quality
              and sustainability drive every decision we make at Suryatji Coffee."
            </p>
            <Quote size={32} className="absolute bottom-0 right-0 text-gray-100 -z-10" />
          </div>
        </div>
      </section>
    </div>
  );
}