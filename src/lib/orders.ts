import { supabase } from './supabase';
import type { CartItem, ShippingAddress, PaymentMethod, OrderStatus } from '@/types';

interface CreateOrderInput {
  address: ShippingAddress;
  items: CartItem[];
  courier: string;
  shippingCost: number;
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  bankAccountId?: string;
}

function generateOrderNumber(): string {
  const today = new Date();
  const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SC-${dateStr}-${rand}`;
}

export async function createOrder(input: CreateOrderInput): Promise<{ id: string; orderNumber: string }> {
  const orderNumber = generateOrderNumber();
  const orderId = crypto.randomUUID(); // generate ID di client

  const { error: orderError } = await supabase
    .from('orders')
    .insert({
      id: orderId,
      order_number: orderNumber,
      customer_name: input.address.fullName,
      customer_phone: input.address.phone,
      customer_email: input.address.email,
      customer_address: input.address.address,
      province: input.address.province,
      city: input.address.city,
      district: input.address.district,
      postal_code: input.address.postalCode,
      shipping_cost: input.shippingCost,
      courier: input.courier,
      subtotal: input.subtotal,
      total: input.total,
      payment_method: input.paymentMethod,
      bank_account_id: input.bankAccountId ?? null,
      status: 'pending',
    });

  if (orderError) throw orderError;

  const orderItemsPayload = input.items.map((item) => ({
    order_id: orderId,
    product_variant_id: item.variant.id,
    product_name_snapshot: item.product.name,
    variant_label_snapshot: `${item.variant.weight} - ${item.variant.grindType.replace('_', ' ')}`,
    qty: item.quantity,
    price_snapshot: item.variant.price,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);
  if (itemsError) throw itemsError;

  return { id: orderId, orderNumber };
}

export async function uploadPaymentProof(orderId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${orderId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from('payment-proofs').upload(path, file);
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage.from('payment-proofs').getPublicUrl(path);

  const { error: insertError } = await supabase.from('payment_proofs').insert({
    order_id: orderId,
    image_url: publicUrlData.publicUrl,
  });
  if (insertError) throw insertError;

  const { error: statusError } = await supabase
    .from('orders')
    .update({ status: 'waiting_confirmation', updated_at: new Date().toISOString() })
    .eq('id', orderId);
  if (statusError) throw statusError;

  return publicUrlData.publicUrl;
}

// ============================================
// ADMIN: ORDER MANAGEMENT
// ============================================
export async function fetchOrders(status?: OrderStatus) {
  let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchOrderDetail(orderId: string) {
  const { data: order, error } = await supabase.from('orders').select('*').eq('id', orderId).single();
  if (error) throw error;

  const { data: items } = await supabase.from('order_items').select('*').eq('order_id', orderId);
  const { data: proofs } = await supabase.from('payment_proofs').select('*').eq('order_id', orderId);

  return { order, items: items ?? [], proofs: proofs ?? [] };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);
  if (error) throw error;
}

// ============================================
// ADMIN: REPORTS
// ============================================
export async function fetchSalesReport(startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .in('status', ['paid', 'shipped', 'completed'])
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}
