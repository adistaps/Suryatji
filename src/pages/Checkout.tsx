import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { fetchBankAccounts } from '@/lib/settings';
import { checkShipping, WEIGHT_GRAMS_MAP } from '@/lib/komerce';
import { createOrder } from '@/lib/orders';
import type { BankAccount, ShippingMethod } from '@/types';

const provinces = [
  'Jawa Tengah', 'Jawa Barat', 'Jawa Timur', 'DKI Jakarta', 'DI Yogyakarta',
  'Banten', 'Bali', 'Sumatera Utara', 'Sumatera Barat', 'Sulawesi Selatan',
];

const cities: Record<string, string[]> = {
  'Jawa Tengah': ['Temanggung', 'Semarang', 'Solo', 'Magelang', 'Wonosobo'],
  'Jawa Barat': ['Bandung', 'Bogor', 'Bekasi', 'Depok'],
  'Jawa Timur': ['Surabaya', 'Malang', 'Kediri'],
  'DKI Jakarta': ['Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Utara'],
  'DI Yogyakarta': ['Yogyakarta', 'Sleman', 'Bantul'],
  'Banten': ['Tangerang', 'Serang', 'Cilegon'],
  'Bali': ['Denpasar', 'Badung', 'Gianyar'],
};

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    province: '',
    city: '',
    district: '',
    address: '',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank_transfer'>('qris');
  const [selectedBank, setSelectedBank] = useState('');
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<number | null>(null);
  const [calculatedShipping, setCalculatedShipping] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchBankAccounts().then(setBankAccounts).catch(() => setBankAccounts([]));
  }, []);

  const shippingCost = selectedShipping !== null ? shippingMethods[selectedShipping]?.cost ?? 0 : 0;
  const total = subtotal + shippingCost;

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const calculateShipping = async () => {
    const newErrors: Record<string, string> = {};
    if (!form.province) newErrors.province = 'Province is required';
    if (!form.city) newErrors.city = 'City is required';
    if (!form.district) newErrors.district = 'District is required';
    if (!form.address) newErrors.address = 'Address is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setShippingLoading(true);
    try {
      const totalWeightGrams = items.reduce(
        (sum, item) => sum + (WEIGHT_GRAMS_MAP[item.variant.weight] ?? 0) * item.quantity,
        0
      );
      const methods = await checkShipping({ destinationCity: form.city, totalWeightGrams });
      setShippingMethods(methods);
      setCalculatedShipping(true);
      setSelectedShipping(0);
    } finally {
      setShippingLoading(false);
    }
  };

  const placeOrder = async () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName) newErrors.fullName = 'Full name is required';
    if (!form.phone) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9]{10,13}$/.test(form.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!form.province) newErrors.province = 'Province is required';
    if (!form.city) newErrors.city = 'City is required';
    if (!form.district) newErrors.district = 'District is required';
    if (!form.address) newErrors.address = 'Address is required';
    if (!calculatedShipping) newErrors.shipping = 'Please calculate shipping first';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setPlacingOrder(true);
    try {
      const selectedBankAccount = paymentMethod === 'bank_transfer' ? bankAccounts.find(b => b.id === selectedBank) : null;
      const courierLabel = selectedShipping !== null ? `${shippingMethods[selectedShipping].courier} ${shippingMethods[selectedShipping].service}` : '';

      const { id: orderId, orderNumber } = await createOrder({
        address: {
          fullName: form.fullName,
          phone: form.phone,
          email: form.email || undefined,
          province: form.province,
          city: form.city,
          district: form.district,
          address: form.address,
          postalCode: form.postalCode || undefined,
        },
        items,
        courier: courierLabel,
        shippingCost,
        subtotal,
        total,
        paymentMethod,
        bankAccountId: selectedBankAccount?.id,
      });

      const orderData = {
        orderId,
        orderNumber,
        customerName: form.fullName,
        customerPhone: form.phone,
        customerAddress: `${form.address}, ${form.district}, ${form.city}, ${form.province}`,
        province: form.province,
        city: form.city,
        district: form.district,
        shippingCost,
        courier: courierLabel,
        subtotal,
        total,
        paymentMethod,
        bankAccount: selectedBankAccount ?? null,
        items: items.map(item => ({
          product: item.product,
          variant: item.variant,
          productName: item.product.name,
          variantLabel: `${item.variant.weight} - ${item.variant.grindType.replace('_', ' ')}`,
          qty: item.quantity,
          price: item.variant.price,
          quantity: item.quantity,
        })),
      };
      localStorage.setItem('last_order', JSON.stringify(orderData));
      clearCart();
      navigate('/checkout/success');
    } catch (err) {
      console.error('Gagal membuat order:', err);
      setErrors({ submit: 'Gagal membuat pesanan. Silakan coba lagi.' });
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white py-20 text-center">
        <p className="text-[#8B6F4E] mb-4">Your cart is empty.</p>
        <Link to="/shop" className="text-[#4A7C3A] font-medium hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="bg-white py-12 lg:py-16">
      <div className="max-w-[1100px] mx-auto px-5">
        <h1
          className="text-[#1E1A17] font-bold mb-8"
          style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
        >
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Billing Form */}
          <div className="lg:col-span-3">
            <h2 className="text-[#1E1A17] font-semibold text-lg mb-6" style={{ fontFamily: '"Playfair Display", serif' }}>
              Billing Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#1E1A17] mb-1 block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C3A] ${
                    errors.fullName ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="Your full name"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-[#1E1A17] mb-1 block">
                  Phone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C3A] ${
                    errors.phone ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="08123456789"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-[#1E1A17] mb-1 block">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C3A]"
                  placeholder="your@email.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#1E1A17] mb-1 block">
                    Province <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.province}
                    onChange={(e) => { updateField('province', e.target.value); updateField('city', ''); }}
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C3A] ${
                      errors.province ? 'border-red-400' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select Province</option>
                    {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1E1A17] mb-1 block">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C3A] ${
                      errors.city ? 'border-red-400' : 'border-gray-200'
                    }`}
                    disabled={!form.province}
                  >
                    <option value="">Select City</option>
                    {(cities[form.province] || []).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#1E1A17] mb-1 block">
                  District <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C3A] ${
                    errors.district ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="Kecamatan"
                />
                {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-[#1E1A17] mb-1 block">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  rows={3}
                  className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C3A] ${
                    errors.address ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="Street name, house number, RT/RW"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-[#1E1A17] mb-1 block">Postal Code</label>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => updateField('postalCode', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C3A]"
                  placeholder="56264"
                />
              </div>

              <button
                onClick={calculateShipping}
                disabled={shippingLoading}
                className="bg-[#4A7C3A] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#3d6b2f] transition-colors disabled:opacity-60"
              >
                {shippingLoading ? 'Menghitung...' : 'Calculate Shipping'}
              </button>
              {errors.shipping && <p className="text-red-500 text-xs">{errors.shipping}</p>}

              {calculatedShipping && (
                <div className="mt-4 p-4 bg-[#F9F6F1] rounded-lg">
                  <h4 className="font-semibold text-sm mb-3">Choose Shipping Method</h4>
                  <div className="space-y-2">
                    {shippingMethods.map((s, i) => (
                      <label
                        key={i}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedShipping === i ? 'border-[#4A7C3A] bg-white' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={selectedShipping === i}
                            onChange={() => setSelectedShipping(i)}
                            className="accent-[#4A7C3A]"
                          />
                          <div>
                            <p className="text-sm font-medium">{s.courier} {s.service}</p>
                            <p className="text-xs text-[#8B6F4E]">ETA: {s.etd}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-[#4A7C3A]">Rp {s.cost.toLocaleString()}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 bg-[#F9F6F1] rounded-xl p-6">
              <h2 className="text-[#1E1A17] font-semibold text-lg mb-5" style={{ fontFamily: '"Playfair Display", serif' }}>
                Your Order
              </h2>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.variant.id} className="flex justify-between text-sm">
                    <div>
                      <span className="font-medium text-[#1E1A17]">{item.product.name}</span>
                      <span className="text-[#8B6F4E]"> x{item.quantity}</span>
                      <p className="text-xs text-[#8B6F4E]">{item.variant.weight} - {item.variant.grindType.replace('_', ' ')}</p>
                    </div>
                    <span className="font-medium text-[#1E1A17]">${(item.variant.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B6F4E]">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B6F4E]">Shipping</span>
                  <span className="font-medium">{shippingCost > 0 ? `Rp ${shippingCost.toLocaleString()}` : '-'}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-[#1E1A17]">Total</span>
                  <span className="font-bold text-[#4A7C3A] text-lg">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-6">
                <h4 className="font-semibold text-sm mb-3">Payment Method</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-[#4A7C3A] transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'qris'}
                      onChange={() => setPaymentMethod('qris')}
                      className="accent-[#4A7C3A]"
                    />
                    <span className="text-sm">QRIS</span>
                  </label>
                  {paymentMethod === 'qris' && (
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SURYATJI-COFFEE-QRIS"
                        alt="QRIS Code"
                        className="w-40 h-40 mx-auto"
                      />
                      <p className="text-center text-xs text-[#8B6F4E] mt-2">Scan with your e-wallet app</p>
                    </div>
                  )}

                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-[#4A7C3A] transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="accent-[#4A7C3A]"
                    />
                    <span className="text-sm">Bank Transfer</span>
                  </label>
                  {paymentMethod === 'bank_transfer' && (
                    <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-2">
                      {bankAccounts.map((bank) => (
                        <label
                          key={bank.id}
                          className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                            selectedBank === bank.id ? 'bg-[#D4E8CC]' : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name="bank"
                            checked={selectedBank === bank.id}
                            onChange={() => setSelectedBank(bank.id)}
                            className="accent-[#4A7C3A]"
                          />
                          <div>
                            <p className="text-sm font-medium">{bank.bankName}</p>
                            <p className="text-xs text-[#8B6F4E]">{bank.accountNumber}</p>
                            <p className="text-xs text-[#8B6F4E]">a.n. {bank.accountHolder}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {errors.submit && <p className="text-red-500 text-xs mt-3">{errors.submit}</p>}
              <button
                onClick={placeOrder}
                disabled={placingOrder}
                className="w-full bg-[#4A7C3A] text-white font-semibold py-4 rounded-full mt-6 hover:bg-[#3d6b2f] transition-colors disabled:opacity-60"
              >
                {placingOrder ? 'Memproses...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
