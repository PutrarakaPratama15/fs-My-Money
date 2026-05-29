// File: app/budget/page.tsx
import { fetchMonthlyCashflow } from "../../actions/budget";
import { addTransaction, fetchRecentTransactions } from "../../actions/transactions";
import ExportButton from "./ExportButton";
import SubmitButton from "./SubmitButton";
import { TrendingUp, TrendingDown, Wallet, CalendarDays, Receipt } from "lucide-react";

export default async function CashflowDashboard() {
  // 1. Logika Waktu Dinamis (Wajib pake Intl untuk menghindari bug Timezone Vercel/Server)
  const now = new Date();
  
  const currentMonthDisplay = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    month: "long",
    year: "numeric",
  }).format(now); 

  const year = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", year: "numeric" }).format(now);
  const month = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jakarta", month: "2-digit" }).format(now);
  const currentMonthQuery = `${year}-${month}-01`; 
  
  // 2. Tarik Data Paralel
  const [cashflow, recentTransactions] = await Promise.all([
    fetchMonthlyCashflow(currentMonthQuery),
    fetchRecentTransactions()
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Arus Kas</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm font-medium">
              <CalendarDays className="h-4 w-4" /> Periode: {currentMonthDisplay}
            </p>
          </div>
        </header>

        {/* KARTU RANGKUMAN */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pemasukan</p>
                <h3 className="text-2xl font-bold text-gray-900">Rp {cashflow.totalIncome.toLocaleString('id-ID')}</h3>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <TrendingDown className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pengeluaran</p>
                <h3 className="text-2xl font-bold text-gray-900">Rp {cashflow.totalExpense.toLocaleString('id-ID')}</h3>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-lg border border-gray-800 text-white transition-all hover:shadow-xl sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300">Saldo Bersih</p>
                <h3 className={`text-2xl font-bold ${cashflow.netBalance < 0 ? 'text-rose-400' : 'text-white'}`}>
                  Rp {cashflow.netBalance.toLocaleString('id-ID')}
                </h3>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* FORM TRANSAKSI BARU */}
          <section className="lg:col-span-1 rounded-2xl bg-white p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 h-fit">
            <div className="mb-6 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-gray-900">Catat Transaksi</h2>
            </div>

            <form action={addTransaction} className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer">
                  <input type="radio" name="type" value="income" className="peer sr-only" defaultChecked />
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-center transition-all peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700 peer-checked:ring-1 peer-checked:ring-emerald-500 hover:bg-gray-100">
                    <span className="font-semibold text-sm">Pemasukan</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="type" value="expense" className="peer sr-only" />
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-center transition-all peer-checked:border-rose-500 peer-checked:bg-rose-50 peer-checked:text-rose-700 peer-checked:ring-1 peer-checked:ring-rose-500 hover:bg-gray-100">
                    <span className="font-semibold text-sm">Pengeluaran</span>
                  </div>
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nominal (Rp)</label>
                  <input type="number" name="amount" required min="1" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600" placeholder="0" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
                  <input type="text" name="category" required placeholder="Contoh: Gaji, Makan..." className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Keterangan (Opsional)</label>
                  <input type="text" name="description" className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600" placeholder="Detail transaksi..." />
                </div>
              </div>

              <SubmitButton />
            </form>
          </section>

          {/* HISTORI TRANSAKSI */}
          <section className="lg:col-span-2 rounded-2xl bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden h-fit flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-gray-100 gap-4 bg-white">
              <h2 className="text-lg font-bold text-gray-900">Riwayat Terakhir</h2>
              <ExportButton data={recentTransactions} />
            </div>
            
            {recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="rounded-full bg-gray-50 p-4 mb-3">
                  <Receipt className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Belum ada transaksi tercatat.</p>
              </div>
            ) : (
              <>
                {/* Tampilan Mobile */}
                <div className="block md:hidden p-4 space-y-3 bg-gray-50/30">
                  {recentTransactions.map((trx) => {
                    const isIncome = trx.type === 'income';
                    return (
                      <div key={trx.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                        <div className="overflow-hidden mr-3">
                          <p className="font-bold text-gray-900 truncate">{trx.category}</p>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {new Date(trx.date).toLocaleDateString('id-ID')} {trx.description ? `• ${trx.description}` : ''}
                          </p>
                        </div>
                        <div className={`text-sm font-extrabold whitespace-nowrap text-right ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isIncome ? '+' : '-'} Rp {trx.amount.toLocaleString('id-ID')}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tampilan Desktop */}
                <div className="hidden md:block overflow-x-auto w-full">
                  <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
                    <thead className="bg-gray-50/80 text-gray-500 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Tanggal</th>
                        <th className="px-6 py-4 font-semibold">Kategori</th>
                        <th className="px-6 py-4 font-semibold">Keterangan</th>
                        <th className="px-6 py-4 font-semibold text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 bg-white">
                      {recentTransactions.map((trx) => {
                        const isIncome = trx.type === 'income';
                        return (
                          <tr key={trx.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="px-6 py-4 text-gray-500">{new Date(trx.date).toLocaleDateString('id-ID')}</td>
                            <td className="px-6 py-4 font-bold text-gray-900">{trx.category}</td>
                            <td className="px-6 py-4 text-gray-500 truncate max-w-[200px]">{trx.description || '-'}</td>
                            <td className={`px-6 py-4 font-extrabold text-right ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {isIncome ? '+' : '-'} Rp {trx.amount.toLocaleString('id-ID')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        </div>

      </div>
    </div>
  );
}