import { APISensorReading } from './googleSheetAPI';
import { SensorReading } from '../components/SensorDataSection';

/**
 * Convert a raw Apps Script sensor row to the app's SensorReading shape.
 */
export function adaptSensorReading(raw: APISensorReading): SensorReading {
    return {
        dateTime: String(raw['Date and Time'] || `${raw['Date']} ${raw['Time']}`),
        N: Number(raw['N']) || 0,
        P: Number(raw['P']) || 0,
        K: Number(raw['K']) || 0,
        soilMoisture: Number(raw['Soil Moisture']) || 0,
        gas: Number(raw['Gas']) || 0,
        rateN: Number(raw['Changing rate N']) || 0,
        rateP: Number(raw['Changing rate P']) || 0,
        rateK: Number(raw['Changing rate K']) || 0,
        rateSoilMoisture: Number(raw['Changing rate Soil Moisture']) || 0,
        rateGas: Number(raw['Changing rate Gas']) || 0,
    };
}

/**
 * Deterministic seeded random — gives the same noise for the same product each call.
 * Uses a simple mulberry32 algorithm.
 */
function seededRandom(seed: number) {
    let s = seed;
    return () => {
        s |= 0; s = s + 0x6D2B79F5 | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Generates a number seed from a product ID string.
 */
function strSeed(id: string): number {
    return id.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 7);
}

/**
 * Add random noise to a real CA sensor reading to simulate data for other products.
 * Each metric gets a different noise level to look realistic.
 * Noise amplitude (±) as % of the real value.
 */
const NOISE_PCT: Record<keyof Omit<SensorReading, 'dateTime'>, number> = {
    N: 0.12,
    P: 0.10,
    K: 0.12,
    soilMoisture: 0.18,
    gas: 0.08,
    rateN: 0.40,
    rateP: 0.40,
    rateK: 0.40,
    rateSoilMoisture: 0.40,
    rateGas: 0.40,
};

/**
 * Takes real CA sensor readings and returns noise-added readings for a given product.
 * The noise is deterministic per product so the chart always looks the same.
 */
export function addNoiseToReadings(
    realReadings: SensorReading[],
    productId: string
): SensorReading[] {
    const rng = seededRandom(strSeed(productId));

    // Compute a per-product bias offset (±5–20%)
    const bias: Partial<Record<keyof Omit<SensorReading, 'dateTime'>, number>> = {};
    for (const key of Object.keys(NOISE_PCT) as (keyof typeof NOISE_PCT)[]) {
        const pct = NOISE_PCT[key];
        bias[key] = (rng() * 2 - 1) * pct * 0.5; // half-amplitude as a constant offset
    }

    return realReadings.map(r => {
        const noisy: SensorReading = { dateTime: r.dateTime } as SensorReading;
        for (const key of Object.keys(NOISE_PCT) as (keyof typeof NOISE_PCT)[]) {
            const original = r[key] as number;
            const pct = NOISE_PCT[key];
            const noise = (rng() * 2 - 1) * pct + (bias[key] ?? 0);
            const value = original * (1 + noise);
            // Round to same precision as original
            noisy[key] = Math.round(value * 10) / 10;
        }
        return noisy;
    });
}
