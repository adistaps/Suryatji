import { useState } from 'react';
import { fetchSalesReport } from '@/lib/orders';

export default function AdminReports() {
  const today = new Date().toISOString().slice(0, 10);
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(today);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const runReport = async () => {
    setLoading(true);
    try {
      const data = await fetchSalesReport(startDate, `${endDate}T23:59:59`);
      setOrders(data);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const totalOrders = orders.length;

  const productSales: Record<string, { qty: number; revenue: number }> = {};
  orders.forEach((o) => {
    (o.order_items ?? []).forEach((item: any) => {
      const key = item.product_name_snapshot;
      if (!productSales[key]) productSales[key] = { qty: 0, revenue: 0 };
      productSales[key].qty += item.qty;
      productSales[key].revenue += item.qty * Number(item.price_snapshot);
    });
  });
  const topProducts = Object.entries(productSales).sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 10);

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#1E1A17]" style={{ fontFamily: '"Playfair Display", serif' }}>Reports</h2>

      <div className="bg-white rounded-xl shadow-sm p-5 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs text-[#8B6F4E] block mb-1">Dari Tanggal</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-[#8B6F4E] block mb-1">Sampai Tanggal</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>
        <button onClick={runReport} disabled={loading} className="bg-[#4A7C3A] text-white px-5 py-2.5 rounded-full text-sm font-semibold disabled:opacity-60">
          {loading ? 'Memuat...' : 'Tampilkan Laporan'}
        </button>
      </div>

      {hasSearched && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl shadow-sm p-5 text-center">
              <p className="text-xs text-[#8B6F4E] uppercase tracking-wider">Total Revenue</p>
              <p className="text-2xl font-bold text-[#4A7C3A] mt-1">Rp {totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5 text-center">
              <p className="text-xs text-[#8B6F4E] uppercase tracking-wider">Total Orders</p>
              <p className="text-2xl font-bold text-[#1E1A17] mt-1">{totalOrders}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-[#1E1A17] mb-4">Produk Terlaris (periode ini)</h3>
            {topProducts.length === 0 && <p className="text-sm text-[#8B6F4E]">Tidak ada penjualan pada periode ini.</p>}
            <div className="space-y-2">
              {topProducts.map(([name, s]) => (
                <div key={name} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                  <span className="text-[#1E1A17]">{name} <span className="text-[#8B6F4E]">x{s.qty}</span></span>
                  <span className="font-semibold text-[#4A7C3A]">Rp {s.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9F6F1]">
                <tr>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Order #</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Tanggal</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Status</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-gray-50">
                    <td className="py-3 px-5 text-sm font-medium">{o.order_number}</td>
                    <td className="py-3 px-5 text-sm text-[#8B6F4E]">{new Date(o.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="py-3 px-5 text-sm text-[#8B6F4E]">{o.status}</td>
                    <td className="py-3 px-5 text-sm font-medium">Rp {Number(o.total).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
