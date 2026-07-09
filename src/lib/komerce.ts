import { supabase } from './supabase';
import type { ShippingMethod } from '@/types';

const KOMERCE_API_KEY = import.meta.env.VITE_KOMERCE_API_KEY as string | undefined;
// Gunakan proxy Vite di dev agar tidak kena CORS, URL langsung di production
const KOMERCE_BASE_URL = import.meta.env.DEV
  ? '/api/komerce'
  : ((import.meta.env.VITE_KOMERCE_BASE_URL as string) || 'https://rajaongkir.komerce.id/api/v1');
const ORIGIN_CITY = (import.meta.env.VITE_ORIGIN_CITY as string) || 'Temanggung';

export interface Province {
  id: number;
  name: string;
}

export interface City {
  id: number;
  province_id: number;
  name: string;
  type: string;
}

export interface District {
  id: number;
  city_id: number;
  name: string;
}

export interface SubDistrict {
  id: number;
  district_id: number;
  name: string;
  zip_code?: string;
}

interface CheckShippingParams {
  destinationSubDistrictId: number;
  totalWeightGrams: number;
}

// Helper — panggil API Komerce dengan header key
async function fetchKomerce(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'key': KOMERCE_API_KEY || '',
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  const response = await fetch(`${KOMERCE_BASE_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    throw new Error(`Komerce API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// Ambil array results dari response (format: { data: [...] })
function extractData(res: Record<string, unknown>): Record<string, unknown>[] {
  if (Array.isArray(res.data)) return res.data as Record<string, unknown>[];
  // fallback lama kalau ada perubahan format
  if (res.rajaongkir && Array.isArray((res.rajaongkir as Record<string, unknown>).results)) {
    return (res.rajaongkir as Record<string, unknown[]>).results as Record<string, unknown>[];
  }
  if (Array.isArray(res.results)) return res.results as Record<string, unknown>[];
  return [];
}

/**
 * Fetch semua provinsi. Cek Supabase dulu, jika kosong fetch dari API lalu cache.
 */
export async function fetchProvinces(): Promise<Province[]> {
  // 1. Coba dari Supabase
  try {
    const { data, error } = await supabase
      .from('shipping_provinces')
      .select('id, name')
      .order('name');
    if (!error && data && data.length > 0) return data as Province[];
  } catch {/* tabel belum ada, lanjut ke API */}

  // 2. Fallback mock jika tidak ada API key
  if (!KOMERCE_API_KEY) return getMockProvinces();

  // 3. Fetch dari API
  try {
    const res = await fetchKomerce('/destination/province');
    const results = extractData(res);
    const provinces: Province[] = results.map(p => ({
      id: Number(p.id),
      name: String(p.name),
    }));
    if (provinces.length > 0) {
      supabase.from('shipping_provinces').upsert(provinces)
        .then(({ error }) => { if (error) console.warn('[Komerce] cache provinsi gagal:', error.message); });
    }
    return provinces;
  } catch (err) {
    console.error('[Komerce] fetchProvinces error:', err);
    return getMockProvinces();
  }
}

/**
 * Fetch kota dalam provinsi.
 */
export async function fetchCities(provinceId: number): Promise<City[]> {
  try {
    const { data, error } = await supabase
      .from('shipping_cities')
      .select('id, province_id, name, type')
      .eq('province_id', provinceId)
      .order('name');
    if (!error && data && data.length > 0) return data as City[];
  } catch {/* tabel belum ada */}

  if (!KOMERCE_API_KEY) return getMockCities(provinceId);

  try {
    const res = await fetchKomerce(`/destination/city/${provinceId}`);
    const results = extractData(res);
    const cities: City[] = results.map(c => ({
      id: Number(c.id),
      province_id: provinceId,
      name: String(c.name),
      type: String(c.type || ''),
    }));
    if (cities.length > 0) {
      supabase.from('shipping_cities').upsert(cities)
        .then(({ error }) => { if (error) console.warn('[Komerce] cache kota gagal:', error.message); });
    }
    return cities;
  } catch (err) {
    console.error('[Komerce] fetchCities error:', err);
    return getMockCities(provinceId);
  }
}

/**
 * Fetch kecamatan dalam kota.
 */
export async function fetchDistricts(cityId: number): Promise<District[]> {
  try {
    const { data, error } = await supabase
      .from('shipping_districts')
      .select('id, city_id, name')
      .eq('city_id', cityId)
      .order('name');
    if (!error && data && data.length > 0) return data as District[];
  } catch {/* tabel belum ada */}

  if (!KOMERCE_API_KEY) return [{ id: 3791, city_id: cityId, name: 'TEMANGGUNG' }];

  try {
    const res = await fetchKomerce(`/destination/district/${cityId}`);
    const results = extractData(res);
    const districts: District[] = results.map(d => ({
      id: Number(d.id),
      city_id: cityId,
      name: String(d.name),
    }));
    if (districts.length > 0) {
      supabase.from('shipping_districts').upsert(districts)
        .then(({ error }) => { if (error) console.warn('[Komerce] cache kecamatan gagal:', error.message); });
    }
    return districts;
  } catch (err) {
    console.error('[Komerce] fetchDistricts error:', err);
    return [];
  }
}

/**
 * Fetch kelurahan/desa dalam kecamatan.
 */
export async function fetchSubDistricts(districtId: number): Promise<SubDistrict[]> {
  try {
    const { data, error } = await supabase
      .from('shipping_sub_districts')
      .select('id, district_id, name, zip_code')
      .eq('district_id', districtId)
      .order('name');
    if (!error && data && data.length > 0) return data as SubDistrict[];
  } catch {/* tabel belum ada */}

  if (!KOMERCE_API_KEY) {
    return [{ id: 45145, district_id: districtId, name: 'BANYUURIP', zip_code: '56211' }];
  }

  try {
    const res = await fetchKomerce(`/destination/sub-district/${districtId}`);
    const results = extractData(res);
    const subDistricts: SubDistrict[] = results.map(s => ({
      id: Number(s.id),
      district_id: districtId,
      name: String(s.name),
      zip_code: s.zip_code ? String(s.zip_code) : undefined,
    }));
    if (subDistricts.length > 0) {
      supabase.from('shipping_sub_districts').upsert(subDistricts)
        .then(({ error }) => { if (error) console.warn('[Komerce] cache kelurahan gagal:', error.message); });
    }
    return subDistricts;
  } catch (err) {
    console.error('[Komerce] fetchSubDistricts error:', err);
    return [];
  }
}

/**
 * Kalkulasi ongkir menggunakan sub-district ID sebagai tujuan.
 */
export async function checkShipping({ destinationSubDistrictId, totalWeightGrams }: CheckShippingParams): Promise<ShippingMethod[]> {
  if (!KOMERCE_API_KEY) return getMockShippingRates(totalWeightGrams);

  try {
    const res = await fetchKomerce('/calculate/district/domestic-cost', {
      method: 'POST',
      body: JSON.stringify({
        origin: ORIGIN_CITY,
        originType: 'city',
        destination: String(destinationSubDistrictId),
        destinationType: 'subdistrict',
        weight: totalWeightGrams,
        courier: 'jne:jnt:sicepat',
      }),
    });

    const results = extractData(res);
    const formatted: ShippingMethod[] = [];

    for (const courier of results) {
      const courierName = String(courier.name || (courier.code as string || '').toUpperCase());
      const costs = Array.isArray(courier.costs) ? courier.costs as Record<string, unknown>[] : [];
      for (const costObj of costs) {
        const costArr = Array.isArray(costObj.cost) ? costObj.cost as Record<string, unknown>[] : [];
        const costDetail = costArr[0];
        if (costDetail) {
          formatted.push({
            courier: courierName,
            service: String(costObj.service || ''),
            cost: Number(costDetail.value || 0),
            etd: costDetail.etd ? `${costDetail.etd} hari` : '2-4 hari',
          });
        }
      }
    }

    return formatted.length > 0 ? formatted : getMockShippingRates(totalWeightGrams);
  } catch (err) {
    console.error('[Komerce] checkShipping error, fallback ke mock:', err);
    return getMockShippingRates(totalWeightGrams);
  }
}

// ---- Data Fallback (tanpa API key) ----

function getMockProvinces(): Province[] {
  return [
    { id: 5, name: 'JAWA BARAT' },
    { id: 10, name: 'DKI JAKARTA' },
    { id: 11, name: 'BANTEN' },
    { id: 12, name: 'JAWA TENGAH' },
    { id: 13, name: 'JAWA TIMUR' },
    { id: 14, name: 'DI YOGYAKARTA' },
    { id: 22, name: 'BALI' },
    { id: 30, name: 'SUMATERA UTARA' },
  ];
}

function getMockCities(provinceId: number): City[] {
  if (provinceId === 12) {
    return [
      { id: 387, province_id: 12, name: 'TEMANGGUNG', type: 'Kabupaten' },
      { id: 383, province_id: 12, name: 'MAGELANG', type: 'Kabupaten' },
      { id: 560, province_id: 12, name: 'SEMARANG', type: 'Kota' },
    ];
  }
  return [{ id: 999, province_id: provinceId, name: 'KOTA CONTOH', type: 'Kota' }];
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
