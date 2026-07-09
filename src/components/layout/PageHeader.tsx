import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  breadcrumbs: { label: string; path?: string }[];
  backgroundImage?: string;
}

export default function PageHeader({ title, breadcrumbs, backgroundImage = 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&h=400&fit=crop' }: PageHeaderProps) {
  return (
    <section
      className="relative h-[380px] md:h-[450px] flex items-center justify-center overflow-hidden pt-28 md:pt-32"
      style={{
        backgroundImage: `linear-gradient(rgba(30,26,23,0.7), rgba(30,26,23,0.85)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10 text-center px-5">
        <h1
          className="text-white font-bold mb-3"
          style={{
            fontFamily: '"Poppins", sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>
        <nav className="flex items-center justify-center gap-2 text-xs tracking-wider">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-white/40">//</span>}
              {crumb.path ? (
                <Link to={crumb.path} className="text-[#4A7C3A] hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white/70">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
