// File: app/login/page.tsx
import { login, signup } from "../../actions/auth";

// Kita tangkap pesan error atau sukses dari URL parameter
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;
  const message = params.message;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Masuk ke Sistem Budget
        </h1>

        {/* Area Notifikasi Error / Sukses */}
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 rounded bg-green-100 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* Form menembak langsung ke fungsi server action 'login' */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="email@contoh.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col gap-2 pt-4">
            {/* Tombol Login menggunakan action login */}
            <button
              formAction={login}
              className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 font-semibold"
            >
              Login
            </button>
            
            {/* Tombol Register menggunakan action signup */}
            <button
              formAction={signup}
              className="w-full rounded border border-blue-600 bg-white py-2 text-blue-600 hover:bg-blue-50 font-semibold"
            >
              Daftar Akun Baru
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}