import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Star, Image } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  createProduct, updateProduct, deleteProduct,
  createVariant, deleteVariant,
  fetchVariantsByProductId,
  uploadProductImage,
} from '@/lib/products';
import type { ProductVariant } from '@/types';

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  categories: { name: string } | null;
  is_active: boolean;
}

interface CategoryRow {
  id: string;
  name: string;
}

interface ProductImage {
  id: string;
  image_url: string;
  is_primary: boolean;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '', slug: '', categoryId: '', description: '', origin: '', features: [] as string[], tags: [] as string[], isActive: true,
  });
  const [featureInput, setFeatureInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [variantForm, setVariantForm] = useState({
    weight: '250g' as '250g' | '500g' | '1kg',
    grindType: 'whole_bean' as 'whole_bean' | 'coarse' | 'medium' | 'fine' | 'espresso',
    sku: '', price: '', stock: '',
  });

  const loadData = async () => {
    setLoading(true);
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('id, name, slug, category_id, is_active, categories(name)').order('created_at', { ascending: false }),
      supabase.from('categories').select('id, name').order('name'),
    ]);
    setProducts((prods as any) ?? []);
    setCategories(cats ?? []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const loadImages = async (productId: string) => {
    const { data } = await supabase
      .from('product_images')
      .select('id, image_url, is_primary')
      .eq('product_id', productId)
      .order('is_primary', { ascending: false });
    setImages((data as ProductImage[]) ?? []);
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setForm({ name: '', slug: '', categoryId: categories[0]?.id ?? '', description: '', origin: '', features: [], tags: [], isActive: true });
    setFeatureInput('');
    setTagInput('');
    setVariants([]);
    setImages([]);
    setShowForm(true);
  };

  const openEditForm = async (p: ProductRow) => {
    setEditingProduct(p);
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', p.id)
      .single();

    setForm({
      name: p.name,
      slug: p.slug,
      categoryId: p.category_id ?? '',
      description: data?.description ?? '',
      origin: data?.origin ?? '',
      features: data?.features ?? [],
      tags: data?.tags ?? [],
      isActive: p.is_active
    });
    setFeatureInput('');
    setTagInput('');
    setShowForm(true);
    const [v] = await Promise.all([
      fetchVariantsByProductId(p.id),
      loadImages(p.id),
    ]);
    setVariants(v);
  };

  const handleSaveProduct = async () => {
    if (!form.name || !form.slug) return;
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          name: form.name, slug: form.slug, categoryId: form.categoryId,
          description: form.description, origin: form.origin, isActive: form.isActive,
          features: form.features, tags: form.tags,
        });
      } else {
        const created = await createProduct({
          name: form.name, slug: form.slug, categoryId: form.categoryId,
          description: form.description, origin: form.origin, isActive: form.isActive,
          features: form.features, tags: form.tags,
        });
        const newProduct: ProductRow = { id: created.id, name: form.name, slug: form.slug, category_id: form.categoryId, categories: null, is_active: form.isActive };
        setEditingProduct(newProduct);
        await loadImages(created.id);
      }
      await loadData();
    } catch (err) {
      console.error('Gagal simpan produk:', err);
      alert('Gagal menyimpan produk. Cek console untuk detail.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Hapus produk ini beserta semua variannya?')) return;
    await deleteProduct(id);
    await loadData();
    setShowForm(false);
  };

  const handleAddVariant = async () => {
    if (!editingProduct || !variantForm.sku || !variantForm.price) return;
    try {
      await createVariant({
        productId: editingProduct.id,
        weight: variantForm.weight,
        grindType: variantForm.grindType,
        sku: variantForm.sku,
        price: Number(variantForm.price),
        stock: Number(variantForm.stock) || 0,
      });
      const v = await fetchVariantsByProductId(editingProduct.id);
      setVariants(v);
      setVariantForm({ weight: '250g', grindType: 'whole_bean', sku: '', price: '', stock: '' });
    } catch (err) {
      console.error('Gagal tambah varian:', err);
      alert('Gagal menambah varian. SKU mungkin sudah dipakai.');
    }
  };

  const handleDeleteVariant = async (id: string) => {
    await deleteVariant(id);
    if (editingProduct) setVariants(await fetchVariantsByProductId(editingProduct.id));
  };

  // ── IMAGE UPLOAD ──────────────────────────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct) {
      alert('Simpan produk terlebih dahulu sebelum upload foto.');
      return;
    }
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadingImage(true);
    try {
      const isPrimaryFirst = images.length === 0; // Set first image as primary if no images yet
      for (let i = 0; i < files.length; i++) {
        await uploadProductImage(editingProduct.id, files[i], isPrimaryFirst && i === 0);
      }
      await loadImages(editingProduct.id);
    } catch (err) {
      console.error('Gagal upload foto:', err);
      alert('Gagal upload foto. Pastikan bucket "product-images" di Supabase sudah dibuat dan RLS diizinkan.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSetPrimary = async (imgId: string) => {
    if (!editingProduct) return;
    // Unset all, then set this one
    await supabase
      .from('product_images')
      .update({ is_primary: false })
      .eq('product_id', editingProduct.id);
    await supabase
      .from('product_images')
      .update({ is_primary: true })
      .eq('id', imgId);
    await loadImages(editingProduct.id);
  };

  const handleDeleteImage = async (imgId: string, imageUrl: string) => {
    if (!confirm('Hapus foto ini?')) return;
    // Extract storage path from URL
    const urlParts = imageUrl.split('/product-images/');
    if (urlParts.length > 1) {
      const storagePath = urlParts[1].split('?')[0];
      await supabase.storage.from('product-images').remove([storagePath]);
    }
    await supabase.from('product_images').delete().eq('id', imgId);
    await loadImages(editingProduct!.id);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#1E1A17]" style={{ fontFamily: '"Poppins", sans-serif' }}>Products</h2>
        <button onClick={openAddForm} className="flex items-center gap-2 bg-[#4A7C3A] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#3d6b2f] transition-colors">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F9F6F1]">
            <tr>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Product</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Category</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Status</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} className="py-6 text-center text-sm text-[#8B6F4E]">Memuat...</td></tr>
            )}
            {!loading && products.length === 0 && (
              <tr><td colSpan={4} className="py-6 text-center text-sm text-[#8B6F4E]">Belum ada produk. Klik "Add Product" untuk mulai.</td></tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-b border-gray-50">
                <td className="py-3 px-5 text-sm font-medium text-[#1E1A17]">{p.name}</td>
                <td className="py-3 px-5 text-sm text-[#8B6F4E]">{p.categories?.name ?? '-'}</td>
                <td className="py-3 px-5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-5 flex gap-2">
                  <button onClick={() => openEditForm(p)} className="text-[#4A7C3A] hover:bg-[#D4E8CC] p-1.5 rounded"><Pencil size={16} /></button>
                  <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#1E1A17]">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>

            <div className="space-y-3">
              <input placeholder="Nama produk" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Slug (untuk URL, contoh: kledung-arabica)" value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <select value={form.categoryId} onChange={(e) => setForm(f => ({ ...f, categoryId: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="">Pilih kategori</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <textarea placeholder="Deskripsi" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Origin (contoh: Kledung, Temanggung)" value={form.origin} onChange={(e) => setForm(f => ({ ...f, origin: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />

              {/* Features */}
              <div>
                <label className="text-sm font-medium text-[#1E1A17] block mb-1">Features (Ciri-ciri produk)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    placeholder="Contoh: High altitude"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && featureInput.trim()) {
                        setForm(f => ({ ...f, features: [...f.features, featureInput.trim()] }));
                        setFeatureInput('');
                      }
                    }}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (featureInput.trim()) {
                        setForm(f => ({ ...f, features: [...f.features, featureInput.trim()] }));
                        setFeatureInput('');
                      }
                    }}
                    className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.features.map((feat, i) => (
                    <span key={i} className="bg-[#D4E8CC] text-[#4A7C3A] px-3 py-1 rounded-full text-xs flex items-center gap-2">
                      {feat}
                      <button type="button" onClick={() => setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }))} className="hover:opacity-70">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium text-[#1E1A17] block mb-1">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    placeholder="Contoh: arabica"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && tagInput.trim()) {
                        setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
                        setTagInput('');
                      }
                    }}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tagInput.trim()) {
                        setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
                        setTagInput('');
                      }
                    }}
                    className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag, i) => (
                    <span key={i} className="bg-[#E8E3D9] text-[#8B6F4E] px-3 py-1 rounded-full text-xs flex items-center gap-2">
                      {tag}
                      <button type="button" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter((_, idx) => idx !== i) }))} className="hover:opacity-70">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                Tampilkan di shop (Active)
              </label>
              <button onClick={handleSaveProduct} className="bg-[#4A7C3A] text-white px-5 py-2.5 rounded-full text-sm font-semibold w-full">
                {editingProduct ? 'Update Produk' : 'Simpan & Lanjut Tambah Foto & Varian'}
              </button>
            </div>

            {/* ── FOTO PRODUK ─────────────────────────────────────── */}
            {editingProduct && (
              <div className="mt-6 border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Image size={16} className="text-[#4A7C3A]" />
                    Foto Produk
                  </h4>
                  <label className={`flex items-center gap-2 cursor-pointer bg-[#4A7C3A] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#3d6b2f] transition ${uploadingImage ? 'opacity-60 cursor-not-allowed' : ''}`}>
                    <Upload size={13} />
                    {uploadingImage ? 'Mengupload...' : 'Upload Foto'}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>

                {images.length === 0 ? (
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center py-10 gap-3 text-[#8B6F4E] cursor-pointer hover:border-[#4A7C3A] transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image size={36} className="opacity-40" />
                    <p className="text-sm">Klik untuk upload foto produk</p>
                    <p className="text-xs opacity-60">Format: JPG, PNG, WEBP — bisa pilih beberapa foto</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {images.map((img) => (
                      <div key={img.id} className="relative group rounded-xl overflow-hidden border-2 border-gray-100">
                        <img
                          src={img.image_url}
                          alt="Product"
                          className="w-full h-28 object-cover"
                        />
                        {/* Primary badge */}
                        {img.is_primary && (
                          <div className="absolute top-1.5 left-1.5 bg-[#4A7C3A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star size={9} fill="white" /> Utama
                          </div>
                        )}
                        {/* Overlay actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {!img.is_primary && (
                            <button
                              onClick={() => handleSetPrimary(img.id)}
                              title="Jadikan foto utama"
                              className="bg-[#4A7C3A] text-white p-1.5 rounded-full hover:bg-[#3d6b2f] transition"
                            >
                              <Star size={13} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteImage(img.id, img.image_url)}
                            title="Hapus foto"
                            className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {/* Add more button */}
                    <div
                      className="border-2 border-dashed border-gray-200 rounded-xl h-28 flex flex-col items-center justify-center gap-1 text-[#8B6F4E] cursor-pointer hover:border-[#4A7C3A] transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Plus size={20} className="opacity-50" />
                      <span className="text-xs opacity-60">Tambah foto</span>
                    </div>
                  </div>
                )}
                <p className="text-xs text-[#8B6F4E] mt-2">
                  💡 Klik ikon <Star size={10} className="inline" /> pada foto untuk menjadikannya <strong>foto utama</strong> yang tampil di shop.
                </p>
              </div>
            )}

            {/* ── VARIAN PRODUK ────────────────────────────────────── */}
            {editingProduct && (
              <div className="mt-6 border-t border-gray-100 pt-5">
                <h4 className="font-semibold text-sm mb-3">Varian Produk</h4>
                <div className="space-y-2 mb-4">
                  {variants.map(v => (
                    <div key={v.id} className="flex items-center justify-between bg-[#F9F6F1] p-3 rounded-lg text-sm">
                      <div>
                        <p className="font-medium">{v.weight} - {v.grindType.replace('_', ' ')}</p>
                        <p className="text-xs text-[#8B6F4E]">SKU: {v.sku} | Stok: {v.stock}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-[#4A7C3A]">Rp {v.price.toLocaleString('id-ID')}</span>
                        <button onClick={() => handleDeleteVariant(v.id)} className="text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                  {variants.length === 0 && <p className="text-xs text-[#8B6F4E]">Belum ada varian.</p>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select value={variantForm.weight} onChange={(e) => setVariantForm(f => ({ ...f, weight: e.target.value as any }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    <option value="250g">250g</option>
                    <option value="500g">500g</option>
                    <option value="1kg">1kg</option>
                  </select>
                  <select value={variantForm.grindType} onChange={(e) => setVariantForm(f => ({ ...f, grindType: e.target.value as any }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    <option value="whole_bean">Whole Bean</option>
                    <option value="coarse">Coarse</option>
                    <option value="medium">Medium</option>
                    <option value="fine">Fine</option>
                    <option value="espresso">Espresso</option>
                  </select>
                  <input placeholder="SKU" value={variantForm.sku} onChange={(e) => setVariantForm(f => ({ ...f, sku: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <input placeholder="Harga" type="number" value={variantForm.price} onChange={(e) => setVariantForm(f => ({ ...f, price: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <input placeholder="Stok" type="number" value={variantForm.stock} onChange={(e) => setVariantForm(f => ({ ...f, stock: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm col-span-2" />
                </div>
                <button onClick={handleAddVariant} className="mt-2 w-full border border-[#4A7C3A] text-[#4A7C3A] py-2 rounded-full text-sm font-semibold">
                  + Tambah Varian
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
