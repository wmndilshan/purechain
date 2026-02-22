
export interface Farmer {
  name: string;
  location: string;
  certifications: string[];
}

export interface HarvestInfo {
  pickingDate: string;
  batchNumber: string;
  storageMethod: string;
  fertilizersUsed?: string;
  pesticidePractice?: string;
  chemicalSafety?: string;
}

export interface ProductSpecifics {
  variety: string;
  sizeWeight: string;
  shelfLife: string;
  nutritionHighlights?: string;
  bestUse?: string;
  packaging?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  category: 'fruits' | 'vegetables' | 'value-added';
  description: string;
  farmer: Farmer;
  harvest: HarvestInfo;
  specifics: ProductSpecifics;
}

export interface CartItem extends Product {
  quantity: number;
}

/** Stored in localStorage after a successful checkout */
export interface PlacedOrder {
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  dateTime: string;
  status?: string;
}

export interface KitchenItem {
  id: string;
  name: string;
  description: string;
  category: 'Soups' | 'Salads' | 'Mains' | 'Desserts';
}

export interface Experience {
  id: string;
  title: string;
  description: string[];
  image: string;
  cta?: string;
}
