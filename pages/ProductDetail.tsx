
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/mockData';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = PRODUCTS.find(p => p.id === id);

  if (!product) return <div className="p-24 text-center">Product not found.</div>;

  const handleAdd = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
           <Link to="/shop" className="text-green-700 font-bold flex items-center space-x-2">
            <span>&larr;</span> <span>Back to Shop</span>
           </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-16 mb-24">
          <div className="bg-gray-50 rounded-[40px] p-12 flex items-center justify-center">
            <img src={product.image} alt={product.name} className="max-w-full h-auto object-contain mix-blend-multiply drop-shadow-2xl" />
          </div>
          <div>
            <h1 className="text-6xl font-bold nature-green mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-gray-800 mb-6">Rs.{product.price}</p>
            <p className="text-sm text-gray-500 mb-10 tracking-widest uppercase">Price per 1 kg</p>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center space-x-6 mb-10">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 py-3 hover:bg-gray-50 text-gray-600 font-bold">-</button>
                <span className="px-8 py-3 font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-5 py-3 hover:bg-gray-50 text-gray-600 font-bold">+</button>
              </div>
              <button 
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`flex-grow py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all ${
                  product.inStock ? 'pure-green-btn' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                 </svg>
                 <span>{product.inStock ? 'Add to cart' : 'Out of Stock'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {/* Farmer Info */}
          <div className="nature-bg p-8 rounded-3xl border border-green-100">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
             </div>
             <h3 className="text-xl font-bold nature-green mb-6">Farmer Information</h3>
             <ul className="space-y-4 text-gray-700 text-sm">
                <li><span className="font-bold text-green-900">• Name:</span> {product.farmer.name}</li>
                <li><span className="font-bold text-green-900">• Location / Farm:</span> {product.farmer.location}</li>
                <li>
                  <span className="font-bold text-green-900">• Certifications:</span> 
                  <div className="mt-2 space-y-1">
                    {product.farmer.certifications.map(c => <div key={c} className="text-xs bg-white px-2 py-1 rounded border border-green-50 inline-block mr-1">{c}</div>)}
                  </div>
                </li>
             </ul>
          </div>

          {/* Harvest Info */}
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             </div>
             <h3 className="text-xl font-bold text-gray-800 mb-6">Harvest & Freshness Info</h3>
             <ul className="space-y-4 text-gray-600 text-sm">
                <li><span className="font-bold text-gray-900">• Picking Date:</span> {product.harvest.pickingDate}</li>
                <li><span className="font-bold text-gray-900">• Batch Number:</span> {product.harvest.batchNumber}</li>
                <li><span className="font-bold text-gray-900">• Storage / Handling:</span> {product.harvest.storageMethod}</li>
             </ul>
          </div>

          {/* Product Specific Info */}
          <div className="nature-bg p-8 rounded-3xl border border-green-100">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
             </div>
             <h3 className="text-xl font-bold nature-green mb-6">Product Specific Info</h3>
             <ul className="space-y-4 text-gray-700 text-sm">
                <li><span className="font-bold text-green-900">• Variety:</span> {product.specifics.variety}</li>
                <li><span className="font-bold text-green-900">• Size / Weight:</span> {product.specifics.sizeWeight}</li>
                <li><span className="font-bold text-green-900">• Shelf Life:</span> {product.specifics.shelfLife}</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
