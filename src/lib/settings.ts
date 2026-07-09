import { supabase } from './supabase';
import type { Expense, BankAccount } from '@/types';

// ============================================
// EXPENSES (CASHFLOW)
// ============================================
export async function fetchExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase.from('expenses').select('*').order('date', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((e: any) => ({
    id: e.id,
    category: e.category,
    description: e.description,
    amount: Number(e.amount),
    date: e.date,
  }));
}

export async function createExpense(input: Omit<Expense, 'id'>) {
  const { error } = await supabase.from('expenses').insert({
    category: input.category,
    description: input.description,
    amount: input.amount,
    date: input.date,
  });
  if (error) throw error;
}

export async function deleteExpense(id: string) {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) throw error;
}

/** Total pemasukan dari order dengan status paid/shipped/completed */
export async function fetchTotalIncome(): Promise<number> {
  const { data, error } = await supabase
    .from('orders')
    .select('total')
    .in('status', ['paid', 'shipped', 'completed']);
  if (error) throw error;
  return (data ?? []).reduce((sum: number, o: any) => sum + Number(o.total), 0);
}

export async function fetchTotalExpenses(): Promise<number> {
  const { data, error } = await supabase.from('expenses').select('amount');
  if (error) throw error;
  return (data ?? []).reduce((sum: number, e: any) => sum + Number(e.amount), 0);
}

// ============================================
// SETTINGS: BANK ACCOUNTS
// ============================================
export async function fetchBankAccounts(): Promise<BankAccount[]> {
  const { data, error } = await supabase.from('bank_accounts').select('*').order('bank_name');
  if (error) throw error;
  return (data ?? []).map((b: any) => ({
    id: b.id,
    bankName: b.bank_name,
    accountNumber: b.account_number,
    accountHolder: b.account_holder,
    isActive: b.is_active,
  }));
}

export async function createBankAccount(input: Omit<BankAccount, 'id'>) {
  const { error } = await supabase.from('bank_accounts').insert({
    bank_name: input.bankName,
    account_number: input.accountNumber,
    account_holder: input.accountHolder,
    is_active: input.isActive,
  });
  if (error) throw error;
}

export async function updateBankAccount(id: string, input: Partial<Omit<BankAccount, 'id'>>) {
  const { error } = await supabase
    .from('bank_accounts')
    .update({
      ...(input.bankName && { bank_name: input.bankName }),
      ...(input.accountNumber && { account_number: input.accountNumber }),
      ...(input.accountHolder && { account_holder: input.accountHolder }),
      ...(input.isActive !== undefined && { is_active: input.isActive }),
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteBankAccount(id: string) {
  const { error } = await supabase.from('bank_accounts').delete().eq('id', id);
  if (error) throw error;
}

// ============================================
// SETTINGS: QRIS
// ============================================
export async function fetchActiveQris(): Promise<{ id: string; imageUrl: string } | null> {
  const { data, error } = await supabase
    .from('qris_settings')
    .select('*')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? { id: data.id, imageUrl: data.image_url } : null;
}

export async function uploadQris(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `qris-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from('qris').upload(path, file);
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage.from('qris').getPublicUrl(path);

  // Nonaktifkan QRIS lama, tambah yang baru sebagai aktif
  await supabase.from('qris_settings').update({ is_active: false }).eq('is_active', true);
  const { error: insertError } = await supabase.from('qris_settings').insert({
    image_url: publicUrlData.publicUrl,
    is_active: true,
  });
  if (insertError) throw insertError;

  return publicUrlData.publicUrl;
}
