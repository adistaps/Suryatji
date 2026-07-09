import type { Product, ProductVariant, Category, BankAccount } from '@/types';

export const categories: Category[] = [
  { id: '1', name: 'Arabica Green', slug: 'arabica-green' },
  { id: '2', name: 'Arabica Roasted', slug: 'arabica-roasted' },
  { id: '3', name: 'Black Coffee', slug: 'black-coffee' },
  { id: '4', name: 'Mixed Sorts', slug: 'mixed-sorts' },
  {
    id: '5',
    name: 'Products',
    slug: 'products',
    subcategories: [
      { id: '5-1', name: 'Bakery & Sweets', slug: 'bakery-sweets' },
      { id: '5-2', name: 'Black & Green Tea', slug: 'tea' },
      { id: '5-3', name: 'Cakes', slug: 'cakes' },
      { id: '5-4', name: 'Chocolate', slug: 'chocolate' },
      { id: '5-5', name: 'Coffee Drinks', slug: 'coffee-drinks' },
      { id: '5-6', name: 'Fresh Croissants', slug: 'croissants' },
      { id: '5-7', name: 'Sandwiches', slug: 'sandwiches' },
      { id: '5-8', name: 'Sweet Cookies', slug: 'cookies' },
    ],
  },
  { id: '6', name: 'Robusta Roasted', slug: 'robusta-roasted' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Nicaragua 100% Arabica',
    slug: 'nicaragua-100-arabica',
    category: 'Arabica Green',
    description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    features: ['Pure Grades', 'Wide Assortment', 'Proper Roasting'],
    rating: 5,
    reviewCount: 1,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
    tags: ['arabica', 'coffee'],
  },
  {
    id: '2',
    name: 'Nicaragua Traditional',
    slug: 'nicaragua-traditional',
    category: 'Arabica Roasted',
    description: 'A traditional roasted coffee with a balanced flavor profile, featuring notes of caramel and chocolate with a smooth finish.',
    features: ['Pure Grades', 'Wide Assortment', 'Proper Roasting'],
    rating: 4,
    reviewCount: 3,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=400&fit=crop',
    tags: ['arabica', 'coffee'],
  },
  {
    id: '3',
    name: 'Ethiopia Arabica',
    slug: 'ethiopia-arabica',
    category: 'Arabica Green',
    description: 'Premium single-origin Arabica from the highlands of Ethiopia. Bright acidity with floral and citrus notes.',
    features: ['Pure Grades', 'Wide Assortment', 'Proper Roasting'],
    rating: 5,
    reviewCount: 8,
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&h=400&fit=crop',
    tags: ['arabica', 'coffee'],
  },
  {
    id: '4',
    name: 'Ethiopia Robusta',
    slug: 'ethiopia-robusta',
    category: 'Robusta Roasted',
    description: 'Bold and full-bodied Robusta with higher caffeine content. Earthy flavor with rich crema and strong character.',
    features: ['Pure Grades', 'Wide Assortment', 'Proper Roasting'],
    rating: 4,
    reviewCount: 2,
    image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=400&h=400&fit=crop',
    tags: ['robusta', 'coffee'],
    salePrice: 11.49,
  },
  {
    id: '5',
    name: 'Colombia Organic',
    slug: 'colombia-organic',
    category: 'Mixed Sorts',
    description: 'Certified organic Colombian coffee with a perfect balance of sweetness and acidity. Nutty undertones with a clean finish.',
    features: ['Pure Grades', 'Wide Assortment', 'Proper Roasting'],
    rating: 5,
    reviewCount: 5,
    image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=400&h=400&fit=crop',
    tags: ['blend', 'coffee'],
  },
  {
    id: '6',
    name: 'Ethiopia Organic Mix',
    slug: 'ethiopia-organic-mix',
    category: 'Mixed Sorts',
    description: 'A carefully crafted blend of organic Ethiopian beans, combining the best characteristics of multiple origins.',
    features: ['Pure Grades', 'Wide Assortment', 'Proper Roasting'],
    rating: 4,
    reviewCount: 4,
    image: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400&h=400&fit=crop',
    tags: ['blend', 'coffee'],
  },
];

export const productVariants: ProductVariant[] = [
  { id: 'v1-250-wb', productId: '1', weight: '250g', grindType: 'whole_bean', sku: 'SC-NIC-250-WB', price: 17.99, stock: 50 },
  { id: 'v1-500-wb', productId: '1', weight: '500g', grindType: 'whole_bean', sku: 'SC-NIC-500-WB', price: 32.99, stock: 35 },
  { id: 'v1-1kg-wb', productId: '1', weight: '1kg', grindType: 'whole_bean', sku: 'SC-NIC-1KG-WB', price: 59.99, stock: 20 },
  { id: 'v1-250-md', productId: '1', weight: '250g', grindType: 'medium', sku: 'SC-NIC-250-MD', price: 18.99, stock: 45 },
  { id: 'v2-250-wb', productId: '2', weight: '250g', grindType: 'whole_bean', sku: 'SC-NIC2-250-WB', price: 3.49, stock: 100 },
  { id: 'v2-500-wb', productId: '2', weight: '500g', grindType: 'whole_bean', sku: 'SC-NIC2-500-WB', price: 6.49, stock: 80 },
  { id: 'v3-250-wb', productId: '3', weight: '250g', grindType: 'whole_bean', sku: 'SC-ETH-250-WB', price: 16.99, stock: 40 },
  { id: 'v3-500-wb', productId: '3', weight: '500g', grindType: 'whole_bean', sku: 'SC-ETH-500-WB', price: 30.99, stock: 30 },
  { id: 'v3-250-md', productId: '3', weight: '250g', grindType: 'medium', sku: 'SC-ETH-250-MD', price: 17.99, stock: 35 },
  { id: 'v4-250-wb', productId: '4', weight: '250g', grindType: 'whole_bean', sku: 'SC-ETHR-250-WB', price: 11.49, stock: 60 },
  { id: 'v4-500-wb', productId: '4', weight: '500g', grindType: 'whole_bean', sku: 'SC-ETHR-500-WB', price: 20.99, stock: 45 },
  { id: 'v5-250-wb', productId: '5', weight: '250g', grindType: 'whole_bean', sku: 'SC-COL-250-WB', price: 25.00, stock: 25 },
  { id: 'v5-500-wb', productId: '5', weight: '500g', grindType: 'whole_bean', sku: 'SC-COL-500-WB', price: 45.00, stock: 20 },
  { id: 'v6-250-wb', productId: '6', weight: '250g', grindType: 'whole_bean', sku: 'SC-ETHM-250-WB', price: 13.49, stock: 55 },
  { id: 'v6-500-wb', productId: '6', weight: '500g', grindType: 'whole_bean', sku: 'SC-ETHM-500-WB', price: 24.99, stock: 40 },
];

export const bankAccounts: BankAccount[] = [
  { id: '1', bankName: 'BCA', accountNumber: '1234567890', accountHolder: 'Saryadi Suryatji', isActive: true },
  { id: '2', bankName: 'BSI', accountNumber: '0987654321', accountHolder: 'Saryadi Suryatji', isActive: true },
  { id: '3', bankName: 'Mandiri', accountNumber: '1122334455', accountHolder: 'Saryadi Suryatji', isActive: true },
];

export const productTags = ['arabica', 'chocolate', 'coffee', 'delivery', 'espresso'];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export const getVariantsByProductId = (productId: string): ProductVariant[] => {
  return productVariants.filter(v => v.productId === productId);
};

export const getRelatedProducts = (productId: string, limit: number = 3): Product[] => {
  return products.filter(p => p.id !== productId).slice(0, limit);
};
