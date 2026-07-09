import { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { fetchExpenses, createExpense, deleteExpense, fetchTotalIncome, fetchTotalExpenses } from '@/lib/settings';
import type { Expense } from '@/types';

export default function AdminCashflow() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: 'Bahan Baku', description: '', amount: '', date: new Date().toISOString().slice(0, 10) });

  const loadData = async () => {
    const [exp, income, exp2] = await Promise.all([fetchExpenses(), fetchTotalIncome(), fetchTotalExpenses()]);
    setExpenses(exp);
    setTotalIncome(income);
    setTotalExpenses(exp2);
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async () => {
    if (!form.description || !form.amount) return;
    try {
      await createExpense({ category: form.category, description: form.description, amount: Number(form.amount), date: form.date });
      setForm({ category: 'Bahan Baku', description: '', amount: '', date: new Date().toISOString().slice(0, 10) });
      setShowForm(false);
      await loadData();
    } catch (err) {
      console.error('Gagal tambah pengeluaran:', err);
      alert('Gagal menyimpan pengeluaran.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pengeluaran ini?')) return;
    await deleteExpense(id);
    await loadData();
  };

  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#1E1A17]" style={{ fontFamily: '"Poppins", sans-serif' }}>Cashflow</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl shadow-sm p-5 text-center">
          <p className="text-xs text-[#8B6F4E] uppercase tracking-wider">Total Income</p>
          <p className="text-2xl font-bold text-green-600 mt-1">Rp {totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 text-center">
          <p className="text-xs text-[#8B6F4E] uppercase tracking-wider">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600 mt-1">Rp {totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 text-center">
          <p className="text-xs text-[#8B6F4E] uppercase tracking-wider">Net Balance</p>
          <p className="text-2xl font-bold text-[#4A7C3A] mt-1">Rp {netBalance.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1E1A17]">Expenses</h3>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#4A7C3A] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#3d6b2f]">
            <Plus size={16} /> Add Expense
          </button>
        </div>
        <table className="w-full">
          <thead className="bg-[#F9F6F1]">
            <tr>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#8B6F4E] uppercase">Date</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#8B6F4E] uppercase">Category</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#8B6F4E] uppercase">Description</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#8B6F4E] uppercase">Amount</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-[#8B6F4E] uppercase"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-sm text-[#8B6F4E]">Belum ada pengeluaran.</td></tr>}
            {expenses.map((e) => (
              <tr key={e.id} className="border-b border-gray-50">
                <td className="py-3 px-4 text-sm text-[#8B6F4E]">{e.date}</td>
                <td className="py-3 px-4 text-sm text-[#1E1A17]">{e.category}</td>
                <td className="py-3 px-4 text-sm text-[#8B6F4E]">{e.description}</td>
                <td className="py-3 px-4 text-sm font-medium text-red-600">Rp {e.amount.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <button onClick={() => handleDelete(e.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#1E1A17]">Add Expense</h3>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option>Bahan Baku</option>
                <option>Operasional</option>
                <option>Marketing</option>
                <option>Lainnya</option>
              </select>
              <input placeholder="Deskripsi" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Jumlah (Rp)" type="number" value={form.amount} onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <input type="date" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <button onClick={handleAdd} className="bg-[#4A7C3A] text-white px-5 py-2.5 rounded-full text-sm font-semibold w-full">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
