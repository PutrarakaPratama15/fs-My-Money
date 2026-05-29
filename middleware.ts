import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Siapkan kerangka response awal
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 2. Buat client Supabase khusus untuk middleware yang bisa merubah response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Update request cookie agar client Supabase bisa baca session terbaru
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // Update response awal kita dengan cookie baru
          supabaseResponse = NextResponse.next({
            request,
          })
          
          // Tanamkan cookie tersebut ke browser user
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Ambil data user (ini akan memicu refresh token secara otomatis jika dibutuhkan)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const currentPath = request.nextUrl.pathname

  // 4. LOGIKA PEMBLOKIRAN PENYUSUP
  // Jika user belum login dan mencoba masuk ke halaman /budget
  if (!user && currentPath.startsWith('/budget')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login' // Lempar ke halaman login
    return NextResponse.redirect(url)
  }

  // 5. LOGIKA KENYAMANAN UX
  // Jika user SUDAH login tapi mencoba buka halaman /login atau /register
  if (user && (currentPath === '/login' || currentPath === '/register')) {
    const url = request.nextUrl.clone()
    url.pathname = '/budget' // Lempar balik ke dashboard
    return NextResponse.redirect(url)
  }

  // Loloskan request jika semua aman
  return supabaseResponse
}

// 6. KONFIGURASI MATCHER (WAJIB ADA)
// Mengatur agar middleware TIDAK jalan saat load CSS, gambar, atau favicon
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}