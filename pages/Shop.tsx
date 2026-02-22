import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/googleSheetAPI';
import { adaptAPIProducts, setFarmersCache, setProductInfoCache, setHarvestCache } from '../services/dataAdapter';
import { Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Shop: React.FC = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<'all' | 'fruits' | 'vegetables'>('all');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // API state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products (+ farmers for enriched data) from API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const [apiProducts, apiFarmers, apiProductInfo, apiHarvest] = await Promise.all([
        api.getAllProducts(),
        api.getAllFarmers(),
        api.getProductInfo(),
        api.getHarvestData(),
      ]);
      setFarmersCache(apiFarmers);
      setProductInfoCache(apiProductInfo);
      setHarvestCache(apiHarvest);
      const adaptedProducts = adaptAPIProducts(apiProducts);
      setProducts(adaptedProducts);
    } catch (err: any) {
      setError(err.message || 'Failed to load products. Please try again.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  const updateLocalQty = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    if (!product.inStock) return;
    const qty = quantities[product.id] || 1;
    addToCart(product, qty);
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
    navigate('/cart');
  };

  return (
    <div className="bg-[#f9f9f5] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-green-700 uppercase bg-green-100 rounded-full">
            Our Marketplace
          </div>
          <h1 className="text-4xl md:text-5xl font-bold nature-green mb-4">Shop Online</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Directly from our IoT-monitored organic farms. Every item is traceable to its source.
          </p>
        </div>

        {/* Categories */}
        <div className="flex justify-center space-x-2 md:space-x-4 mb-12">
          {['all', 'fruits', 'vegetables'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition-all border ${activeCategory === cat
                ? 'bg-green-700 text-white border-green-700 shadow-md'
                : 'bg-white text-green-700 border-green-200 hover:border-green-700'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {error && <ErrorMessage message={error} onRetry={loadProducts} />}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Products Available</h3>
            <p className="text-gray-500">Check back soon for fresh organic produce!</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all group relative border border-green-50 flex flex-col h-full p-4">
                {!product.inStock && (
                  <div className="absolute top-6 left-0 right-0 z-10">
                    <div className="bg-red-500/90 backdrop-blur-sm text-white text-center text-[10px] font-black py-1 uppercase tracking-[0.2em]">Out of Stock</div>
                  </div>
                )}

                <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#fdfcf5] rounded-2xl mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ${!product.inStock ? 'grayscale opacity-30' : ''}`}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </Link>

                <div className="flex flex-col flex-grow text-center">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-md">
                      {product.category}
                    </span>
                    <Link to={`/product/${product.id}`} className="text-[10px] font-bold text-gray-400 hover:text-green-700 uppercase tracking-widest underline decoration-dotted">Details</Link>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-green-700 font-extrabold text-lg mb-4">Rs.{product.price}<span className="text-xs text-gray-400 font-normal ml-1">/ kg</span></p>

                  {product.inStock && (
                    <div className="mt-auto space-y-3">
                      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-1 border border-gray-100">
                        <button
                          onClick={() => updateLocalQty(product.id, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 hover:text-green-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                        </button>
                        <span className="text-sm font-bold text-gray-700">{quantities[product.id] || 1}</span>
                        <button
                          onClick={() => updateLocalQty(product.id, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 hover:text-green-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                        </button>
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full py-3.5 rounded-xl font-bold bg-green-700 text-white hover:bg-green-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Add To Cart</span>
                      </button>
                    </div>
                  )}

                  {!product.inStock && (
                    <button disabled className="mt-auto w-full py-3.5 rounded-xl font-bold bg-gray-100 text-gray-400 cursor-not-allowed uppercase tracking-widest text-xs">
                      Notify Me
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
