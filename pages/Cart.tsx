
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { PlacedOrder } from '../types';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, checkout } = useCart();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [placedOrders, setPlacedOrders] = useState<PlacedOrder[]>([]);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setChecking(true);
    setCheckoutError(null);
    const result = await checkout();
    setChecking(false);
    if (result.success) {
      setPlacedOrders(result.orders);
      setCheckoutDone(true);
    } else {
      setCheckoutError(result.error ?? 'Checkout failed. Please try again.');
    }
  };

  // ── Order Success Screen ─────────────────────────────────────────────────────
  if (checkoutDone) {
    return (
      <div className="bg-[#f9f9f5] min-h-screen py-16 flex items-center justify-center">
        <div className="max-w-lg w-full mx-4 bg-white rounded-3xl shadow-2xl p-10 text-center border border-green-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold nature-green mb-2">Order Placed! 🎉</h2>
          <p className="text-gray-500 mb-8">
            Your fresh organic produce is being prepared. You can track your order status below.
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left space-y-3">
            {placedOrders.map(o => (
              <div key={o.orderId} className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-bold text-gray-800">{o.productName}</span>
                  <span className="text-gray-400 ml-2">×{o.quantity}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-700 font-bold">Rs.{o.price * o.quantity}</span>
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">Pending</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={() => navigate('/my-orders')}
              className="pure-green-btn py-3 rounded-xl font-bold text-lg"
            >
              📦 Track My Orders
            </button>
            <Link to="/shop" className="text-green-700 font-bold py-3">
              Continue Shopping →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty Cart ───────────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold nature-green mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Start adding some fresh organic produce to your kitchen.</p>
        <Link to="/shop" className="pure-green-btn px-8 py-3 rounded-lg font-bold">Browse Shop</Link>
      </div>
    );
  }

  // ── Cart with items ──────────────────────────────────────────────────────────
  return (
    <div className="bg-[#f9f9f5] min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-green-100/50 rounded-2xl p-8 mb-8 text-center border border-green-200">
          <h1 className="text-4xl font-bold nature-green heading-font">Your Cart</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider font-bold">
              <tr>
                <th className="px-8 py-6">Product</th>
                <th className="px-8 py-6">Price / kg</th>
                <th className="px-8 py-6 text-center">Qty (kg)</th>
                <th className="px-8 py-6 text-right">Subtotal</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cart.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-gray-50" />
                      <div>
                        <span className="font-bold text-gray-800 block">{item.name}</span>
                        <span className="text-xs text-gray-400">{item.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-gray-600">Rs.{item.price}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center border border-gray-200 rounded-lg w-fit mx-auto overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100">-</button>
                      <span className="px-4 py-1 text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right font-bold text-green-700">Rs.{item.price * item.quantity}</td>
                  <td className="px-8 py-6 text-center">
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {checkoutError && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-6 py-4 font-medium">
            ⚠️ {checkoutError}
          </div>
        )}

        <div className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col space-y-2">
            <Link to="/shop" className="text-green-700 font-bold flex items-center space-x-2">
              <span>&larr;</span><span>Continue Shopping</span>
            </Link>
            <Link to="/my-orders" className="text-gray-500 text-sm flex items-center space-x-1">
              <span>📦</span><span>View past orders</span>
            </Link>
          </div>

          <div className="w-full md:w-96 bg-white p-8 rounded-3xl shadow-xl border border-green-50">
            <div className="flex justify-between items-center mb-2 text-xl">
              <span className="font-bold nature-green">Grand Total</span>
              <span className="font-bold nature-green">Rs.{subtotal}</span>
            </div>
            <p className="text-xs text-gray-400 mb-6">Includes {cart.reduce((a, i) => a + i.quantity, 0)} kg of organic produce</p>
            <button
              onClick={handleCheckout}
              disabled={checking}
              className="w-full bg-yellow-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-yellow-600 transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {checking ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Placing Order…</span>
                </>
              ) : (
                <span>🛒 Place Order</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
