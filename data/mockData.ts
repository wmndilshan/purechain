
import { Product, KitchenItem, Experience } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Carrots',
    price: 1162,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    category: 'vegetables',
    description: 'Freshly harvested organic carrots from the cool climates of Nuwara Eliya.',
    farmer: {
      name: 'Mr. Sunil Perera',
      location: 'Nuwara Eliya District, Sri Lanka',
      certifications: ['HACCP Certified', 'Local Organic Certification']
    },
    harvest: {
      pickingDate: '24/12/2025',
      batchNumber: 'CAR-NE-001',
      storageMethod: 'Washed, packed, and stored under cool conditions to maintain freshness.'
    },
    specifics: {
      variety: 'Local Orange Carrot',
      sizeWeight: 'Medium, sold per kg',
      shelfLife: '5-7 days if refrigerated'
    }
  },
  {
    id: '2',
    name: 'Tomatoes',
    price: 0,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f02bad67b?auto=format&fit=crop&q=80&w=400',
    inStock: false,
    category: 'vegetables',
    description: 'Sun-ripened organic tomatoes with rich flavor.',
    farmer: { name: 'Mrs. Kumari', location: 'Dambulla', certifications: ['Organic LKA'] },
    harvest: { pickingDate: '20/12/2025', batchNumber: 'TOM-DA-04', storageMethod: 'Room temp' },
    specifics: { variety: 'Roma', sizeWeight: 'Assorted', shelfLife: '3-4 days' }
  },
  {
    id: '3',
    name: 'Cauliflower',
    price: 1890,
    image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3fb3?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    category: 'vegetables',
    description: 'Crisp, white organic cauliflower heads.',
    farmer: { name: 'Mr. Bandara', location: 'Bandarawela', certifications: ['Purity Guaranteed'] },
    harvest: { pickingDate: '23/12/2025', batchNumber: 'CAU-BW-09', storageMethod: 'Cold storage' },
    specifics: { variety: 'Snowball', sizeWeight: 'Large head', shelfLife: '5 days' }
  },
  {
    id: '4',
    name: 'Cabbage',
    price: 0,
    image: 'https://images.unsplash.com/photo-1550142414-0518695d9140?auto=format&fit=crop&q=80&w=400',
    inStock: false,
    category: 'vegetables',
    description: 'Nutrient-dense organic green cabbage.',
    farmer: { name: 'Mr. Perera', location: 'Nuwara Eliya', certifications: ['Certified Safe'] },
    harvest: { pickingDate: '22/12/2025', batchNumber: 'CAB-NE-12', storageMethod: 'Chilled' },
    specifics: { variety: 'Drumhead', sizeWeight: 'Medium', shelfLife: '10 days' }
  },
  {
    id: '5',
    name: 'Brinjal',
    price: 910,
    image: 'https://images.unsplash.com/photo-1628102434053-155986958428?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    category: 'vegetables',
    description: 'Glossy purple eggplants from the southern plains.',
    farmer: { name: 'Mr. Silva', location: 'Matara', certifications: ['SL GAP'] },
    harvest: { pickingDate: '24/12/2025', batchNumber: 'BRN-MA-02', storageMethod: 'Natural ambient' },
    specifics: { variety: 'Long Purple', sizeWeight: 'Approx 200g each', shelfLife: '4 days' }
  },
  {
    id: '6',
    name: 'Banana Seeni',
    price: 280,
    image: 'https://images.unsplash.com/photo-1571771894821-ad9902535ce4?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    category: 'fruits',
    description: 'Sweet and petite Seeni Bananas, a local favorite.',
    farmer: { name: 'Mr. Ranatunga', location: 'Anuradhapura', certifications: ['Traditional Farming'] },
    harvest: { pickingDate: '25/12/2025', batchNumber: 'BAN-AN-15', storageMethod: 'Ventilated crates' },
    specifics: { variety: 'Seeni Kesel', sizeWeight: 'Per bunch', shelfLife: '3-5 days' }
  },
  {
    id: '7',
    name: 'Ladies Fingers',
    price: 0,
    image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d02d?auto=format&fit=crop&q=80&w=400',
    inStock: false,
    category: 'vegetables',
    description: 'Tender okra grown using natural pesticides.',
    farmer: { name: 'Mr. Wickramasinghe', location: 'Kurunegala', certifications: ['Pure Green'] },
    harvest: { pickingDate: '24/12/2025', batchNumber: 'LFG-KU-11', storageMethod: 'Paper bags' },
    specifics: { variety: 'Local Green', sizeWeight: 'Young pods', shelfLife: '2-3 days' }
  }
];

export const KITCHEN_MENU: KitchenItem[] = [
  { id: 's1', name: 'Organic Pumpkin & Coconut Soup', description: 'Slow cooked pumpkin blended with fresh coconut milk, garlic, and gentle spices.', category: 'Soups' },
  { id: 's2', name: 'Roasted Tomato & Basil Soup', description: 'Sun-ripened organic tomatoes slow-roasted and blended with fresh basil and olive oil.', category: 'Soups' },
  { id: 'sa1', name: 'PureChain Garden Salad', description: 'Fresh organic greens, cucumber, cherry tomatoes, carrots, and avocado with lemon-honey dressing.', category: 'Salads' },
  { id: 'm1', name: 'Organic Vegetable Rice Bowl', description: 'Steamed red or brown rice topped with seasonal farm vegetables and coconut sambol.', category: 'Mains' },
  { id: 'd1', name: 'Banana & Date Cake', description: 'Soft, moist cake made with ripe organic bananas, dates, and whole-grain flour (No refined sugar).', category: 'Desserts' }
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'stay',
    title: 'Farm Stays – Live the Organic Life',
    description: [
      'Wake up to fresh air, birdsong, and the gentle rhythm of farm life.',
      'Eco-friendly accommodations surrounded by greenery.',
      'Farm-to-table meals prepared with freshly harvested organic produce.',
      'Peaceful mornings and slow evenings immersed in nature.'
    ],
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600',
    cta: 'Book Your Stay'
  },
  {
    id: 'visit',
    title: 'Farm Visits – Discover How Pure Food is Grown',
    description: [
      'Step into the heart of PureChain with guided farm visits.',
      'Learn how we grow food without chemicals or shortcuts.',
      'Understand organic farming, soil health, and natural cycles.',
      'Interact with farmers and see sustainable agriculture in action.'
    ],
    image: 'https://images.unsplash.com/photo-1592388755551-20357611f98c?auto=format&fit=crop&q=80&w=600',
    cta: 'Schedule a Visit'
  },
  {
    id: 'pick',
    title: 'Pick, Buy & Taste – Harvest Your Own Freshness',
    description: [
      'Experience the joy of picking your own produce straight from the farm.',
      'Hand-pick vegetables, fruits, and herbs at peak freshness.',
      'Buy directly from the source—transparent, fresh, and ethical.',
      'A fun, mindful, and rewarding farm-to-plate experience.'
    ],
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600',
    cta: 'Start Harvesting'
  }
];
