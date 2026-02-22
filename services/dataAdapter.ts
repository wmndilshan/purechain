import { APIProduct, APIFarmer, APIProductInfo, APIHarvest } from './googleSheetAPI';
import { Product, Farmer, HarvestInfo, ProductSpecifics } from '../types';

/**
 * Transforms Google Sheets API data to app interfaces.
 * Uses real data from Products, Farmers, Product Info, and Harvest sheets.
 */

// ─── Module-level caches ──────────────────────────────────────────────────────

let farmersCache: APIFarmer[] = [];
let productInfoCache: APIProductInfo[] = [];
let harvestCache: APIHarvest[] = [];

export function setFarmersCache(farmers: APIFarmer[]) {
    farmersCache = farmers ?? [];
}

export function setProductInfoCache(rows: APIProductInfo[]) {
    productInfoCache = rows ?? [];
}

export function setHarvestCache(rows: APIHarvest[]) {
    harvestCache = rows ?? [];
}

// ─── Lookup helpers ───────────────────────────────────────────────────────────

function findFarmerForProduct(productName: string): APIFarmer | undefined {
    return farmersCache.find(
        f => f['Product']?.toLowerCase() === productName?.toLowerCase()
    );
}

function findProductInfo(productName: string): APIProductInfo | undefined {
    return productInfoCache.find(
        p => p['Product']?.toLowerCase() === productName?.toLowerCase()
    );
}

function findHarvest(productName: string): APIHarvest | undefined {
    return harvestCache.find(
        h => h['Product']?.toLowerCase() === productName?.toLowerCase()
    );
}

// ─── Adapters ─────────────────────────────────────────────────────────────────

/**
 * Convert API Product → App Product
 * Uses real data from Farmers, Product Info, and Harvest sheets where available.
 */
export function adaptAPIProduct(apiProduct: APIProduct): Product {
    const stockRaw = apiProduct['Stock'];
    const inStock = stockRaw !== 'NA' && stockRaw !== '' && Number(stockRaw) > 0;

    const productName = apiProduct['Product Name'];
    const farmer = findFarmerForProduct(productName);
    const info = findProductInfo(productName);
    const harvest = findHarvest(productName);

    // ── Farmer ────────────────────────────────────────────────────────────────
    const appFarmer: Farmer = {
        name: farmer?.['Farmer Name'] ?? 'PureChain Farmer',
        location: farmer?.['Location'] ?? 'Sri Lanka',
        certifications: farmer
            ? farmer['Certifications'].split(',').map(c => c.trim()).filter(Boolean)
            : ['Organic Certified'],
    };

    // ── Harvest Info ──────────────────────────────────────────────────────────
    let pickingDate = new Date().toLocaleDateString('en-GB');
    if (harvest?.['Harvest_date and time']) {
        try {
            pickingDate = new Date(harvest['Harvest_date and time']).toLocaleDateString('en-GB');
        } catch { /* fallback to today */ }
    }

    const appHarvest: HarvestInfo = {
        pickingDate,
        batchNumber: harvest?.['Batch_no']
            ? String(harvest['Batch_no'])
            : `BATCH-${apiProduct['Product_id']}`,
        storageMethod: farmer?.['Farming Practice'] ?? 'Fresh, stored under optimal conditions',
        fertilizersUsed: harvest?.['Fertilizers Used'] || undefined,
        pesticidePractice: harvest?.['Pesticide Practice'] || undefined,
        chemicalSafety: harvest?.['Chemical Safety'] || undefined,
    };

    // ── Product Specifics (real data from Product Info sheet) ─────────────────
    const appSpecifics: ProductSpecifics = {
        variety: info?.['Variety'] ?? 'Premium Quality',
        sizeWeight: info?.['Size / Weight'] ?? 'Standard size',
        shelfLife: info?.['Shelf Life'] ?? '3-7 days when refrigerated',
        nutritionHighlights: info?.['Nutrition Highlights'] || undefined,
        bestUse: info?.['Best Use'] || undefined,
        packaging: info?.['Packaging'] || undefined,
    };

    // ── Category ──────────────────────────────────────────────────────────────
    const rawCategory = (apiProduct['Category'] ?? '').toLowerCase();
    let category: Product['category'] = 'vegetables';
    if (rawCategory === 'fruits') category = 'fruits';
    else if (rawCategory === 'value-added') category = 'value-added';

    // ── Description (use nutrition + best-use if available) ───────────────────
    const description = info?.['Best Use']
        ? `${info['Best Use']}. Sourced directly from certified Sri Lankan farms.`
        : `Fresh organic ${productName.toLowerCase()} sourced directly from our certified farms.`;

    return {
        id: String(apiProduct['Product_id']),
        name: productName,
        price: Number(apiProduct['Price (Rs.)']) || 0,
        image: apiProduct['Image'] ||
            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
        inStock,
        category,
        description,
        farmer: appFarmer,
        harvest: appHarvest,
        specifics: appSpecifics,
    };
}

/**
 * Convert array of API Products → App Products
 * Filters out empty rows (last blank row in sheet).
 */
export function adaptAPIProducts(apiProducts: APIProduct[]): Product[] {
    return apiProducts
        .filter(p => p['Product_id'] && p['Product Name'])
        .map(adaptAPIProduct);
}
