"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../utils/supabase";

export async function addTransaction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) throw new Error("Sesi tidak valid.");

  const type = formData.get("type"); // Ambil dari input radio/select
  const amount = formData.get("amount");
  const category = formData.get("category");
  const description = formData.get("description") || "";
  
  if (!amount || !category || !type) throw new Error("Data tidak lengkap!");

  const { error } = await supabase.from("transactions").insert([{
    user_id: user.id,
    type: type.toString(), // 'income' atau 'expense'
    amount: Number(amount),
    category: category.toString(),
    description: description.toString(),
    date: new Date().toISOString(),
  }]);

  if (error) {
    console.error("Insert Error:", error.message); 
    throw new Error("Gagal mencatat transaksi.");
  }

  revalidatePath("/budget");
}

// Tambahkan di bagian bawah file actions/transactions.ts

export interface TransactionHistory {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

export async function fetchRecentTransactions(): Promise<TransactionHistory[]> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // Jika tidak ada user, kembalikan array kosong agar UI tidak meledak
  if (authError || !user) return [];

  const { data, error } = await supabase
    .from("transactions")
    .select("id, type, amount, category, description, date")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false }) // Tie-breaker jika tanggalnya sama
    .limit(10);

  if (error) {
    console.error("Gagal menarik histori:", error.message);
    return [];
  }

  return data as TransactionHistory[];
}