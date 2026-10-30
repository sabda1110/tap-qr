# SEO TapQR

Domain utama SEO adalah **https://www.tapqr.id**. URL kartu yang sudah dicetak
tetap mengikuti `VITE_APP_URL`; konfigurasi SEO sengaja tidak mengganti URL QR.

## Konfigurasi deployment

- `VITE_SITE_URL=https://www.tapqr.id` menjadi origin canonical, Open Graph,
  sitemap, dan JSON-LD. Default sudah memakai domain ini jika variabel kosong.
  Perubahan variabel `VITE_` memerlukan build/deploy ulang.
- `VITE_SEO_NOINDEX=false` untuk produksi. Gunakan `true` pada build staging:
  HTML publik menjadi noindex dan robots menolak crawling.
- Hubungkan domain `www.tapqr.id` ke deployment yang benar dengan HTTPS aktif.
  Atur redirect permanen untuk domain alternatif bila masih menyajikan konten
  yang sama. Pertahankan path/query tautan lama; jangan menghapus domain QR lama.

## Halaman yang dapat diindeks

Registry `src/lib/seo/pages.ts` menjadi sumber daftar sitemap: beranda,
konsultasi, panduan aktivasi, dan panduan Google Place ID, masing-masing `/id`
dan `/en`. Tiap halaman memiliki title/deskripsi lokal, canonical ke dirinya,
alternate ID/EN dan x-default Indonesia, Open Graph, serta Twitter card.

`/sitemap.xml` memuat delapan URL dengan anotasi bahasa. Tidak ada tanggal
lastmod buatan pada setiap request. Jika kelak menambahkan lastmod, gunakan
waktu perubahan konten aktual, bukan waktu crawler mengakses endpoint.

Default root adalah noindex; hanya halaman publik yang sengaja mengaktifkan
index. Checkout, auth, dashboard, pencarian pesanan, token booking/pesanan, serta
entry kartu tidak masuk sitemap. Robots mengizinkan crawler membaca noindex
HTML; robots.txt bukan pengganti autentikasi. API/server function diblokir.

Profil bisnis publik yang valid mempertahankan indeksnya, dengan metadata
nama/deskripsi publik serta canonical berdasarkan slug. Profil dinamis tidak
dienumerasi dalam sitemap: endpoint SEO tidak membaca database pelanggan atau
mempublikasikan inventaris/kontak/token. Profil hilang tidak dapat diindeks.

## Data terstruktur dan preview

Homepage menyertakan Organization, WebSite, WebPage, dan OfferCatalog dari
harga/deskripsi produk yang benar-benar tampil. Panduan/konsultasi memakai
WebPage dan BreadcrumbList. Tidak ada rating, review, stok, atau tanggal
pembaruan yang dibuat-buat. JSON-LD di-escape sebelum dimasukkan ke HTML.

`public/tapqr-social.webp` menyalin ilustrasi hero yang sudah ada untuk preview
tautan, 1536 × 1024. URL gambar absolut dan alt tersedia di dua bahasa. Font
tetap memakai paket lokal yang sudah ada; stylesheet Google Fonts ganda dihapus.
Devtools hanya tampil dalam mode pengembangan, dan zoom mobile tetap diizinkan.

## Verifikasi

1. Jalankan `npx tsc --noEmit`, `npm run test:core`, dan `npm run build`.
2. Jalankan `node scripts/check-seo-build.mjs`. Script memeriksa HTTP handler
   hasil build langsung di proses Node: sitemap, robots, HTML ID/EN, JSON-LD,
   canonical, hreflang, dan noindex login. Tidak membuka browser, TCP port,
   mengirim notifikasi, atau membuat data Firebase.
3. Setelah deploy, cek `/robots.txt`, `/sitemap.xml`, dan sumber HTML `/id`,
   `/en`, serta panduan. Pastikan origin semuanya `https://www.tapqr.id`.
4. Verifikasi properti domain `tapqr.id` di Google Search Console memakai DNS
   milik pemilik domain. Kirim `https://www.tapqr.id/sitemap.xml`, lalu periksa
   URL penting dengan URL Inspection. Jangan menambahkan token verifikasi palsu.
5. Uji JSON-LD melalui Rich Results Test/Schema Markup Validator dan cek preview
   tautan. Tampilan hasil Google dan rich result tetap ditentukan mesin pencari.

Menambahkan metadata dan sitemap membantu penemuan serta interpretasi halaman;
tidak menjamin peringkat tertentu. Pantau Search Console untuk indeks,
impresi/klik, canonical pilihan Google, dan error crawling setelah deploy.

## Rujukan resmi

- [Sitemap Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Versi bahasa/hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Robots meta/noindex](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
