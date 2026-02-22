
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/googleSheetAPI';
import { getSavedOrders } from '../context/CartContext';
import { PlacedOrder } from '../types';
import { APIOrder } from '../services/googleSheetAPI';

// ─── Status helpers ───────────────────────────────────────────────────────────

const STEPS = ['Pending', 'Processing', 'On the way', 'Fulfilled'] as const;
type StatusStep = typeof STEPS[number];

const STATUS_ICONS: Record<string, string> = {
    'Pending': '⏳',
    'Processing': '📦',
    'On the way': '🚚',
    'Fulfilled': '✅',
    'Cancelled': '❌',
};

function stepIndex(status: string): number {
    const idx = STEPS.findIndex(s => s.toLowerCase() === status?.toLowerCase());
    return idx === -1 ? 0 : idx;
}

// ─── Component ────────────────────────────────────────────────────────────────

const OrderTracking: React.FC = () => {
    const [orders, setOrders] = useState<PlacedOrder[]>([]);
    const [liveStatuses, setLiveStatuses] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    // Load saved orders from localStorage
    useEffect(() => {
        const saved = getSavedOrders();
        setOrders(saved);
    }, []);

    // Fetch live statuses from Orders sheet
    const fetchStatuses = async () => {
        setLoading(true);
        try {
            const allOrders: APIOrder[] = await api.getAllOrders();
            const statusMap: Record<string, string> = {};
            allOrders.forEach(o => {
                statusMap[String(o['Order_id'])] = String(o['Status']);
            });
            setLiveStatuses(statusMap);
            setLastRefresh(new Date());
        } catch (err) {
            console.warn('Could not fetch live status:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orders.length > 0) fetchStatuses();
        else setLoading(false);
    }, [orders.length]);

    // Auto-refresh every 60 seconds
    useEffect(() => {
        if (orders.length === 0) return;
        const interval = setInterval(fetchStatuses, 60_000);
        return () => clearInterval(interval);
    }, [orders.length]);

    // Merge localStorage data with live statuses
    const enrichedOrders = useMemo(() =>
        orders.map(o => ({
            ...o,
            status: liveStatuses[o.orderId] ?? o.status ?? 'Pending',
        }))
        , [orders, liveStatuses]);

    // ── Empty state ──────────────────────────────────────────────────────────────
    if (!loading && orders.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
                <div className="text-6xl mb-6">📦</div>
                <h1 className="text-3xl font-bold nature-green mb-4">No orders yet</h1>
                <p className="text-gray-500 mb-8 text-center">
                    When you place an order, you can track it here in real time.
                </p>
                <Link to="/shop" className="pure-green-btn px-8 py-3 rounded-xl font-bold">Shop Now</Link>
            </div>
        );
    }

    return (
        <div className="bg-[#f9f9f5] min-h-screen py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold nature-green mb-2">My Orders</h1>
                    <p className="text-gray-500 text-sm">
                        {loading ? 'Fetching latest status…' : `Last updated: ${lastRefresh.toLocaleTimeString()}`}
                        <button onClick={fetchStatuses} className="ml-3 text-green-700 font-bold text-xs underline">↻ Refresh</button>
                    </p>
                </div>

                {/* Order Cards */}
                <div className="space-y-6">
                    {enrichedOrders.map(order => {
                        const isCancelled = order.status?.toLowerCase() === 'cancelled';
                        const step = isCancelled ? -1 : stepIndex(order.status ?? 'Pending');

                        return (
                            <div key={order.orderId} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                                {/* Order Header */}
                                <div className="px-8 py-5 bg-gray-50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                        <span className="text-xs text-gray-400 uppercase tracking-wide font-bold">Order ID</span>
                                        <p className="font-mono font-bold text-gray-800 text-sm">{order.orderId}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-400 uppercase tracking-wide font-bold">Placed</span>
                                        <p className="text-sm text-gray-700">
                                            {new Date(order.dateTime).toLocaleString('en-GB', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400 uppercase tracking-wide font-bold">Total</span>
                                        <p className="font-bold text-green-700 text-lg">Rs.{order.price * order.quantity}</p>
                                    </div>
                                </div>

                                {/* Product Row */}
                                <div className="px-8 py-5 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-gray-800">{order.productName}</p>
                                        <p className="text-sm text-gray-500">{order.quantity} kg × Rs.{order.price}</p>
                                    </div>
                                    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-bold ${isCancelled
                                            ? 'bg-red-100 text-red-700'
                                            : step >= 3
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        <span>{STATUS_ICONS[order.status ?? 'Pending'] ?? '⏳'}</span>
                                        <span>{order.status ?? 'Pending'}</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                {!isCancelled && (
                                    <div className="px-8 pb-7">
                                        <div className="flex items-center">
                                            {STEPS.map((s, i) => (
                                                <React.Fragment key={s}>
                                                    {/* Circle */}
                                                    <div className="flex flex-col items-center">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i <= step
                                                                ? 'bg-green-600 text-white shadow-md'
                                                                : 'bg-gray-100 text-gray-400'
                                                            }`}>
                                                            {i <= step ? '✓' : i + 1}
                                                        </div>
                                                        <span className={`text-xs mt-1 font-medium ${i <= step ? 'text-green-700' : 'text-gray-400'}`}>
                                                            {s}
                                                        </span>
                                                    </div>
                                                    {/* Connector */}
                                                    {i < STEPS.length - 1 && (
                                                        <div className={`flex-1 h-1 mx-1 rounded transition-all ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {isCancelled && (
                                    <div className="px-8 pb-6">
                                        <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">
                                            This order was cancelled.
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 text-center">
                    <Link to="/shop" className="text-green-700 font-bold">← Back to Shop</Link>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
