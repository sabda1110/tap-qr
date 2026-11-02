# Performa TapQR

## Optimasi November 2026

- Katalog terjemahan dimuat lewat dynamic import berdasarkan locale URL. Loader
  locale menyiapkan modul sebelum navigasi; provider memakai Promise cache dan
  Suspense agar SSR tetap menghasilkan konten ID/EN. Cache ini hanya berisi modul
  statis, tidak menyimpan sesi atau data pengguna. Kegagalan import boleh dicoba
  ulang. Perubahan bahasa tetap mempertahankan path, query, dan hash.
- Katalog harga publik dipisah dari agregat terjemahan lengkap sehingga metadata
  SEO tidak menarik seluruh teks admin dan dua bahasa ke JavaScript awal.
  Untuk menjaga kontrak komponen yang ada, katalog bahasa aktif masih lengkap;
  pemisahan namespace per fitur dapat dievaluasi kemudian.
- Judul, tombol, dan gambar hero langsung terlihat dalam HTML server. Dekorasi
  serta animasi section lain tetap tersedia. Gambar hero tetap eager/high priority.
- Polling konsultasi berhenti ketika tab tersembunyi dan refresh ketika kembali.
  Maintenance fallback yang berbarengan digabung per instance tanpa cache hasil.
  Tenggat, transaksi, notifikasi, serta endpoint cron dipertahankan. Rincian ada
  pada kontrak konsultasi.

## Pengukuran build

Estimasi gzip penutupan dependensi statis landing sebelum perubahan: sekitar
242 KiB. Setelah perubahan, landing bersama katalog ID yang diperlukan sekitar
219 KiB; katalog bahasa lain dimuat hanya ketika diperlukan. Ini estimasi file
JavaScript hasil build, bukan waterfall browser, total transfer halaman, atau
jaminan pengurangan waktu muat. Jalankan ulang pengukuran setelah perubahan kode.

## Pemeriksaan

1. `npx tsc --noEmit` dan `npm run test:core`.
2. `VITE_SEO_NOINDEX=false npm run build` untuk memeriksa build publik.
3. `node scripts/check-seo-build.mjs` memeriksa SSR, hero terlihat, canonical,
   kedua locale, redirect login, serta noindex halaman privat tanpa browser/port.
4. `node scripts/check-performance-build.mjs` memeriksa pemisahan katalog bahasa
   dan melaporkan estimasi JavaScript landing dengan bahasa aktif.
5. Periksa manual perpindahan bahasa pada route ber-query/hash, aktivasi dari
   kartu, login/registrasi, pemesanan, dan halaman konsultasi. Sembunyikan tab
   konsultasi lalu buka kembali; jadwal/status harus diperbarui dan formulir tetap
   mempertahankan isian. Periksa hero pada mobile serta desktop.

Ukur LCP/INP/CLS dan respons server melalui perangkat pengguna atau pengujian
performa terpisah sebelum menetapkan target penghematan durasi. Jangan menghapus
fallback maintenance sebelum scheduler dipastikan aktif. Jangan cache respons
sesi, token, checkout, atau status booking untuk mengejar skor performa.
