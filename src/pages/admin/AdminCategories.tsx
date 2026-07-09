import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { createCategory, updateCategory, deleteCategory } from '@/lib/products';

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  is_active: boolean;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    iconUrl: '',
    isActive: true,
  });

  const loadData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (!error) {
      setCategories(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddForm = () => {
    setEditingCategory(null);
    setForm({ name: '', slug: '', description: '', iconUrl: '', isActive: true });
    setShowForm(true);
  };

  const openEditForm = (cat: CategoryRow) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      iconUrl: cat.icon_url || '',
      isActive: cat.is_active,
    });
    setShowForm(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm({
      ...form,
      name,
      slug: generateSlug(name),
    });
  };

  const handleSaveCategory = async () => {
    if (!form.name || !form.slug) {
      alert('Nama dan slug kategori harus diisi');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: form.name,
          slug: form.slug,
          description: form.description,
          iconUrl: form.iconUrl,
          isActive: form.isActive,
        });
      } else {
        await createCategory({
          name: form.name,
          slug: form.slug,
          description: form.description,
          iconUrl: form.iconUrl,
          isActive: form.isActive,
        });
      }
      await loadData();
      setShowForm(false);
    } catch (err: any) {
      console.error('Gagal simpan kategori:', err);
      alert(`Gagal menyimpan kategori: ${err.message}`);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Hapus kategori ini? Produk dengan kategori ini akan kehilangan kategorinya.')) return;
    try {
      await deleteCategory(id);
      await loadData();
    } catch (err: any) {
      console.error('Gagal hapus kategori:', err);
      alert(`Gagal menghapus kategori: ${err.message}`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#1E1A17]" style={{ fontFamily: '"Playfair Display", serif' }}>Categories</h2>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-[#4A7C3A] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#3d6b2f] transition-colors"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F9F6F1]">
            <tr>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Name</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Slug</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Description</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Status</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-[#8B6F4E] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-sm text-[#8B6F4E]">Memuat...</td>
              </tr>
            )}
            {!loading && categories.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-sm text-[#8B6F4E]">Belum ada kategori.</td>
              </tr>
            )}
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t border-[#E8E3D9] hover:bg-[#F9F6F1]">
                <td className="py-3 px-5 text-sm font-medium text-[#1E1A17]">{cat.name}</td>
                <td className="py-3 px-5 text-sm text-[#8B6F4E]">{cat.slug}</td>
                <td className="py-3 px-5 text-sm text-[#8B6F4E]">{cat.description || '-'}</td>
                <td className="py-3 px-5 text-sm">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    cat.is_active ? 'bg-[#D4E8CC] text-[#4A7C3A]' : 'bg-[#FFE8E8] text-[#C41E3A]'
                  }`}>
                    {cat.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-5">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditForm(cat)}
                      className="text-[#4A7C3A] hover:text-[#3d6b2f] transition-colors p-1"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-red-600 hover:text-red-700 transition-colors p-1"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#E8E3D9] flex items-center justify-between p-5">
              <h3 className="font-semibold text-[#1E1A17]">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-[#8B6F4E] hover:text-[#1E1A17]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#1E1A17] mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Arabica Green"
                  className="w-full px-3 py-2 border border-[#E8E3D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C3A]"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-[#1E1A17] mb-1">Slug *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. arabica-green"
                  className="w-full px-3 py-2 border border-[#E8E3D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C3A]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#1E1A17] mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Category description"
                  rows={3}
                  className="w-full px-3 py-2 border border-[#E8E3D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C3A]"
                />
              </div>

              {/* Icon URL */}
              <div>
                <label className="block text-sm font-medium text-[#1E1A17] mb-1">Icon URL</label>
                <input
                  type="text"
                  value={form.iconUrl}
                  onChange={(e) => setForm({ ...form, iconUrl: e.target.value })}
                  placeholder="e.g. https://..."
                  className="w-full px-3 py-2 border border-[#E8E3D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A7C3A]"
                />
              </div>

              {/* Active */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 accent-[#4A7C3A]"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-[#1E1A17]">
                  Active
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-[#E8E3D9] text-[#1E1A17] rounded-lg hover:bg-[#F9F6F1] transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="flex-1 px-4 py-2 bg-[#4A7C3A] text-white rounded-lg hover:bg-[#3d6b2f] transition-colors font-medium"
                >
                  Save
                </button>
              </div>

              {editingCategory && (
                <button
                  onClick={() => {
                    handleDeleteCategory(editingCategory.id);
                    setShowForm(false);
                  }}
                  className="w-full px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                >
                  Delete Category
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
