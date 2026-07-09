import type { ShippingMethod } from '@/types';

const KOMERCE_API_KEY = import.meta.env.VITE_KOMERCE_API_KEY as string | undefined;
const KOMERCE_BASE_URL = (import.meta.env.VITE_KOMERCE_BASE_URL as string) || 'https://api.komerce.id/v1';
const ORIGIN_CITY = (import.meta.env.VITE_ORIGIN_CITY as string) || 'Temanggung';

interface CheckShippingParams {
  destinationCity: string;
  totalWeightGrams: number;
}

/**
 * Cek ongkir. Jika VITE_KOMERCE_API_KEY belum diisi, otomatis pakai
 * mock/dummy data supaya development & testing checkout tetap bisa jalan
 * tanpa API key asli. Begitu API key diisi di .env, otomatis pakai API asli.
 */
export async function checkShipping({ destinationCity, totalWeightGrams }: CheckShippingParams): Promise<ShippingMethod[]> {
  if (!KOMERCE_API_KEY) {
    return getMockShippingRates(totalWeightGrams);
  }

  try {
    const res = await fetch(`${KOMERCE_BASE_URL}/cost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KOMERCE_API_KEY,
      },
      body: JSON.stringify({
        origin: ORIGIN_CITY,
        destination: destinationCity,
        weight: totalWeightGrams,
        courier: 'jne:jnt:sicepat',
      }),
    });

    if (!res.ok) throw new Error(`Komerce API error: ${res.status}`);

    const data = await res.json();
    // Sesuaikan mapping ini dengan bentuk response asli Komerce saat API key sudah aktif
    return (data.data ?? []).map((item: any) => ({
      courier: item.courier_name,
      service: item.service,
      cost: item.cost,
      etd: item.etd,
    }));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Komerce] Gagal ambil ongkir, fallback ke mock:', err);
    return getMockShippingRates(totalWeightGrams);
  }
}

function getMockShippingRates(totalWeightGrams: number): ShippingMethod[] {
  const weightKg = Math.max(1, Math.ceil(totalWeightGrams / 1000));
  return [
    { courier: 'JNE', service: 'REG', cost: 12000 * weightKg, etd: '2-4 hari' },
    { courier: 'JNE', service: 'YES', cost: 20000 * weightKg, etd: '1-2 hari' },
    { courier: 'J&T', service: 'EZ', cost: 10000 * weightKg, etd: '2-3 hari' },
    { courier: 'SiCepat', service: 'REG', cost: 11000 * weightKg, etd: '2-4 hari' },
  ];
}

export const WEIGHT_GRAMS_MAP: Record<string, number> = {
  '250g': 250,
  '500g': 500,
  '1kg': 1000,
};
