// File: actions/budget.ts
"use server";

// INI BARIS YANG LU LEWATKAN (Jembatan ke utilitas Supabase SSR lu)
import { createClient } from "../utils/supabase"; 

// Kontrak Tipe Data
export interface CashflowStatus {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export async function fetchMonthlyCashflow(month: string): Promise<CashflowStatus> {
  // Sekarang compiler tau createClient berasal dari utilitas lokal lu
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .rpc("get_monthly_cashflow", { p_month: month });

  if (error) {
    console.error("Database Error:", error.message);
    throw new Error("Gagal mengambil data arus kas.");
  }

  // Jika belum ada data sama sekali, return 0 untuk mencegah UI blank
  if (!data || data.length === 0) {
    return { totalIncome: 0, totalExpense: 0, netBalance: 0 };
  }

  return {
    totalIncome: Number(data[0].total_income),
    totalExpense: Number(data[0].total_expense),
    netBalance: Number(data[0].net_balance),
  };
}