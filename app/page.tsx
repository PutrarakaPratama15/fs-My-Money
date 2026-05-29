// File: app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // Langsung arahkan semua pengunjung dari root (/) ke rute aplikasi utama (/budget)
  redirect("/budget");
}