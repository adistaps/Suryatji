import PageHeader from '@/components/layout/PageHeader';

const processSteps = [
  {
    title: 'Cultivate',
    desc: 'We grow our coffee trees in the rich volcanic soil at the foothills of Mount Sindoro.',
  },
  {
    title: 'Harvest',
    desc: 'Our farmers hand-pick only the ripest coffee cherries at the peak of flavor.',
  },
  {
    title: 'Roast',
    desc: 'Our master roasters carefully develop each batch to unlock its unique character.',
  },
  {
    title: 'Deliver',
    desc: 'We package and ship directly from our farm to ensure maximum freshness.',
  },
];

export default function About() {
  return (
    <div>
      <PageHeader
        title="About Us"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'About Us' }]}
        backgroundImage="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&h=400&fit=crop"
      />

      {/* Our Story */}
      <section className="bg-[#F5EFE6] py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&h=500&fit=crop"
                alt="Coffee plantation"
                className="w-full rounded-xl object-cover"
                style={{ aspectRatio: '7/5' }}
              />
            </div>
            <div>
              <p className="text-[#4A7C3A] text-xs font-medium uppercase tracking-wider mb-3">Our Story</p>
              <h2
                className="text-[#1E1A17] font-bold"
                style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
              >
                From Farm to Cup
              </h2>
              <p className="text-[#8B6F4E] mt-5 leading-relaxed">
                Suryatji Coffee was founded by Saryadi Suryatji with a passion for bringing the finest Indonesian 
                coffee from our farm directly to coffee lovers around the world. Located at Jl. Parakan - Wonosobo 
                Km.11, Kledung, Temanggung, our farm sits at the fertile foothills of Mount Sindoro.
              </p>
              <p className="text-[#8B6F4E] mt-4 leading-relaxed">
                We manage every step of the process — from cultivating and hand-picking the coffee cherries, 
                to processing, roasting, and packaging. This farm-to-cup approach ensures that every bag of 
                Suryatji Coffee delivers the authentic taste of Temanggung terroir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-5 text-center">
          <h2
            className="text-[#1E1A17] font-bold mb-14"
            style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
          >
            Our Process
          </h2>
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-[#4A7C3A]/20" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, i) => (
                <div key={i} className="relative">
                  <div className="w-16 h-16 rounded-full bg-[#4A7C3A] flex items-center justify-center mx-auto mb-5 relative z-10">
                    <span className="text-white font-bold text-lg">{i + 1}</span>
                  </div>
                  <h3 className="text-[#1E1A17] font-semibold text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {step.title}
                  </h3>
                  <p className="text-[#8B6F4E] text-sm mt-2 leading-relaxed max-w-[220px] mx-auto">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-[#F5EFE6] py-16 lg:py-24">
        <div className="max-w-[800px] mx-auto px-5 text-center">
          <h2
            className="text-[#1E1A17] font-bold mb-10"
            style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
          >
            Meet the Founder
          </h2>
          <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-6">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
              alt="Saryadi Suryatji"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-[#1E1A17] font-semibold text-xl" style={{ fontFamily: '"Playfair Display", serif' }}>
            Saryadi Suryatji
          </h3>
          <p className="text-[#4A7C3A] text-sm font-medium mt-1">Founder &amp; Head Roaster</p>
          <p className="text-[#8B6F4E] mt-4 leading-relaxed max-w-lg mx-auto">
            With over two decades of experience in coffee cultivation and roasting, Saryadi Suryatji 
            has dedicated his life to perfecting the art of Indonesian coffee. His passion for quality 
            and sustainability drives every decision at Suryatji Coffee.
          </p>
        </div>
      </section>
    </div>
  );
}
