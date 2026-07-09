import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, ClipboardList, BarChart3, Wallet,
  Settings, LogOut, Search, Bell,
  Eye, TrendingUp, Clock, AlertTriangle, Tag
} from 'lucide-react';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminCashflow from './AdminCashflow';
import AdminReports from './AdminReports';
import AdminSettings from './AdminSettings';
import AdminCategories from './AdminCategories';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Package, label: 'Products', id: 'products' },
  { icon: Tag, label: 'Categories', id: 'categories' },
  { icon: ClipboardList, label: 'Orders', id: 'orders' },
  { icon: BarChart3, label: 'Reports', id: 'reports' },
  { icon: Wallet, label: 'Cashflow', id: 'cashflow' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

const stats = [
  { title: 'Total Revenue', value: 'Rp 12.5M', change: '+12%', icon: TrendingUp, color: 'bg-green-100 text-green-700' },
  { title: 'Total Orders', value: '156', change: '+8%', icon: ClipboardList, color: 'bg-blue-100 text-blue-700' },
  { title: 'Pending Orders', value: '23', change: 'Needs attention', icon: Clock, color: 'bg-orange-100 text-orange-700' },
  { title: 'Low Stock', value: '5', change: 'Products', icon: AlertTriangle, color: 'bg-red-100 text-red-700' },
];

const statusStyles: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700',
  waiting_confirmation: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  shipped: 'bg-blue-100 text-blue-700',
  completed: 'bg-[#D4E8CC] text-[#4A7C3A]',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  waiting_confirmation: 'Waiting',
  paid: 'Paid',
  shipped: 'Shipped',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const monthlySales = [
  { month: 'Jan', revenue: 8500000 },
  { month: 'Feb', revenue: 9200000 },
  { month: 'Mar', revenue: 7800000 },
  { month: 'Apr', revenue: 10500000 },
  { month: 'May', revenue: 11200000 },
  { month: 'Jun', revenue: 12500000 },
  { month: 'Jul', revenue: 9800000 },
];

const topProducts = [
  { name: 'Ethiopia Arabica', sold: 45, revenue: 764550 },
  { name: 'Colombia Organic', sold: 32, revenue: 800000 },
  { name: 'Nicaragua 100%', sold: 28, revenue: 503720 },
  { name: 'Ethiopia Organic Mix', sold: 25, revenue: 337250 },
  { name: 'Ethiopia Robusta', sold: 22, revenue: 252780 },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [overviewStats, setOverviewStats] = useState<typeof stats>(stats);
  const [overviewOrders, setOverviewOrders] = useState<any[]>([]);

  useEffect(() => {
    const loadOverview = async () => {
      const [{ count: totalOrders }, { count: pendingOrders }, { data: revenueRows }, { data: recent }, { data: lowStock }] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('total').in('status', ['paid', 'shipped', 'completed']),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('product_variants').select('id').lt('stock', 10),
      ]);

      const totalRevenue = (revenueRows ?? []).reduce((sum, r) => sum + Number(r.total), 0);

      setOverviewStats([
        { title: 'Total Revenue', value: `Rp ${(totalRevenue / 1000000).toFixed(1)}M`, change: '', icon: TrendingUp, color: 'bg-green-100 text-green-700' },
        { title: 'Total Orders', value: String(totalOrders ?? 0), change: '', icon: ClipboardList, color: 'bg-blue-100 text-blue-700' },
        { title: 'Pending Orders', value: String(pendingOrders ?? 0), change: 'Needs attention', icon: Clock, color: 'bg-orange-100 text-orange-700' },
        { title: 'Low Stock', value: String(lowStock?.length ?? 0), change: 'Products', icon: AlertTriangle, color: 'bg-red-100 text-red-700' },
      ]);
      setOverviewOrders(recent ?? []);
    };
    loadOverview();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {overviewStats.map((stat) => (
                <div key={stat.title} className="bg-white rounded-xl shadow-sm p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#8B6F4E] uppercase tracking-wider">{stat.title}</p>
                      <p className="text-2xl font-bold text-[#1E1A17] mt-1">{stat.value}</p>
                      <p className="text-xs text-[#4A7C3A] mt-1">{stat.change}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Sales Chart */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
                <h3 className="font-semibold text-[#1E1A17] mb-4">Monthly Revenue</h3>
                <div className="flex items-end gap-3 h-48">
                  {monthlySales.map((m) => {
                    const max = Math.max(...monthlySales.map(s => s.revenue));
                    const height = (m.revenue / max) * 100;
                    return (
                      <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-[#4A7C3A] rounded-t-sm hover:bg-[#3d6b2f] transition-colors relative group"
                          style={{ height: `${height}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1E1A17] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Rp {(m.revenue / 1000000).toFixed(1)}M
                          </div>
                        </div>
                        <span className="text-xs text-[#8B6F4E]">{m.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="font-semibold text-[#1E1A17] mb-4">Top Products</h3>
                <div className="space-y-3">
                  {topProducts.map((p, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#F5EFE6] flex items-center justify-center text-xs font-bold text-[#8B6F4E]">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-[#1E1A17]">{p.name}</p>
                          <p className="text-xs text-[#8B6F4E]">{p.sold} sold</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[#4A7C3A]">Rp {p.revenue.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-[#1E1A17] mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 text-xs font-semibold text-[#8B6F4E] uppercase">Order ID</th>
                      <th className="text-left py-3 text-xs font-semibold text-[#8B6F4E] uppercase">Customer</th>
                      <th className="text-left py-3 text-xs font-semibold text-[#8B6F4E] uppercase">Date</th>
                      <th className="text-left py-3 text-xs font-semibold text-[#8B6F4E] uppercase">Total</th>
                      <th className="text-left py-3 text-xs font-semibold text-[#8B6F4E] uppercase">Status</th>
                      <th className="text-left py-3 text-xs font-semibold text-[#8B6F4E] uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overviewOrders.length === 0 && (
                      <tr><td colSpan={6} className="py-6 text-center text-sm text-[#8B6F4E]">Belum ada order.</td></tr>
                    )}
                    {overviewOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-50">
                        <td className="py-3 text-sm font-medium text-[#1E1A17]">{order.order_number}</td>
                        <td className="py-3 text-sm text-[#8B6F4E]">{order.customer_name}</td>
                        <td className="py-3 text-sm text-[#8B6F4E]">{new Date(order.created_at).toLocaleDateString('id-ID')}</td>
                        <td className="py-3 text-sm font-medium text-[#1E1A17]">Rp {Number(order.total).toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[order.status] ?? ''}`}>
                            {statusLabels[order.status] ?? order.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <button onClick={() => setActiveTab('orders')} className="text-[#4A7C3A] hover:bg-[#D4E8CC] p-1.5 rounded transition-colors">
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'products':
        return <AdminProducts />;

      case 'categories':
        return <AdminCategories />;

      case 'orders':
        return <AdminOrders />;

      case 'cashflow':
        return <AdminCashflow />;

      case 'reports':
        return <AdminReports />;

      case 'settings':
        return <AdminSettings />;

      default:
        return (
          <div className="text-center py-20">
            <p className="text-[#8B6F4E]">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#1E1A17] transition-all duration-300 ${
          sidebarOpen ? 'w-[260px]' : 'w-0 lg:w-[260px]'
        } overflow-hidden`}
      >
        <div className="p-5 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-full bg-[#4A7C3A] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C8.5 2 6 4.5 6 7c0 1.5.5 2.5 1.5 3.5S9 12 9 13.5c0 2-1 3.5-3 4.5v1.5c2.5 1 6 1.5 6 1.5s3.5-.5 6-1.5V18c-2-1-3-2.5-3-4.5 0-1.5.5-2.5 1.5-3.5S18 8.5 18 7c0-2.5-2.5-5-6-5zm0 2c2 0 3.5 1.5 3.5 3S14 10 12 10 8.5 8.5 8.5 7 10 4 12 4z" />
              </svg>
            </div>
            <span className="text-white font-semibold" style={{ fontFamily: '"Poppins", sans-serif' }}>
              Suryatji Admin
            </span>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  activeTab === item.id
                    ? 'text-white bg-white/10 border-l-2 border-[#4A7C3A]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-[#4A7C3A] flex items-center justify-center text-white text-xs font-bold">
                SS
              </div>
              <div>
                <p className="text-white text-sm font-medium">Saryadi Suryatji</p>
                <p className="text-white/40 text-xs">Admin</p>
              </div>
            </div>
            <Link
              to="/"
              className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white text-sm transition-colors"
            >
              <LogOut size={18} />
              Logout
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-5 lg:px-8">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-[#1E1A17]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <h2 className="text-[#1E1A17] font-semibold capitalize" style={{ fontFamily: '"Poppins", sans-serif' }}>
            {activeTab}
          </h2>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-[#F9F6F1] rounded-full px-4 py-1.5">
              <Search size={16} className="text-[#8B6F4E]" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm ml-2 focus:outline-none w-40"
              />
            </div>
            <button className="relative text-[#8B6F4E] hover:text-[#1E1A17]">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#4A7C3A] flex items-center justify-center text-white text-xs font-bold">
              SS
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-5 lg:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
