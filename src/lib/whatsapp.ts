import type { CartItem, ShippingAddress } from '@/types';

const ADMIN_WA_NUMBER = (import.meta.env.VITE_ADMIN_WA_NUMBER as string) || '6281229888033';

interface BuildOrderMessageParams {
  orderNumber: string;
  items: CartItem[];
  address: ShippingAddress;
  courier: string;
  shippingCost: number;
  subtotal: number;
  total: number;
  paymentMethod: 'qris' | 'bank_transfer';
  bankLabel?: string; // e.g. "BCA - 1234567890 a.n. Saryadi Suryatji"
}

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function buildOrderWhatsAppMessage(params: BuildOrderMessageParams): string {
  const { orderNumber, items, address, courier, shippingCost, subtotal, total, paymentMethod, bankLabel } = params;

  const itemLines = items
    .map(
      (item, i) =>
        `${i + 1}. ${item.product.name} (${item.variant.weight} - ${item.variant.grindType.replace('_', ' ')}) x${item.quantity} = ${formatRupiah(item.variant.price * item.quantity)}`
    )
    .join('\n');

  const paymentLine =
    paymentMethod === 'qris' ? 'QRIS' : `Transfer Bank${bankLabel ? ` (${bankLabel})` : ''}`;

  return [
    `Halo Suryatji Coffee, saya ingin konfirmasi pesanan berikut:`,
    ``,
    `*No. Pesanan:* ${orderNumber}`,
    `*Nama:* ${address.fullName}`,
    `*No. HP:* ${address.phone}`,
    `*Alamat:* ${address.address}, ${address.district}, ${address.city}, ${address.province}`,
    ``,
    `*Detail Produk:*`,
    itemLines,
    ``,
    `*Kurir:* ${courier}`,
    `*Subtotal:* ${formatRupiah(subtotal)}`,
    `*Ongkir:* ${formatRupiah(shippingCost)}`,
    `*Total:* ${formatRupiah(total)}`,
    `*Metode Bayar:* ${paymentLine}`,
    ``,
    `Bukti pembayaran sudah saya lampirkan di web. Mohon konfirmasinya. Terima kasih!`,
  ].join('\n');
}

export function buildWhatsAppLink(message: string, phoneNumber: string = ADMIN_WA_NUMBER): string {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
