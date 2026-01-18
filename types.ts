
export interface Farmer {
  name: string;
  location: string;
  certifications: string[];
}

export interface HarvestInfo {
  pickingDate: string;
  batchNumber: string;
  storageMethod: string;
}

export interface ProductSpecifics {
  variety: string;
  sizeWeight: string;
  shelfLife: string;
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
