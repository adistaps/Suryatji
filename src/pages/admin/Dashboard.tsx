import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, ClipboardList, BarChart3, Wallet,
  Settings, LogOut, Search, Bell, ChevronLeft, ChevronRight,
  Eye, TrendingUp, Clock, AlertTriangle
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Package, label: 'Products', id: 'products' },
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

const recentOrders = [
  { id: 'SC-20250708-0001', customer: 'Budi Santoso', date: '2025-07-08', total: 52.98, status: 'pending' },
  { id: 'SC-20250707-0042', customer: 'Ani Wijaya', date: '2025-07-07', total: 17.99, status: 'waiting_confirmation' },
  { id: 'SC-20250707-0041', customer: 'Dedi Kurniawan', date: '2025-07-07', total: 32.98, status: 'paid' },
  { id: 'SC-20250706-0038', customer: 'Siti Rahayu', date: '2025-07-06', total: 25.00, status: 'shipped' },
  { id: 'SC-20250706-0037', customer: 'Ahmad Fauzi', date: '2025-07-06', total: 11.49, status: 'completed' },
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {stats.map((stat) => (
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
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-50">
                        <td className="py-3 text-sm font-medium text-[#1E1A17]">{order.id}</td>
                        <td className="py-3 text-sm text-[#8B6F4E]">{order.customer}</td>
                        <td className="py-3 text-sm text-[#8B6F4E]">{order.date}</td>
                        <td className="py-3 text-sm font-medium text-[#1E1A17]">${order.total.toFixed(2)}</td>
                        <td className="py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[order.status]}`}>
                            {statusLabels[order.status]}
                          </span>
                        </td>
                        <td className="py-3">
                          <button className="text-[#4A7C3A] hover:bg-[#D4E8CC] p-1.5 rounded transition-colors">
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-[#8B6F4E]">Showing 1-5 of 156 orders</p>
                <div className="flex gap-1">
                  <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-[#8B6F4E] hover:border-[#4A7C3A]">
                    <ChevronLeft size={14} />
                  </button>
                  <button className="w-8 h-8 rounded bg-[#4A7C3A] text-white flex items-center justify-center text-xs">1</button>
                  <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-[#8B6F4E] hover:border-[#4A7C3A]">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1E1A17]" style={{ fontFamily: '"Playfair Display", serif' }}>Products</h2>
              <button className="bg-[#4A7C3A] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#3d6b2f] transition-colors">
                + Add Product
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F9F6F1]">
                  <tr>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Product</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Category</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Price</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Stock</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Nicaragua 100% Arabica', cat: 'Arabica Green', price: 17.99, stock: 50 },
                    { name: 'Ethiopia Arabica', cat: 'Arabica Green', price: 16.99, stock: 40 },
                    { name: 'Colombia Organic', cat: 'Mixed Sorts', price: 25.00, stock: 25 },
                    { name: 'Ethiopia Robusta', cat: 'Robusta Roasted', price: 11.49, stock: 60 },
                    { name: 'Ethiopia Organic Mix', cat: 'Mixed Sorts', price: 13.49, stock: 55 },
                  ].map((p, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-3 px-5 text-sm font-medium text-[#1E1A17]">{p.name}</td>
                      <td className="py-3 px-5 text-sm text-[#8B6F4E]">{p.cat}</td>
                      <td className="py-3 px-5 text-sm font-medium text-[#4A7C3A]">${p.price.toFixed(2)}</td>
                      <td className="py-3 px-5 text-sm text-[#1E1A17]">{p.stock}</td>
                      <td className="py-3 px-5">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-[#1E1A17]" style={{ fontFamily: '"Playfair Display", serif' }}>Orders</h2>
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Pending', 'Waiting', 'Paid', 'Shipped', 'Completed', 'Cancelled'].map((tab) => (
                <button
                  key={tab}
                  className="px-4 py-2 rounded-full text-sm border border-gray-200 text-[#8B6F4E] hover:border-[#4A7C3A] hover:text-[#4A7C3A] transition-colors"
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F9F6F1]">
                  <tr>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Order #</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Customer</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Date</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Total</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-b border-gray-50">
                      <td className="py-3 px-5 text-sm font-medium">{o.id}</td>
                      <td className="py-3 px-5 text-sm text-[#8B6F4E]">{o.customer}</td>
                      <td className="py-3 px-5 text-sm text-[#8B6F4E]">{o.date}</td>
                      <td className="py-3 px-5 text-sm font-medium">${o.total.toFixed(2)}</td>
                      <td className="py-3 px-5">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[o.status]}`}>
                          {statusLabels[o.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'cashflow':
        return (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-[#1E1A17]" style={{ fontFamily: '"Playfair Display", serif' }}>Cashflow</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { title: 'Total Income', value: 'Rp 45.2M', color: 'text-green-600' },
                { title: 'Total Expenses', value: 'Rp 18.7M', color: 'text-red-600' },
                { title: 'Net Balance', value: 'Rp 26.5M', color: 'text-[#4A7C3A]' },
              ].map((s) => (
                <div key={s.title} className="bg-white rounded-xl shadow-sm p-5 text-center">
                  <p className="text-xs text-[#8B6F4E] uppercase tracking-wider">{s.title}</p>
                  <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1E1A17]">Expenses</h3>
                <button className="bg-[#4A7C3A] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#3d6b2f]">
                  + Add Expense
                </button>
              </div>
              <table className="w-full">
                <thead className="bg-[#F9F6F1]">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#8B6F4E] uppercase">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#8B6F4E] uppercase">Category</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#8B6F4E] uppercase">Description</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#8B6F4E] uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: '2025-07-07', cat: 'Bahan Baku', desc: 'Green beans purchase', amount: 3500000 },
                    { date: '2025-07-05', cat: 'Operasional', desc: 'Electricity bill', amount: 1200000 },
                    { date: '2025-07-03', cat: 'Marketing', desc: 'Social media ads', amount: 800000 },
                    { date: '2025-07-01', cat: 'Bahan Baku', desc: 'Packaging materials', amount: 950000 },
                  ].map((e, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-3 px-4 text-sm text-[#8B6F4E]">{e.date}</td>
                      <td className="py-3 px-4 text-sm text-[#1E1A17]">{e.cat}</td>
                      <td className="py-3 px-4 text-sm text-[#8B6F4E]">{e.desc}</td>
                      <td className="py-3 px-4 text-sm font-medium text-red-600">Rp {e.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

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
            <span className="text-white font-semibold" style={{ fontFamily: '"Playfair Display", serif' }}>
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
          <h2 className="text-[#1E1A17] font-semibold capitalize" style={{ fontFamily: '"Playfair Display", serif' }}>
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
