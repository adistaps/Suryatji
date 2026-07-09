import { Link } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();

  return (
    <div className="bg-white py-12 lg:py-16 min-h-[60vh]">
      <div className="max-w-[1000px] mx-auto px-5">
        <h1
          className="text-[#1E1A17] font-bold mb-8"
          style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
        >
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={64} className="text-gray-200 mx-auto mb-6" />
            <p className="text-[#8B6F4E] text-lg mb-6">Your cart is empty.</p>
            <Link
              to="/shop"
              className="inline-block bg-[#4A7C3A] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#3d6b2f] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-semibold text-[#1E1A17]">Product</th>
                    <th className="text-left py-3 text-sm font-semibold text-[#1E1A17]">Price</th>
                    <th className="text-left py-3 text-sm font-semibold text-[#1E1A17]">Quantity</th>
                    <th className="text-left py-3 text-sm font-semibold text-[#1E1A17]">Subtotal</th>
                    <th className="py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.variant.id} className="border-b border-gray-100">
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-lg bg-[#F9F6F1]"
                          />
                          <div>
                            <h4 className="font-semibold text-[#1E1A17]">{item.product.name}</h4>
                            <p className="text-xs text-[#8B6F4E]">
                              {item.variant.weight} - {item.variant.grindType.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-[#8B6F4E]">${item.variant.price.toFixed(2)}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#4A7C3A] transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#4A7C3A] transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 font-semibold text-[#1E1A17]">
                        ${(item.variant.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => removeFromCart(item.variant.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
              <div className="flex gap-4">
                <Link to="/shop" className="text-[#4A7C3A] text-sm font-medium hover:underline">
                  Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-[#8B6F4E] text-sm hover:text-red-500 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Cart Totals */}
            <div className="mt-10 ml-auto max-w-sm">
              <h3 className="text-[#1E1A17] font-semibold text-lg mb-4" style={{ fontFamily: '"Playfair Display", serif' }}>
                Cart Totals
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B6F4E]">Subtotal</span>
                  <span className="font-medium text-[#1E1A17]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8B6F4E]">Shipping</span>
                  <span className="text-[#8B6F4E]">Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold text-[#1E1A17]">Total</span>
                  <span className="font-bold text-[#4A7C3A] text-lg">${subtotal.toFixed(2)}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="block w-full bg-[#4A7C3A] text-white text-center font-semibold py-4 rounded-full mt-6 hover:bg-[#3d6b2f] transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
