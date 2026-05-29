// File: app/budget/SubmitButton.tsx
"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export default function SubmitButton() {
  // Hook ini akan mendeteksi apakah form induknya sedang memproses Server Action
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 font-medium text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {pending ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Menyimpan...
        </>
      ) : (
        "Simpan Transaksi"
      )}
    </button>
  );
}