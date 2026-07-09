import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  createProduct, updateProduct, deleteProduct,
  createVariant, deleteVariant,
  fetchVariantsByProductId,
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

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const [form, setForm] = useState({
    name: '', slug: '', categoryId: '', description: '', origin: '', isActive: true,
  });
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

  const openAddForm = () => {
    setEditingProduct(null);
    setForm({ name: '', slug: '', categoryId: categories[0]?.id ?? '', description: '', origin: '', isActive: true });
    setVariants([]);
    setShowForm(true);
  };

  const openEditForm = async (p: ProductRow) => {
    setEditingProduct(p);
    setForm({ name: p.name, slug: p.slug, categoryId: p.category_id ?? '', description: '', origin: '', isActive: p.is_active });
    setShowForm(true);
    const v = await fetchVariantsByProductId(p.id);
    setVariants(v);
  };

  const handleSaveProduct = async () => {
    if (!form.name || !form.slug) return;
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          name: form.name, slug: form.slug, categoryId: form.categoryId,
          description: form.description, origin: form.origin, isActive: form.isActive,
          features: [], tags: [],
        });
      } else {
        const created = await createProduct({
          name: form.name, slug: form.slug, categoryId: form.categoryId,
          description: form.description, origin: form.origin, isActive: form.isActive,
          features: [], tags: [],
        });
        setEditingProduct({ id: created.id, name: form.name, slug: form.slug, category_id: form.categoryId, categories: null, is_active: form.isActive });
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

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#1E1A17]" style={{ fontFamily: '"Playfair Display", serif' }}>Products</h2>
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
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                Tampilkan di shop (Active)
              </label>
              <button onClick={handleSaveProduct} className="bg-[#4A7C3A] text-white px-5 py-2.5 rounded-full text-sm font-semibold w-full">
                {editingProduct ? 'Update Produk' : 'Simpan & Lanjut Tambah Varian'}
              </button>
            </div>

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
                        <span className="font-semibold text-[#4A7C3A]">Rp {v.price.toLocaleString()}</span>
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
