export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  features: string[];
  rating: number;
  reviewCount: number;
  image: string;
  salePrice?: number;
  tags: string[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  weight: '250g' | '500g' | '1kg';
  grindType: 'whole_bean' | 'coarse' | 'medium' | 'fine' | 'espresso';
  sku: string;
  price: number;
  stock: number;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  province: string;
  city: string;
  district: string;
  address: string;
  postalCode?: string;
}

export interface ShippingMethod {
  courier: string;
  service: string;
  cost: number;
  etd: string;
}

export type PaymentMethod = 'qris' | 'bank_transfer';

export type OrderStatus = 'pending' | 'waiting_confirmation' | 'paid' | 'shipped' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  province: string;
  city: string;
  district: string;
  shippingCost: number;
  courier: string;
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  items: CartItem[];
  createdAt: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories?: Category[];
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}
