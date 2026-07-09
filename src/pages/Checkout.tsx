import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { fetchBankAccounts } from '@/lib/settings';
import { fetchProvinces, fetchCities, fetchDistricts, fetchSubDistricts, checkShipping, WEIGHT_GRAMS_MAP } from '@/lib/komerce';
import type { Province, City, District, SubDistrict } from '@/lib/komerce';
import { createOrder } from '@/lib/orders';
import type { BankAccount, ShippingMethod } from '@/types';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    postalCode: '',
  });

  // Pilihan bertingkat: Provinsi → Kota → Kecamatan → Kelurahan
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<SubDistrict | null>(null);

  // Data dropdown
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]);

  // Loading states
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingSubDistricts, setLoadingSubDistricts] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank_transfer'>('qris');
  const [selectedBank, setSelectedBank] = useState('');
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<number | null>(null);
  const [calculatedShipping, setCalculatedShipping] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load provinsi saat pertama kali
  useEffect(() => {
    setLoadingProvinces(true);
    fetchProvinces()
      .then(setProvinces)
      .catch(() => setProvinces([]))
      .finally(() => setLoadingProvinces(false));
  }, []);

  // Load kota saat provinsi berubah
  useEffect(() => {
    if (!selectedProvince) {
      setCities([]); setSelectedCity(null);
      setDistricts([]); setSelectedDistrict(null);
      setSubDistricts([]); setSelectedSubDistrict(null);
      return;
    }
    setLoadingCities(true);
    setCities([]); setSelectedCity(null);
    setDistricts([]); setSelectedDistrict(null);
    setSubDistricts([]); setSelectedSubDistrict(null);
    fetchCities(selectedProvince.id)
      .then(setCities).catch(() => setCities([]))
      .finally(() => setLoadingCities(false));
  }, [selectedProvince]);

  // Load kecamatan saat kota berubah
  useEffect(() => {
    if (!selectedCity) {
      setDistricts([]); setSelectedDistrict(null);
      setSubDistricts([]); setSelectedSubDistrict(null);
      return;
    }
    setLoadingDistricts(true);
    setDistricts([]); setSelectedDistrict(null);
    setSubDistricts([]); setSelectedSubDistrict(null);
    fetchDistricts(selectedCity.id)
      .then(setDistricts).catch(() => setDistricts([]))
      .finally(() => setLoadingDistricts(false));
  }, [selectedCity]);

  // Load kelurahan saat kecamatan berubah
  useEffect(() => {
    if (!selectedDistrict) {
      setSubDistricts([]); setSelectedSubDistrict(null);
      return;
    }
    setLoadingSubDistricts(true);
    setSubDistricts([]); setSelectedSubDistrict(null);
    setCalculatedShipping(false); setShippingMethods([]); setSelectedShipping(null);
    fetchSubDistricts(selectedDistrict.id)
      .then(setSubDistricts).catch(() => setSubDistricts([]))
      .finally(() => setLoadingSubDistricts(false));
  }, [selectedDistrict]);

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
    if (!selectedProvince) newErrors.province = 'Provinsi wajib diisi';
    if (!selectedCity) newErrors.city = 'Kota wajib diisi';
    if (!selectedDistrict) newErrors.district = 'Kecamatan wajib diisi';
    if (!selectedSubDistrict) newErrors.subDistrict = 'Kelurahan wajib diisi';
    if (!form.address) newErrors.address = 'Alamat wajib diisi';
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
      const methods = await checkShipping({
        destinationSubDistrictId: selectedSubDistrict!.id,
        totalWeightGrams,
      });
      setShippingMethods(methods);
      setCalculatedShipping(true);
      setSelectedShipping(0);
    } finally {
      setShippingLoading(false);
    }
  };


  const placeOrder = async () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName) newErrors.fullName = 'Nama lengkap wajib diisi';
    if (!form.phone) newErrors.phone = 'Nomor HP wajib diisi';
    else if (!/^[0-9]{10,13}$/.test(form.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Nomor HP tidak valid';
    }
    if (!selectedProvince) newErrors.province = 'Provinsi wajib diisi';
    if (!selectedCity) newErrors.city = 'Kota wajib diisi';
    if (!selectedDistrict) newErrors.district = 'Kecamatan wajib diisi';
    if (!selectedSubDistrict) newErrors.subDistrict = 'Kelurahan wajib diisi';
    if (!form.address) newErrors.address = 'Alamat wajib diisi';
    if (!calculatedShipping) newErrors.shipping = 'Hitung ongkir terlebih dahulu';

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
          province: selectedProvince?.name ?? '',
          city: `${selectedCity?.type ?? ''} ${selectedCity?.name ?? ''}`.trim(),
          district: `${selectedDistrict?.name ?? ''}, ${selectedSubDistrict?.name ?? ''}`.trim(),
          address: form.address,
          postalCode: selectedSubDistrict?.zip_code || form.postalCode || undefined,
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
        customerAddress: `${form.address}, ${selectedSubDistrict?.name ?? ''}, ${selectedDistrict?.name ?? ''}, ${selectedCity?.name ?? ''}, ${selectedProvince?.name ?? ''}`,
        province: selectedProvince?.name ?? '',
        city: selectedCity?.name ?? '',
        district: selectedDistrict?.name ?? '',
        subDistrict: selectedSubDistrict?.name ?? '',
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
                    Provinsi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedProvince?.id ?? ''}
                    onChange={(e) => {
                      const prov = provinces.find(p => p.id === parseInt(e.target.value)) || null;
                      setSelectedProvince(prov);
                      if (errors.province) setErrors(prev => ({ ...prev, province: '' }));
                    }}
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C3A] ${
                      errors.province ? 'border-red-400' : 'border-gray-200'
                    }`}
                    disabled={loadingProvinces}
                  >
                    <option value="">{loadingProvinces ? 'Memuat...' : 'Pilih Provinsi'}</option>
                    {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1E1A17] mb-1 block">
                    Kota / Kabupaten <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCity?.id ?? ''}
                    onChange={(e) => {
                      const city = cities.find(c => c.id === parseInt(e.target.value)) || null;
                      setSelectedCity(city);
                      if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
                    }}
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C3A] ${
                      errors.city ? 'border-red-400' : 'border-gray-200'
                    }`}
                    disabled={!selectedProvince || loadingCities}
                  >
                    <option value="">
                      {loadingCities ? 'Memuat...' : selectedProvince ? 'Pilih Kota/Kabupaten' : 'Pilih Provinsi dulu'}
                    </option>
                    {cities.map(c => <option key={c.id} value={c.id}>{c.type ? `${c.type} ${c.name}` : c.name}</option>)}
                  </select>
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#1E1A17] mb-1 block">
                  Kecamatan <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedDistrict?.id ?? ''}
                  onChange={(e) => {
                    const dist = districts.find(d => d.id === parseInt(e.target.value)) || null;
                    setSelectedDistrict(dist);
                    if (errors.district) setErrors(prev => ({ ...prev, district: '' }));
                  }}
                  className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C3A] ${
                    errors.district ? 'border-red-400' : 'border-gray-200'
                  }`}
                  disabled={!selectedCity || loadingDistricts}
                >
                  <option value="">
                    {loadingDistricts ? 'Memuat...' : selectedCity ? 'Pilih Kecamatan' : 'Pilih Kota dulu'}
                  </option>
                  {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
                {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-[#1E1A17] mb-1 block">
                  Kelurahan / Desa <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedSubDistrict?.id ?? ''}
                  onChange={(e) => {
                    const sd = subDistricts.find(s => s.id === parseInt(e.target.value)) || null;
                    setSelectedSubDistrict(sd);
                    // Auto-fill kode pos dari API
                    if (sd?.zip_code) updateField('postalCode', sd.zip_code);
                    if (errors.subDistrict) setErrors(prev => ({ ...prev, subDistrict: '' }));
                  }}
                  className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C3A] ${
                    errors.subDistrict ? 'border-red-400' : 'border-gray-200'
                  }`}
                  disabled={!selectedDistrict || loadingSubDistricts}
                >
                  <option value="">
                    {loadingSubDistricts ? 'Memuat...' : selectedDistrict ? 'Pilih Kelurahan/Desa' : 'Pilih Kecamatan dulu'}
                  </option>
                  {subDistricts.map(s => <option key={s.id} value={s.id}>{s.name}{s.zip_code ? ` (${s.zip_code})` : ''}</option>)}
                </select>
                {errors.subDistrict && <p className="text-red-500 text-xs mt-1">{errors.subDistrict}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-[#1E1A17] mb-1 block">
                  Alamat Lengkap <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  rows={3}
                  className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C3A] ${
                    errors.address ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="Nama jalan, nomor rumah, RT/RW"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-[#1E1A17] mb-1 block">
                  Kode Pos
                  {selectedSubDistrict?.zip_code && (
                    <span className="text-xs text-[#4A7C3A] ml-2">(terisi otomatis)</span>
                  )}
                </label>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => updateField('postalCode', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C3A] bg-white"
                  placeholder="56264"
                />
              </div>

              <button
                onClick={calculateShipping}
                disabled={shippingLoading || !selectedSubDistrict}
                className="bg-[#4A7C3A] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#3d6b2f] transition-colors disabled:opacity-60"
              >
                {shippingLoading ? 'Menghitung ongkir...' : 'Hitung Ongkir'}
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
                    <span className="font-medium text-[#1E1A17]">Rp {(item.variant.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B6F4E]">Subtotal</span>
                  <span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B6F4E]">Shipping</span>
                  <span className="font-medium">{shippingCost > 0 ? `Rp ${shippingCost.toLocaleString()}` : '-'}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-[#1E1A17]">Total</span>
                  <span className="font-bold text-[#4A7C3A] text-lg">Rp {total.toLocaleString('id-ID')}</span>
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
