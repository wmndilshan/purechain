
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../services/googleSheetAPI';
import { adaptAPIProduct, setFarmersCache, setProductInfoCache, setHarvestCache } from '../services/dataAdapter';
import { adaptSensorReading, addNoiseToReadings } from '../services/sensorAdapter';
import { Product } from '../types';
import { SensorReading, SensorDataSection } from '../components/SensorDataSection';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Product state
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sensor state
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
  const [isRealSensorData, setIsRealSensorData] = useState(false);

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch everything in parallel
      const [apiProduct, apiFarmers, apiProductInfo, apiHarvest, rawSensorRows] = await Promise.all([
        api.getProductById(id!),
        api.getAllFarmers(),
        api.getProductInfo(),
        api.getHarvestData(),
        api.getSensorData(),
      ]);

      setFarmersCache(apiFarmers);
      setProductInfoCache(apiProductInfo);
      setHarvestCache(apiHarvest);

      if (!apiProduct) {
        setError('Product not found');
        return;
      }

      setProduct(adaptAPIProduct(apiProduct));

      // Build sensor data
      if (rawSensorRows && rawSensorRows.length > 0) {
        const realReadings = rawSensorRows
          .filter(r => r['Date and Time'] || (r['Date'] && r['Time']))
          .map(adaptSensorReading);

        const productId = String(id);
        const isCarrot = productId.toUpperCase() === 'CA';

        if (isCarrot) {
          // CA → use the real readings as-is (zero noise)
          setSensorReadings(realReadings);
          setIsRealSensorData(true);
        } else {
          // Other products → add deterministic noise based on product ID
          setSensorReadings(addNoiseToReadings(realReadings, productId));
          setIsRealSensorData(false);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load product. Please try again.');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="bg-white min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Link to="/shop" className="text-green-700 font-bold flex items-center space-x-2">
              <span>&larr;</span> <span>Back to Shop</span>
            </Link>
          </div>
          <ErrorMessage
            message={error || 'Product not found'}
            onRetry={error ? loadProduct : undefined}
          />
        </div>
      </div>
    );
  }

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
                className={`flex-grow py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all ${product.inStock ? 'pure-green-btn' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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

        {/* Info Grid — 3 columns on md+ */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">

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
                <div className="mt-2 flex flex-wrap gap-1">
                  {product.farmer.certifications.map(c => (
                    <span key={c} className="text-xs bg-white px-2 py-1 rounded border border-green-100 font-medium">{c}</span>
                  ))}
                </div>
              </li>
            </ul>
          </div>

          {/* Harvest & Freshness */}
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Harvest &amp; Freshness</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><span className="font-bold text-gray-900">• Picking Date:</span> {product.harvest.pickingDate}</li>
              <li><span className="font-bold text-gray-900">• Batch No:</span> {product.harvest.batchNumber}</li>
              <li><span className="font-bold text-gray-900">• Farming Method:</span> {product.harvest.storageMethod}</li>
              {product.harvest.fertilizersUsed && (
                <li><span className="font-bold text-gray-900">• Fertilizers:</span> {product.harvest.fertilizersUsed}</li>
              )}
              {product.harvest.chemicalSafety && (
                <li>
                  <span className="font-bold text-gray-900">• Chemical Safety:</span>{' '}
                  <span className="text-green-700 font-medium">{product.harvest.chemicalSafety}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Product Specifics */}
          <div className="nature-bg p-8 rounded-3xl border border-green-100">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <h3 className="text-xl font-bold nature-green mb-6">Product Info</h3>
            <ul className="space-y-3 text-gray-700 text-sm">
              <li><span className="font-bold text-green-900">• Variety:</span> {product.specifics.variety}</li>
              <li><span className="font-bold text-green-900">• Size / Weight:</span> {product.specifics.sizeWeight}</li>
              <li><span className="font-bold text-green-900">• Shelf Life:</span> {product.specifics.shelfLife}</li>
              {product.specifics.nutritionHighlights && (
                <li><span className="font-bold text-green-900">• Nutrition:</span> {product.specifics.nutritionHighlights}</li>
              )}
              {product.specifics.bestUse && (
                <li><span className="font-bold text-green-900">• Best Use:</span> {product.specifics.bestUse}</li>
              )}
              {product.specifics.packaging && (
                <li><span className="font-bold text-green-900">• Packaging:</span> {product.specifics.packaging}</li>
              )}
            </ul>
          </div>
        </div>

        {/* ── Sensor Data Section ── */}
        {sensorReadings.length > 0 && (
          <SensorDataSection readings={sensorReadings} isRealData={isRealSensorData} />
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
