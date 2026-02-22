// API Service for Google Sheets Backend
// Deployed Apps Script Web App URL
const API_URL = 'https://script.google.com/macros/s/AKfycbzdjd8sCB7a_d4PqIYGARIUXncM_hKkYU7BsSDXfCL7CQQKQ3Xy0rghukcISoNpCe45VQ/exec';

// Raw API shapes — match exact column names from Google Sheets
export interface APIProduct {
    'Product_id': string;
    'Product Name': string;
    'Price (Rs.)': number;
    'Stock': number | string;
    'Image': string;
    'Category': string;
}

export interface APIFarmer {
    'Farmer_id': number | string;
    'Farmer Name': string;
    'Product': string;
    'Location': string;
    'Farming Practice': string;
    'Certifications': string;
}

export interface APIOrder {
    'Order_id': number | string;
    'Product_id': string;
    'Quantity': number;
    'Date and Time': string;
    'Status': 'Pending' | 'On the way' | 'Fulfilled' | 'Cancelled' | string;
    'Process Time': number | string;
}

export interface Contact {
    email: string;
    message: string;
}

// Raw shape of a row from the "Sensor Data" sheet
export interface APISensorReading {
    'Date': string;
    'Time': string;
    'N': number;
    'P': number;
    'K': number;
    'Soil Moisture': number;
    'Gas': number;
    'Date and Time': string;
    'Changing rate N': number | string;
    'Changing rate P': number | string;
    'Changing rate K': number | string;
    'Changing rate Soil Moisture': number | string;
    'Changing rate Gas': number | string;
}

// Raw shape of a row from the "Product Info" sheet
export interface APIProductInfo {
    'Product': string;
    'Farmer ID': string | number;
    'Variety': string;
    'Size / Weight': string;
    'Shelf Life': string;
    'Nutrition Highlights': string;
    'Best Use': string;
    'Packaging': string;
}

// Raw shape of a row from the "Harvest" sheet
export interface APIHarvest {
    'Product': string;
    'Farmer Name': string;
    'Harvest_date and time': string;
    'Batch_no': string;
    'Fertilizers Used': string;
    'Pesticide Practice': string;
    'Chemical Safety': string;
}


interface APIResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

class GoogleSheetAPI {
    private apiUrl: string;

    constructor(apiUrl: string = API_URL) {
        this.apiUrl = apiUrl;
    }

    // Generic GET request
    private async get<T>(params: Record<string, string>): Promise<APIResponse<T>> {
        const queryParams = new URLSearchParams(params).toString();
        const url = `${this.apiUrl}?${queryParams}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    // Write operations are also sent as GET to avoid CORS preflight on Apps Script.
    // Data is JSON-encoded in the `data` URL param — doGet on the server parses it.
    private async write<T>(action: string, sheet: string, data: any, extra?: Record<string, string>): Promise<APIResponse<T>> {
        const params: Record<string, string> = {
            action,
            sheet,
            data: JSON.stringify(data),
            ...extra
        };
        return this.get<T>(params);
    }

    // ==================== PRODUCTS ====================

    async getAllProducts(): Promise<APIProduct[]> {
        const response = await this.get<APIProduct[]>({
            action: 'getAll',
            sheet: 'products'
        });
        return response.data;
    }

    async getProductById(id: string): Promise<APIProduct | null> {
        // Fall back to fetching all products and filtering client-side.
        // This avoids the old Apps Script field-name mismatch ('id' vs 'Product_id').
        try {
            const all = await this.getAllProducts();
            return all.find(p => String(p['Product_id']) === String(id)) ?? null;
        } catch {
            // If getAllProducts fails, try the direct lookup
            const response = await this.get<APIProduct>({
                action: 'getById',
                sheet: 'products',
                id
            });
            return response.data;
        }
    }

    async getProductsByFarmer(farmerId: string): Promise<APIProduct[]> {
        const response = await this.get<APIProduct[]>({
            action: 'getByFarmer',
            farmerId
        });
        return response.data;
    }

    async getProductsByCategory(category: string): Promise<APIProduct[]> {
        const response = await this.get<APIProduct[]>({
            action: 'getByCategory',
            category
        });
        return response.data;
    }

    async createProduct(product: Omit<APIProduct, 'Product_id'>): Promise<{ success: boolean; id: string }> {
        const response = await this.write<{ success: boolean; id: string }>('create', 'products', product);
        return response.data;
    }

    async updateProduct(product: APIProduct): Promise<{ success: boolean }> {
        const response = await this.write<{ success: boolean }>('update', 'products', product);
        return response.data;
    }

    async deleteProduct(id: string): Promise<{ success: boolean }> {
        const response = await this.get<{ success: boolean }>({
            action: 'delete', sheet: 'products', id
        });
        return response.data;
    }

    async updateStock(productId: string, quantityChange: number): Promise<{ success: boolean; newStock: number }> {
        const response = await this.get<{ success: boolean; newStock: number }>({
            action: 'updateStock',
            productId,
            quantity: String(quantityChange)
        });
        return response.data;
    }

    // ==================== FARMERS ====================

    async getAllFarmers(): Promise<APIFarmer[]> {
        const response = await this.get<APIFarmer[]>({
            action: 'getAll',
            sheet: 'farmers'
        });
        return response.data;
    }

    async getFarmerById(farmerId: string): Promise<APIFarmer | null> {
        const response = await this.get<APIFarmer>({
            action: 'getById',
            sheet: 'farmers',
            id: farmerId
        });
        return response.data;
    }

    async createFarmer(farmer: Omit<APIFarmer, 'Farmer_id'>): Promise<{ success: boolean; id: string }> {
        const response = await this.write<{ success: boolean; id: string }>('create', 'farmers', farmer);
        return response.data;
    }

    async updateFarmer(farmer: APIFarmer): Promise<{ success: boolean }> {
        const response = await this.write<{ success: boolean }>('update', 'farmers', farmer);
        return response.data;
    }

    async deleteFarmer(farmerId: string): Promise<{ success: boolean }> {
        const response = await this.get<{ success: boolean }>({
            action: 'delete', sheet: 'farmers', id: farmerId
        });
        return response.data;
    }

    // ==================== HARVEST ====================

    async getAllHarvests(): Promise<any[]> {
        const response = await this.get<any[]>({
            action: 'getAll',
            sheet: 'harvest'
        });
        return response.data;
    }

    async getHarvestById(productId: string): Promise<any | null> {
        const response = await this.get<any>({
            action: 'getById',
            sheet: 'harvest',
            id: productId
        });
        return response.data;
    }

    async createHarvest(harvest: any): Promise<{ success: boolean; id: string }> {
        const response = await this.write<{ success: boolean; id: string }>('create', 'harvest', harvest);
        return response.data;
    }

    async updateHarvest(harvest: any): Promise<{ success: boolean }> {
        const response = await this.write<{ success: boolean }>('update', 'harvest', harvest);
        return response.data;
    }

    async deleteHarvest(productId: string): Promise<{ success: boolean }> {
        const response = await this.get<{ success: boolean }>({
            action: 'delete', sheet: 'harvest', id: productId
        });
        return response.data;
    }

    // ==================== ORDERS ====================

    async getAllOrders(): Promise<APIOrder[]> {
        const response = await this.get<APIOrder[]>({
            action: 'getAll',
            sheet: 'orders'
        });
        return response.data;
    }

    async getOrderById(orderId: string): Promise<APIOrder | null> {
        const response = await this.get<APIOrder>({
            action: 'getById',
            sheet: 'orders',
            id: orderId
        });
        return response.data;
    }

    async createOrder(order: Omit<APIOrder, 'Order_id'>): Promise<{ success: boolean; id: string }> {
        const orderWithDate = {
            ...order,
            'Date and Time': order['Date and Time'] || new Date().toISOString()
        };
        const response = await this.write<{ success: boolean; id: string }>('create', 'orders', orderWithDate);
        return response.data;
    }

    async updateOrder(order: APIOrder): Promise<{ success: boolean }> {
        const response = await this.write<{ success: boolean }>('update', 'orders', order);
        return response.data;
    }

    async deleteOrder(orderId: string): Promise<{ success: boolean }> {
        const response = await this.get<{ success: boolean }>({
            action: 'delete', sheet: 'orders', id: orderId
        });
        return response.data;
    }

    // ==================== CONTACT ====================

    async getAllContacts(): Promise<Contact[]> {
        const response = await this.get<Contact[]>({
            action: 'getAll',
            sheet: 'contact'
        });
        return response.data;
    }

    async submitContact(contact: Contact): Promise<{ success: boolean }> {
        const response = await this.write<{ success: boolean }>('create', 'contact', contact);
        return response.data;
    }

    async deleteContact(email: string): Promise<{ success: boolean }> {
        const response = await this.get<{ success: boolean }>({
            action: 'delete', sheet: 'contact', id: email
        });
        return response.data;
    }

    // ==================== SENSOR DATA ====================

    async getSensorData(): Promise<APISensorReading[]> {
        const response = await this.get<APISensorReading[]>({
            action: 'getAll',
            sheet: 'Sensor Data'
        });
        return response.data ?? [];
    }

    // ==================== PRODUCT INFO ====================

    async getProductInfo(): Promise<APIProductInfo[]> {
        const response = await this.get<APIProductInfo[]>({
            action: 'getAll',
            sheet: 'Product Info'
        });
        return response.data ?? [];
    }

    // ==================== HARVEST ====================

    async getHarvestData(): Promise<APIHarvest[]> {
        const response = await this.get<APIHarvest[]>({
            action: 'getAll',
            sheet: 'Harvest'
        });
        return response.data ?? [];
    }
}

// Export singleton instance
export const api = new GoogleSheetAPI();

// Export the class for custom instances
export default GoogleSheetAPI;
