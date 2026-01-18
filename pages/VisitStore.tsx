
import React from 'react';
import { KITCHEN_MENU } from '../data/mockData';
import { Link } from 'react-router-dom';

const VisitStore: React.FC = () => {
  return (
    <div className="bg-[#fcf8f3]">
      {/* Header */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl font-bold nature-green mb-8">Visit the Store</h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                "Our store ensures freshness by carefully selecting, handling, and delivering high-quality produce you can trust every day."
              </p>
              <div className="space-y-6 mb-12">
                <div>
                  <h3 className="font-bold nature-green mb-4">What You Can Buy:</h3>
                  <ul className="grid grid-cols-2 gap-4 text-gray-700">
                    {['Fresh Fruits', 'Fresh Vegetables', 'Fruit Jams', 'Pre-cut Packs', 'Ready-to-cook Packs', 'Mixed Veggie Packs'].map(item => (
                      <li key={item} className="flex items-center space-x-2">
                        <span className="text-green-500">✔</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="pure-green-btn px-8 py-3 rounded-lg font-bold">Directions</button>
                <Link to="/shop" className="bg-green-100 nature-green px-8 py-3 rounded-lg font-bold">Shop Online Instead</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400" className="rounded-2xl h-48 w-full object-cover" alt="Store 1" />
              <img src="https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&q=80&w=400" className="rounded-2xl h-48 w-full object-cover" alt="Store 2" />
              <img src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=400" className="rounded-2xl h-64 w-full object-cover col-span-2" alt="Store 3" />
            </div>
          </div>
        </div>
      </section>

      {/* Live Kitchen Experience */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold nature-green mb-4 flex items-center justify-center space-x-3">
              <span>🍳</span> <span>Live Kitchen Experience</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience live preparation of fresh fruits and vegetables, learn healthy cooking practices, and enjoy freshly made, nutritious dishes.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {['Soups', 'Salads', 'Mains', 'Desserts'].map(cat => (
              <div key={cat} className="bg-white p-8 rounded-3xl shadow-sm border border-green-50 hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold nature-green mb-6 border-b border-green-100 pb-2 uppercase tracking-widest text-sm">
                  {cat}
                </h3>
                <div className="space-y-6">
                  {KITCHEN_MENU.filter(item => item.category === cat).map(item => (
                    <div key={item.id}>
                      <h4 className="font-bold text-gray-800 mb-2 leading-tight">{item.name}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                  {KITCHEN_MENU.filter(item => item.category === cat).length === 0 && (
                     <p className="text-xs text-gray-400 italic">Chef's daily special coming soon...</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisitStore;
