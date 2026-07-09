import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Upload, MessageCircle } from 'lucide-react';
import { uploadPaymentProof } from '@/lib/orders';
import { buildOrderWhatsAppMessage, buildWhatsAppLink } from '@/lib/whatsapp';
import type { CartItem, ShippingAddress } from '@/types';

interface OrderData {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  province: string;
  city: string;
  district: string;
  shippingCost: number;
  courier: string;
  subtotal: number;
  total: number;
  paymentMethod: 'qris' | 'bank_transfer';
  bankAccount: { bankName: string; accountNumber: string; accountHolder: string } | null;
  items: (CartItem & { productName: string; variantLabel: string; qty: number; price: number })[];
}

export default function CheckoutSuccess() {
  const [order] = useState<OrderData | null>(() => {
    try {
      const stored = localStorage.getItem('last_order');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [showUpload, setShowUpload] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const generateWAMessage = () => {
    if (!order) return '#';
    const address: ShippingAddress = {
      fullName: order.customerName,
      phone: order.customerPhone,
      province: order.province,
      city: order.city,
      district: order.district,
      address: order.customerAddress,
    };
    const message = buildOrderWhatsAppMessage({
      orderNumber: order.orderNumber,
      items: order.items,
      address,
      courier: order.courier,
      shippingCost: order.shippingCost,
      subtotal: order.subtotal,
      total: order.total,
      paymentMethod: order.paymentMethod,
      bankLabel: order.bankAccount ? `${order.bankAccount.bankName} - ${order.bankAccount.accountNumber} a.n. ${order.bankAccount.accountHolder}` : undefined,
    });
    return buildWhatsAppLink(message);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !order) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setUploadError('');
    try {
      await uploadPaymentProof(order.orderId, file);
      setUploaded(true);
      setShowUpload(false);
    } catch (err) {
      console.error('Gagal upload bukti bayar:', err);
      setUploadError('Gagal upload bukti bayar. Silakan coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  if (!order) {
    return (
      <div className="bg-white py-20 text-center">
        <p className="text-[#8B6F4E]">No order found.</p>
        <Link to="/shop" className="text-[#4A7C3A] mt-4 inline-block">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F5EFE6] py-16 lg:py-24 min-h-[60vh]">
      <div className="max-w-[600px] mx-auto px-5 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-[#4A7C3A] flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-white" />
        </div>

        <h1
          className="text-[#4A7C3A] font-bold"
          style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
        >
          Order Placed!
        </h1>
        <p className="text-[#1E1A17] font-semibold text-lg mt-2">{order.orderNumber}</p>
        <p className="text-[#8B6F4E] mt-3">
          Thank you for your order. Please complete your payment and upload the proof of transfer.
        </p>

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8 text-left">
          <h3 className="font-semibold text-[#1E1A17] mb-4">Order Summary</h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <div>
                  <span className="text-[#1E1A17]">{item.productName}</span>
                  <span className="text-[#8B6F4E]"> x{item.qty}</span>
                  <p className="text-xs text-[#8B6F4E]">{item.variantLabel}</p>
                </div>
                <span className="font-medium">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#8B6F4E]">Shipping ({order.courier})</span>
              <span>Rp {order.shippingCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-[#1E1A17]">
              <span>Total</span>
              <span className="text-[#4A7C3A]">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-4 text-left">
          <h3 className="font-semibold text-[#1E1A17] mb-3">Payment Instructions</h3>
          {order.paymentMethod === 'qris' ? (
            <div>
              <p className="text-sm text-[#8B6F4E] mb-3">Please scan the QRIS code below to complete your payment:</p>
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SURYATJI-COFFEE-QRIS-PAYMENT"
                alt="QRIS Payment"
                className="w-36 h-36 mx-auto"
              />
            </div>
          ) : (
            <div>
              <p className="text-sm text-[#8B6F4E] mb-3">Please transfer to the following account:</p>
              {order.bankAccount && (
                <div className="bg-[#F9F6F1] p-4 rounded-lg">
                  <p className="font-semibold text-[#1E1A17]">{order.bankAccount.bankName}</p>
                  <p className="text-[#8B6F4E] text-sm">{order.bankAccount.accountNumber}</p>
                  <p className="text-[#8B6F4E] text-sm">a.n. {order.bankAccount.accountHolder}</p>
                </div>
              )}
            </div>
          )}
          <div className="mt-4 p-3 bg-[#F9F6F1] rounded-lg">
            <p className="text-sm font-semibold text-[#1E1A17]">Amount to Pay:</p>
            <p className="text-xl font-bold text-[#4A7C3A]">${order.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={() => setShowUpload(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-[#4A7C3A] text-white font-semibold py-3.5 rounded-full hover:bg-[#3d6b2f] transition-colors"
          >
            <Upload size={18} />
            Upload Payment Proof
          </button>
          <a
            href={generateWAMessage()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 border border-[#4A7C3A] text-[#4A7C3A] font-semibold py-3.5 rounded-full hover:bg-[#4A7C3A] hover:text-white transition-colors"
          >
            <MessageCircle size={18} />
            Confirm via WhatsApp
          </a>
        </div>

        {uploaded && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm font-medium">Payment proof uploaded successfully! We will verify your payment shortly.</p>
          </div>
        )}

        {showUpload && (
          <div className="mt-4 p-4 bg-white rounded-xl shadow-sm">
            <p className="text-sm text-[#8B6F4E] mb-3">Upload proof of transfer (JPG, PNG, PDF, max 5MB)</p>
            <input
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              className="w-full text-sm"
            />
            {uploading && <p className="text-xs text-[#4A7C3A] mt-2">Mengunggah...</p>}
            {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}
          </div>
        )}

        <Link to="/shop" className="inline-block text-[#4A7C3A] font-medium mt-6 hover:underline">
          Back to Shop
        </Link>
      </div>
    </div>
  );
}
