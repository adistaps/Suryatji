import { supabase } from './supabase';
import type { Product, ProductVariant, Category } from '@/types';

// ============================================
// CATEGORIES
// ============================================
export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return (data ?? []).map((c: any) => ({ id: c.id, name: c.name, slug: c.slug }));
}

// ============================================
// PRODUCTS
// ============================================
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(image_url, is_primary), categories(name)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map(mapProductRow);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(image_url, is_primary), categories(name)')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return mapProductRow(data);
}

export async function fetchVariantsByProductId(productId: string): Promise<ProductVariant[]> {
  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', productId);

  if (error) throw error;

  return (data ?? []).map((v: any) => ({
    id: v.id,
    productId: v.product_id,
    weight: v.weight,
    grindType: v.grind_type,
    sku: v.sku,
    price: Number(v.price),
    stock: v.stock,
  }));
}

function mapProductRow(row: any): Product {
  const primaryImage = row.product_images?.find((img: any) => img.is_primary) ?? row.product_images?.[0];
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.categories?.name ?? '',
    description: row.description ?? '',
    features: row.features ?? [],
    rating: 5,
    reviewCount: 0,
    image: primaryImage?.image_url ?? '/placeholder-coffee.jpg',
    tags: row.tags ?? [],
  };
}

// ============================================
// ADMIN: PRODUCT CRUD
// ============================================
export interface ProductFormInput {
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  origin?: string;
  features: string[];
  tags: string[];
  isActive: boolean;
}

export async function createProduct(input: ProductFormInput) {
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: input.name,
      slug: input.slug,
      category_id: input.categoryId,
      description: input.description,
      origin: input.origin,
      features: input.features,
      tags: input.tags,
      is_active: input.isActive,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, input: Partial<ProductFormInput>) {
  const { error } = await supabase
    .from('products')
    .update({
      ...(input.name && { name: input.name }),
      ...(input.slug && { slug: input.slug }),
      ...(input.categoryId && { category_id: input.categoryId }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.origin !== undefined && { origin: input.origin }),
      ...(input.features && { features: input.features }),
      ...(input.tags && { tags: input.tags }),
      ...(input.isActive !== undefined && { is_active: input.isActive }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export interface VariantFormInput {
  productId: string;
  weight: '250g' | '500g' | '1kg';
  grindType: 'whole_bean' | 'coarse' | 'medium' | 'fine' | 'espresso';
  sku: string;
  price: number;
  stock: number;
}

const WEIGHT_GRAMS: Record<string, number> = { '250g': 250, '500g': 500, '1kg': 1000 };

export async function createVariant(input: VariantFormInput) {
  const { error } = await supabase.from('product_variants').insert({
    product_id: input.productId,
    weight: input.weight,
    grind_type: input.grindType,
    weight_grams: WEIGHT_GRAMS[input.weight],
    sku: input.sku,
    price: input.price,
    stock: input.stock,
  });
  if (error) throw error;
}

export async function updateVariant(id: string, input: Partial<VariantFormInput>) {
  const { error } = await supabase
    .from('product_variants')
    .update({
      ...(input.weight && { weight: input.weight, weight_grams: WEIGHT_GRAMS[input.weight] }),
      ...(input.grindType && { grind_type: input.grindType }),
      ...(input.sku && { sku: input.sku }),
      ...(input.price !== undefined && { price: input.price }),
      ...(input.stock !== undefined && { stock: input.stock }),
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteVariant(id: string) {
  const { error } = await supabase.from('product_variants').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadProductImage(productId: string, file: File, isPrimary = false): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${productId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from('product-images').upload(path, file);
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(path);

  const { error: insertError } = await supabase.from('product_images').insert({
    product_id: productId,
    image_url: publicUrlData.publicUrl,
    is_primary: isPrimary,
  });
  if (insertError) throw insertError;

  return publicUrlData.publicUrl;
}
