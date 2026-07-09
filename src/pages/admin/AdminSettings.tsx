import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Upload } from 'lucide-react';
import {
  fetchBankAccounts, createBankAccount, updateBankAccount, deleteBankAccount,
  fetchActiveQris, uploadQris,
} from '@/lib/settings';
import type { BankAccount } from '@/types';

export default function AdminSettings() {
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [qrisUrl, setQrisUrl] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ bankName: '', accountNumber: '', accountHolder: '' });
  const [qrisUploading, setQrisUploading] = useState(false);

  const loadData = async () => {
    const [b, q] = await Promise.all([fetchBankAccounts(), fetchActiveQris()]);
    setBanks(b);
    setQrisUrl(q?.imageUrl ?? null);
  };

  useEffect(() => { loadData(); }, []);

  const handleAddBank = async () => {
    if (!form.bankName || !form.accountNumber || !form.accountHolder) return;
    await createBankAccount({ bankName: form.bankName, accountNumber: form.accountNumber, accountHolder: form.accountHolder, isActive: true });
    setForm({ bankName: '', accountNumber: '', accountHolder: '' });
    setShowForm(false);
    await loadData();
  };

  const toggleActive = async (bank: BankAccount) => {
    await updateBankAccount(bank.id, { isActive: !bank.isActive });
    await loadData();
  };

  const handleDeleteBank = async (id: string) => {
    if (!confirm('Hapus rekening ini?')) return;
    await deleteBankAccount(id);
    await loadData();
  };

  const handleQrisUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrisUploading(true);
    try {
      const url = await uploadQris(file);
      setQrisUrl(url);
    } catch (err) {
      console.error('Gagal upload QRIS:', err);
      alert('Gagal upload QRIS.');
    } finally {
      setQrisUploading(false);
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-[#1E1A17]" style={{ fontFamily: '"Poppins", sans-serif' }}>Settings</h2>

      {/* QRIS */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-[#1E1A17] mb-4">QRIS</h3>
        {qrisUrl && <img src={qrisUrl} alt="QRIS aktif" className="w-40 h-40 border border-gray-100 rounded-lg mb-3" />}
        {!qrisUrl && <p className="text-sm text-[#8B6F4E] mb-3">Belum ada QRIS diunggah.</p>}
        <label className="inline-flex items-center gap-2 bg-[#4A7C3A] text-white px-4 py-2 rounded-full text-sm font-semibold cursor-pointer hover:bg-[#3d6b2f]">
          <Upload size={16} /> {qrisUploading ? 'Mengunggah...' : 'Upload QRIS Baru'}
          <input type="file" accept="image/*" className="hidden" onChange={handleQrisUpload} disabled={qrisUploading} />
        </label>
      </div>

      {/* Bank Accounts */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1E1A17]">Rekening Bank</h3>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#4A7C3A] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#3d6b2f]">
            <Plus size={16} /> Add Bank Account
          </button>
        </div>
        <div className="space-y-2">
          {banks.length === 0 && <p className="text-sm text-[#8B6F4E]">Belum ada rekening.</p>}
          {banks.map((b) => (
            <div key={b.id} className="flex items-center justify-between bg-[#F9F6F1] p-3 rounded-lg text-sm">
              <div>
                <p className="font-medium">{b.bankName} - {b.accountNumber}</p>
                <p className="text-xs text-[#8B6F4E]">a.n. {b.accountHolder}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => toggleActive(b)} className={`text-xs font-medium px-2.5 py-1 rounded-full ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {b.isActive ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => handleDeleteBank(b.id)} className="text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#1E1A17]">Add Bank Account</h3>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Nama Bank (contoh: BCA)" value={form.bankName} onChange={(e) => setForm(f => ({ ...f, bankName: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Nomor Rekening" value={form.accountNumber} onChange={(e) => setForm(f => ({ ...f, accountNumber: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Nama Pemilik Rekening" value={form.accountHolder} onChange={(e) => setForm(f => ({ ...f, accountHolder: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <button onClick={handleAddBank} className="bg-[#4A7C3A] text-white px-5 py-2.5 rounded-full text-sm font-semibold w-full">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
