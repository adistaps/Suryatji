import { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';
import { fetchOrders, fetchOrderDetail, updateOrderStatus } from '@/lib/orders';
import type { OrderStatus } from '@/types';

const statusStyles: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700',
  waiting_confirmation: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  shipped: 'bg-blue-100 text-blue-700',
  completed: 'bg-[#D4E8CC] text-[#4A7C3A]',
  cancelled: 'bg-red-100 text-red-700',
};

const statusOptions: OrderStatus[] = ['pending', 'waiting_confirmation', 'paid', 'shipped', 'completed', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | undefined>(undefined);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ order: any; items: any[]; proofs: any[] } | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders(filterStatus);
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, [filterStatus]);

  const openDetail = async (orderId: string) => {
    setSelectedOrderId(orderId);
    const d = await fetchOrderDetail(orderId);
    setDetail(d);
  };

  const closeDetail = () => {
    setSelectedOrderId(null);
    setDetail(null);
  };

  const handleStatusChange = async (status: OrderStatus) => {
    if (!selectedOrderId) return;
    setUpdating(true);
    try {
      await updateOrderStatus(selectedOrderId, status);
      setDetail(d => d ? { ...d, order: { ...d.order, status } } : d);
      await loadOrders();
    } finally {
      setUpdating(false);
    }
  };

  const filters: { label: string; value: OrderStatus | undefined }[] = [
    { label: 'All', value: undefined },
    { label: 'Pending', value: 'pending' },
    { label: 'Waiting', value: 'waiting_confirmation' },
    { label: 'Paid', value: 'paid' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#1E1A17]" style={{ fontFamily: '"Poppins", sans-serif' }}>Orders</h2>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilterStatus(f.value)}
            className={`px-4 py-2 rounded-full text-sm border transition-colors ${
              filterStatus === f.value ? 'bg-[#4A7C3A] text-white border-[#4A7C3A]' : 'border-gray-200 text-[#8B6F4E] hover:border-[#4A7C3A] hover:text-[#4A7C3A]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F9F6F1]">
            <tr>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Order #</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Customer</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Date</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Total</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Status</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="py-6 text-center text-sm text-[#8B6F4E]">Memuat...</td></tr>}
            {!loading && orders.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-sm text-[#8B6F4E]">Belum ada order.</td></tr>}
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-gray-50">
                <td className="py-3 px-5 text-sm font-medium">{o.order_number}</td>
                <td className="py-3 px-5 text-sm text-[#8B6F4E]">{o.customer_name}</td>
                <td className="py-3 px-5 text-sm text-[#8B6F4E]">{new Date(o.created_at).toLocaleDateString('id-ID')}</td>
                <td className="py-3 px-5 text-sm font-medium">Rp {Number(o.total).toLocaleString()}</td>
                <td className="py-3 px-5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[o.status]}`}>{o.status}</span>
                </td>
                <td className="py-3 px-5">
                  <button onClick={() => openDetail(o.id)} className="text-[#4A7C3A] hover:bg-[#D4E8CC] p-1.5 rounded"><Eye size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrderId && detail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={closeDetail}>
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#1E1A17]">{detail.order.order_number}</h3>
              <button onClick={closeDetail}><X size={20} /></button>
            </div>

            <div className="space-y-1 text-sm mb-4">
              <p><span className="text-[#8B6F4E]">Nama:</span> {detail.order.customer_name}</p>
              <p><span className="text-[#8B6F4E]">HP:</span> {detail.order.customer_phone}</p>
              <p><span className="text-[#8B6F4E]">Alamat:</span> {detail.order.customer_address}, {detail.order.district}, {detail.order.city}, {detail.order.province}</p>
              <p><span className="text-[#8B6F4E]">Kurir:</span> {detail.order.courier || '-'}</p>
            </div>

            <div className="border-t border-gray-100 pt-3 mb-4">
              <h4 className="font-semibold text-sm mb-2">Items</h4>
              {detail.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm mb-1">
                  <span>{item.product_name_snapshot} ({item.variant_label_snapshot}) x{item.qty}</span>
                  <span>Rp {Number(item.price_snapshot * item.qty).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold border-t border-gray-100 pt-2 mt-2">
                <span>Total</span>
                <span className="text-[#4A7C3A]">Rp {Number(detail.order.total).toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 mb-4">
              <h4 className="font-semibold text-sm mb-2">Bukti Pembayaran</h4>
              {detail.proofs.length === 0 && <p className="text-xs text-[#8B6F4E]">Belum ada bukti diunggah.</p>}
              {detail.proofs.map((proof) => (
                <a key={proof.id} href={proof.image_url} target="_blank" rel="noopener noreferrer" className="block">
                  <img src={proof.image_url} alt="Bukti bayar" className="w-full max-w-xs rounded-lg border border-gray-100 mt-1" />
                </a>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3">
              <h4 className="font-semibold text-sm mb-2">Ubah Status</h4>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    disabled={updating}
                    onClick={() => handleStatusChange(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors disabled:opacity-50 ${
                      detail.order.status === s ? 'bg-[#4A7C3A] text-white border-[#4A7C3A]' : 'border-gray-200 text-[#8B6F4E] hover:border-[#4A7C3A]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
