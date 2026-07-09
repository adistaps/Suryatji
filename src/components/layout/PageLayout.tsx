import { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '@/components/cart/CartDrawer';

interface PageLayoutProps {
  showFooter?: boolean;
}

export default function PageLayout({ showFooter = true }: PageLayoutProps) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      {/* pt-20 dihapus agar tidak ada ruang putih */}
      <main className="flex-1">
        <Outlet />
      </main>
      {showFooter && <Footer />}
      <CartDrawer />
    </div>
  );
}

