import { Link } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[55]"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-white z-[56] shadow-[-4px_0_24px_rgba(0,0,0,0.15)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-[#1E1A17]" style={{ fontFamily: '"Poppins", sans-serif' }}>
            Your Cart
          </h3>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-[#1E1A17]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-gray-300 mb-4" />
              <p className="text-[#8B6F4E] mb-4">Your cart is empty.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-[#4A7C3A] font-medium hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.variant.id} className="flex gap-4 pb-4 border-b border-gray-100">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg bg-[#F9F6F1]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[#1E1A17] truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-[#8B6F4E] mt-0.5">
                      {item.variant.weight} - {item.variant.grindType.replace('_', ' ')}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 hover:border-[#4A7C3A] hover:text-[#4A7C3A] transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 hover:border-[#4A7C3A] hover:text-[#4A7C3A] transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-[#4A7C3A]">
                        Rp {Math.round((item.variant.price * item.quantity)).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.variant.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors self-start"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#8B6F4E]">Subtotal</span>
              <span className="text-lg font-semibold text-[#1E1A17]">Rp {Math.round(subtotal).toLocaleString('id-ID')}</span>
            </div>
            <Link
              to="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="block w-full bg-[#4A7C3A] text-white text-center py-3 rounded-full font-semibold hover:bg-[#3d6b2f] transition-colors"
            >
              Checkout
            </Link>
            <button
              onClick={() => setIsCartOpen(false)}
              className="block w-full text-center mt-3 text-sm text-[#4A7C3A] hover:underline"
            >
              View Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
