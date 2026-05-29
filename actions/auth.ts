// File: actions/auth.ts
"use server";

import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase";

export async function login(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    redirect("/login?error=Email dan Password wajib diisi");
  }

  // Karena di utils kita pakai await cookies(), pemanggilan createClient wajib di-await
  const supabase = await createClient(); 

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Kalau gagal, tendang balik ke login bawa pesan error
    redirect("/login?error=Email atau password salah");
  }

  // Kalau sukses, arahkan ke dashboard budget
  redirect("/budget");
}

// Sekalian kita buat fungsi registernya biar sistem lu komplit
export async function signup(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    redirect("/login?error=Email dan Password wajib diisi");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${error.message}`);
  }

  redirect("/login?message=Cek email kamu untuk konfirmasi pendaftaran");
}

export async function logout() {
  const supabase = await createClient();
  
  // Perintahkan Supabase untuk menghancurkan sesi di database dan menghapus cookies
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Gagal logout:", error.message);
    throw new Error("Gagal melakukan proses logout.");
  }

  // Setelah bersih, tendang user kembali ke halaman login
  redirect("/login");
}