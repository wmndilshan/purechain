
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();

  const handleCheckout = () => {
    cart.forEach(item => {
      console.log(`Checkout: ${item.name}, Quantity: ${item.quantity}`);
    });
    alert('Checkout successful! Check console for data.');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold nature-green mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Start adding some fresh organic produce to your kitchen.</p>
        <Link to="/shop" className="pure-green-btn px-8 py-3 rounded-lg font-bold">Browse Shop</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9f5] min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-green-100/50 rounded-2xl p-8 mb-8 text-center border border-green-200">
           <h1 className="text-4xl font-bold nature-green heading-font">Your cart</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider font-bold">
              <tr>
                <th className="px-8 py-6">Product</th>
                <th className="px-8 py-6">Price</th>
                <th className="px-8 py-6 text-center">Quantity</th>
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
                      <span className="font-bold text-gray-800">{item.name}</span>
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

        <div className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
           <Link to="/shop" className="text-green-700 font-bold flex items-center space-x-2">
              <span>&larr;</span> <span>Continue Shopping</span>
           </Link>
           <div className="w-full md:w-96 bg-white p-8 rounded-3xl shadow-xl border border-green-50">
              <div className="flex justify-between items-center mb-6 text-xl">
                <span className="font-bold nature-green">Grand Total</span>
                <span className="font-bold nature-green">Rs.{subtotal}</span>
              </div>
              <button onClick={() => alert('Cart Updated!')} className="w-full bg-green-900 text-white py-3 rounded-xl font-bold mb-4 hover:bg-green-950 transition-colors">Update cart</button>
              <button onClick={handleCheckout} className="w-full bg-yellow-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-yellow-600 transition-colors shadow-lg">Proceed to checkout</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
