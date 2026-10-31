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
konsultasi, panduan aktivasi, panduan Google Place ID, dan panduan Google Review, masing-masing `/id`
dan `/en`. Tiap halaman memiliki title/deskripsi lokal, canonical ke dirinya,
alternate ID/EN dan x-default Indonesia, Open Graph, serta Twitter card.

`/sitemap.xml` memuat sepuluh URL dalam XML standar tanpa elemen XHTML agar
browser dapat menampilkan pohon XML. Anotasi bahasa tetap tersedia di `<head>`
setiap halaman; Google menerima metode HTML tanpa duplikasi di sitemap. Tidak ada tanggal
lastmod buatan pada setiap request. Jika kelak menambahkan lastmod, gunakan
waktu perubahan konten aktual, bukan waktu crawler mengakses endpoint.

Default root adalah noindex; hanya halaman publik yang sengaja mengaktifkan
index. Checkout, auth, dashboard, pencarian pesanan, token booking/pesanan, serta
entry kartu tidak masuk sitemap. Robots mengizinkan crawler membaca noindex
HTML; robots.txt bukan pengganti autentikasi. API/server function diblokir.

Profil bisnis publik yang valid mempertahankan indeksnya, dengan metadata
nama/tagline, deskripsi dan alamat publik serta canonical berdasarkan slug.
Logo HTTPS outlet dipakai untuk Open Graph/Twitter tanpa menebak ukuran atau
format gambar. Jika logo tidak valid, gunakan gambar TapQR. Schema LocalBusiness
memakai alamat publik apa adanya; tanpa alamat gunakan Organization. Jam buka,
rating, nomor telepon, kategori usaha, dan lokasi koordinat tidak ditebak.
Metadata hanya mengambil field yang sudah tampil di profil; data akun pemilik,
pesanan, kredensial WiFi, dan token tidak disertakan. Profil tidak tersedia
memakai noindex tanpa canonical ke beranda. Profil dinamis tidak
dienumerasi dalam sitemap: endpoint SEO tidak membaca database pelanggan atau
mempublikasikan inventaris/kontak/token. Profil hilang tidak dapat diindeks.

## Data terstruktur dan preview

Homepage menyertakan Organization, WebSite, WebPage, dan OfferCatalog dari
harga/deskripsi produk yang benar-benar tampil. Panduan/konsultasi memakai
WebPage dan BreadcrumbList. Tidak ada rating, review, stok, atau tanggal
pembaruan yang dibuat-buat. JSON-LD di-escape sebelum dimasukkan ke HTML.
Referensi Organization, WebSite, dan breadcrumb didefinisikan dalam graph setiap
halaman. Paket Bisnis memakai Service karena menggabungkan produk dan setup.
Root `/` memakai redirect permanen 308 ke `/id`. Panduan Google Review memakai
SSR, heading terstruktur, daftar isi, sumber Google, serta tautan dari footer
dan panduan Place ID. Tidak ada halaman kota duplikat atau janji ranking.

`public/tapqr-social.webp` menyalin ilustrasi hero yang sudah ada untuk preview
tautan, 1536 × 1024. URL gambar absolut dan alt tersedia di dua bahasa. Font
tetap memakai paket lokal yang sudah ada; stylesheet Google Fonts ganda dihapus.
Devtools hanya tampil dalam mode pengembangan, dan zoom mobile tetap diizinkan.

Favicon pencarian memakai logo PNG 192 × 192 pada URL stabil `/icon-192.png`,
selain SVG dan ikon browser kecil. Logo organisasi memakai ImageObject PNG
512 × 512; nama WebSite adalah TapQR dengan alternatif Tap QR dan tapqr.id.
Gambar Open Graph landing tetap memakai ilustrasi hero, bukan favicon.
Setelah deploy, minta crawling ulang beranda lewat URL Inspection Search Console.
Google memilih waktu pemrosesan dan tampilan favicon; perubahan tidak instan.

## Fokus pencarian landing page

Judul dan section produk menargetkan papan Google Review serta kartu NFC.
Deskripsi dan FAQ membahas kebutuhan UMKM Pekanbaru, Kerinci, dan Duri,
cara pesan, perbedaan NFC/QR, serta pilihan papan NFC sesuai anggaran. Istilah
"murah" dijelaskan dengan harga nyata Rp69.000/unit (belum ongkir), tanpa klaim
termurah. Jika harga akrilik berubah, perbarui pricing, metadata ID/EN, dan FAQ
harga dalam perubahan yang sama. Tidak ada meta keywords atau halaman kota
duplikat. Pantau kueri, impresi, klik, dan CTR di Search Console setelah deploy;
keyword yang ditargetkan bukan klaim volume pencarian atau jaminan posisi.

## Penemuan melalui pencarian AI (GEO)

GEO bertujuan membantu mesin pencarian AI memahami dan merujuk informasi
TapQR secara akurat. Landing page menyediakan jawaban langsung tentang papan
Google Review, kriteria memilih produk, bahan, harga, dan proses pemesanan dalam
bahasa Indonesia dan Inggris. Kriteria "terbaik" dijelaskan berdasarkan kebutuhan
usaha; bukan klaim bahwa TapQR mengalahkan semua produk lain.

FAQ dirender sebagai teks HTML melalui SSR, termasuk isi accordion yang belum
dibuka. Pemeriksaan hasil build memastikan jawaban tersedia tanpa JavaScript.
Organization dan penawaran produk memakai fakta yang sama dengan konten terlihat.
Robots produksi mengizinkan crawling halaman publik lewat `User-agent: *`;
periksa juga pengaturan CDN/firewall setelah deploy jika crawler ditolak.

Google AI Overviews dan AI Mode tidak memerlukan file AI atau schema khusus.
Halaman perlu terindeks dan memenuhi syarat untuk menampilkan cuplikan. Tidak ada
jaminan suatu pertanyaan akan menampilkan TapQR, meskipun seluruh syarat terpenuhi.

Langkah pengembangan konten berikutnya: dokumentasikan studi kasus pelanggan
nyata dengan izin, foto produk aktual, serta hasil terukur dengan periode dan
metode pengukuran yang jelas. Jangan menyamakan klik tombol ulasan dengan ulasan
yang berhasil dikirim. Hindari rating, testimoni, penghargaan, atau perbandingan
kompetitor yang tidak dapat dibuktikan.

Pantau Search Console untuk kueri produk dan wilayah. Trafik dari fitur AI Google
tergabung dalam laporan Web, sehingga kenaikan impresi bukan bukti khusus hasil
GEO. Jika analitik rujukan tersedia, ukur kunjungan dan konversi dari layanan AI;
data referrer bisa tidak lengkap. Catat tanggal, pertanyaan, dan sumber kutipan
saat mengevaluasi jawaban AI secara manual; satu jawaban bukan ukuran ranking.

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

- [Google AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [TanStack Start GEO](https://tanstack.com/start/latest/docs/framework/react/guide/geo)
- [Sitemap Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Versi bahasa/hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Robots meta/noindex](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)
