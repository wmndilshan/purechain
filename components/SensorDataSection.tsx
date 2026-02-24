import React, { useState } from 'react';

export interface SensorReading {
    dateTime: string;
    N: number;
    P: number;
    K: number;
    soilMoisture: number;
    gas: number;
    rateN?: number;
    rateP?: number;
    rateK?: number;
    rateSoilMoisture?: number;
    rateGas?: number;
    baselineN?: number;
    baselineP?: number;
    baselineK?: number;
    baselineGas?: number;
}

interface Props {
    readings: SensorReading[];
    isRealData: boolean; // true for CA (Carrot), false for others
}

type Metric = 'N' | 'P' | 'K' | 'gas';

const METRICS: { key: Metric; label: string; unit: string; color: string; idealMin: number; idealMax: number; dataKey: keyof SensorReading; baselineKey?: keyof SensorReading }[] = [
    { key: 'N', label: 'N', unit: 'mg/kg', color: '#22c55e', idealMin: 150, idealMax: 220, dataKey: 'rateN', baselineKey: 'baselineN' },
    { key: 'P', label: 'P', unit: 'mg/kg', color: '#3b82f6', idealMin: 45, idealMax: 75, dataKey: 'rateP', baselineKey: 'baselineP' },
    { key: 'K', label: 'K', unit: 'mg/kg', color: '#a855f7', idealMin: 120, idealMax: 180, dataKey: 'rateK', baselineKey: 'baselineK' },
    { key: 'gas', label: 'Pesticide Usage', unit: 'ppm', color: '#f97316', idealMin: 400, idealMax: 550, dataKey: 'gas', baselineKey: 'baselineGas' },
];

function MiniSVGChart({ readings, config }: { readings: SensorReading[]; config: typeof METRICS[0] }) {
    const { dataKey, color, baselineKey } = config;
    const values = readings.map(r => r[dataKey] as number);
    const baselineReading = baselineKey ? readings.find(r => Number(r[baselineKey]) > 0) : undefined;
    const baselineValue = baselineReading && baselineKey ? baselineReading[baselineKey] as number : undefined;

    const min = Math.min(...values, baselineValue ?? Infinity);
    const max = Math.max(...values, baselineValue ?? -Infinity);
    const range = max - min || 1;
    const W = 280, H = 70, pad = 6;

    const points = values
        .map((v, i) => {
            const x = pad + (i / (values.length - 1)) * (W - pad * 2);
            const y = pad + (1 - (v - min) / range) * (H - pad * 2);
            return `${x},${y}`;
        })
        .join(' ');

    const last = values[values.length - 1];
    const prev = values[values.length - 2] ?? last;
    const trend = last > prev ? '↑' : last < prev ? '↓' : '→';
    const trendColor = last > prev ? '#ef4444' : last < prev ? '#22c55e' : '#6b7280';

    return (
        <div className="relative">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
                <defs>
                    <linearGradient id={`grad-${config.key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                    </linearGradient>
                </defs>
                {/* baseline */}
                {baselineValue !== undefined && (
                    <line
                        x1={pad} y1={pad + (1 - (baselineValue - min) / range) * (H - pad * 2)}
                        x2={W - pad} y2={pad + (1 - (baselineValue - min) / range) * (H - pad * 2)}
                        stroke="#000000" strokeWidth="1.5" strokeDasharray="4,2"
                    />
                )}
                {/* fill area */}
                <polygon
                    points={`${pad},${H - pad} ${points} ${W - pad},${H - pad}`}
                    fill={`url(#grad-${config.key})`}
                />
                {/* line */}
                <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {/* last dot */}
                <circle
                    cx={pad + ((values.length - 1) / (values.length - 1)) * (W - pad * 2)}
                    cy={pad + (1 - (last - min) / range) * (H - pad * 2)}
                    r="3.5" fill={color}
                />
            </svg>
            <span className="absolute top-1 right-2 text-xs font-bold" style={{ color: trendColor }}>{trend}</span>
        </div>
    );
}

function statusBadge(value: number, idealMin: number, idealMax: number) {
    if (value >= idealMin && value <= idealMax)
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Optimal</span>;
    if (value < idealMin)
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Low</span>;
    return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">High</span>;
}

export const SensorDataSection: React.FC<Props> = ({ readings, isRealData }) => {
    const [activeMetric, setActiveMetric] = useState<Metric>('N');

    if (!readings || readings.length === 0) return null;

    const latest = readings[readings.length - 1];
    const activeConf = METRICS.find(m => m.key === activeMetric)!;
    const activeValues = readings.map(r => r[activeConf.dataKey] as number);

    const baselineReading = activeConf.baselineKey ? readings.find(r => Number(r[activeConf.baselineKey]) > 0) : undefined;
    const baselineValue = baselineReading && activeConf.baselineKey ? baselineReading[activeConf.baselineKey] as number : undefined;

    const activeMin = Math.min(...activeValues, baselineValue ?? Infinity);
    const activeMax = Math.max(...activeValues, baselineValue ?? -Infinity);

    // Full chart
    const W = 600, H = 160, padX = 40, padY = 16;
    const range = activeMax - activeMin || 1;
    const points = activeValues
        .map((v, i) => {
            const x = padX + (i / (activeValues.length - 1)) * (W - padX * 2);
            const y = padY + (1 - (v - activeMin) / range) * (H - padY * 2);
            return `${x},${y}`;
        })
        .join(' ');

    // X-axis labels — show every ~6th label
    const xLabels = readings
        .map((r, i) => ({ i, label: r.dateTime.slice(11, 16) }))
        .filter((_, i) => i % 6 === 0 || i === readings.length - 1);

    return (
        <div className="mt-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                        🌱 Live Soil & Air Sensor Data
                    </h3>
                </div>
                {isRealData && (
                    <span className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs font-bold text-green-700">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
                        <span>LIVE DATA</span>
                    </span>
                )}
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {METRICS.map(m => (
                    <button
                        key={m.key}
                        onClick={() => setActiveMetric(m.key)}
                        className={`rounded-2xl p-3 text-left transition-all border-2 ${activeMetric === m.key
                            ? 'border-current shadow-lg scale-[1.02]'
                            : 'border-transparent bg-white hover:shadow-md'
                            }`}
                        style={activeMetric === m.key ? { borderColor: m.color, background: `${m.color}10` } : {}}
                    >
                        <div className="text-xs text-gray-500 mb-1 font-medium truncate">{m.label}</div>
                        <div className="text-xl font-bold" style={{ color: m.color }}>
                            {(latest[m.dataKey] as number).toFixed(1)}
                            <span className="text-xs font-normal text-gray-400 ml-1">{m.unit}</span>
                        </div>
                        <div className="mt-1">{statusBadge(latest[m.dataKey] as number, m.idealMin, m.idealMax)}</div>
                        <MiniSVGChart readings={readings} config={m} />
                    </button>
                ))}
            </div>

            {/* Big Chart */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="font-bold text-gray-800">{activeConf.label} — Last {readings.length} readings</h4>
                        <p className="text-xs text-gray-400">
                            Min: {activeMin.toFixed(1)} {activeConf.unit} &nbsp;|&nbsp;
                            Max: {activeMax.toFixed(1)} {activeConf.unit} &nbsp;|&nbsp;
                            Ideal: {activeConf.idealMin}–{activeConf.idealMax} {activeConf.unit}
                        </p>
                    </div>
                    <div className="flex space-x-1">
                        {METRICS.map(m => (
                            <button
                                key={m.key}
                                onClick={() => setActiveMetric(m.key)}
                                className="w-3 h-3 rounded-full transition-all"
                                style={{ background: m.color, opacity: activeMetric === m.key ? 1 : 0.3 }}
                                title={m.label}
                            />
                        ))}
                    </div>
                </div>

                <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
                    <defs>
                        <linearGradient id="bigGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={activeConf.color} stopOpacity="0.25" />
                            <stop offset="100%" stopColor={activeConf.color} stopOpacity="0.02" />
                        </linearGradient>
                    </defs>

                    {/* Ideal range band */}
                    {(() => {
                        const yMax = padY + (1 - (activeConf.idealMax - activeMin) / range) * (H - padY * 2);
                        const yMin = padY + (1 - (activeConf.idealMin - activeMin) / range) * (H - padY * 2);
                        return (
                            <rect
                                x={padX} y={Math.max(padY, yMax)}
                                width={W - padX * 2}
                                height={Math.min(H - padY, yMin) - Math.max(padY, yMax)}
                                fill={activeConf.color} opacity="0.07" rx="2"
                            />
                        );
                    })()}

                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map(t => {
                        const y = padY + t * (H - padY * 2);
                        return (
                            <g key={t}>
                                <line x1={padX} y1={y} x2={W - padX} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                                <text x={padX - 4} y={y + 4} fontSize="9" fill="#9ca3af" textAnchor="end">
                                    {(activeMax - t * range).toFixed(0)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Baseline line */}
                    {baselineValue !== undefined && (
                        <g>
                            <line
                                x1={padX} y1={padY + (1 - (baselineValue - activeMin) / range) * (H - padY * 2)}
                                x2={W - padX} y2={padY + (1 - (baselineValue - activeMin) / range) * (H - padY * 2)}
                                stroke="#000000" strokeWidth="2" strokeDasharray="6,3"
                            />
                            <text
                                x={W - padX + 4}
                                y={padY + (1 - (baselineValue - activeMin) / range) * (H - padY * 2) + 3}
                                fontSize="9" fill="#000000" fontWeight="bold"
                            >
                                {baselineValue}
                            </text>
                        </g>
                    )}

                    {/* Area fill */}
                    <polygon
                        points={`${padX},${H - padY} ${points} ${W - padX},${H - padY}`}
                        fill="url(#bigGrad)"
                    />

                    {/* Line */}
                    <polyline
                        points={points}
                        fill="none"
                        stroke={activeConf.color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Dots on data points */}
                    {activeValues.map((v, i) => {
                        const x = padX + (i / (activeValues.length - 1)) * (W - padX * 2);
                        const y = padY + (1 - (v - activeMin) / range) * (H - padY * 2);
                        return (
                            <circle key={i} cx={x} cy={y} r="2.5" fill={activeConf.color} opacity="0.7" />
                        );
                    })}

                    {/* X-axis labels */}
                    {xLabels.map(({ i, label }) => {
                        const x = padX + (i / (activeValues.length - 1)) * (W - padX * 2);
                        return (
                            <text key={i} x={x} y={H} fontSize="9" fill="#9ca3af" textAnchor="middle">{label}</text>
                        );
                    })}
                </svg>

                {/* Date range */}
                <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                    <span>{readings[0]?.dateTime.slice(0, 10)}</span>
                    <span>{readings[readings.length - 1]?.dateTime.slice(0, 10)}</span>
                </div>
            </div>

        </div>
    );
};

export default SensorDataSection;
