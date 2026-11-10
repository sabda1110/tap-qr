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
OfferCatalog menyimpan nama, deskripsi, harga IDR, dan URL pada setiap Offer.
Homepage berisi beberapa produk berbeda, sehingga tidak menerbitkan node Product
untuk product snippets. Product bersarang tanpa offers sebelumnya menyebabkan
error Search Console “Either offers, review, or aggregateRating should be specified”.
Jangan menambahkan rating buatan atau mengubah barang fisik menjadi Service untuk
menghindari validasi. Product snippets hanya digunakan pada halaman yang fokus
pada satu produk/variannya dan memiliki data penawaran yang lengkap.
Setelah deploy, uji beranda dengan Rich Results Test, lalu gunakan Validate Fix
pada laporan Product snippets dan minta pengindeksan ulang melalui URL Inspection.
Referensi: https://developers.google.com/search/docs/appearance/structured-data/product-snippet#technical-guidelines

Root `/` memakai redirect permanen 308 ke `/id`. Panduan Google Review memakai
SSR, heading terstruktur, daftar isi, sumber Google, serta tautan dari footer
dan panduan Place ID. Tidak ada halaman kota duplikat atau janji ranking.

`public/tapqr-social.webp` menyalin ilustrasi hero yang sudah ada untuk preview
tautan, 1536 × 1024. URL gambar absolut dan alt tersedia di dua bahasa. Font
tetap memakai paket lokal yang sudah ada; stylesheet Google Fonts ganda dihapus.
Devtools hanya tampil dalam mode pengembangan, dan zoom mobile tetap diizinkan.

Favicon utama memakai satu deklarasi `rel="icon"` PNG 96 × 96 pada URL stabil
`/favicon-96x96.png`. SVG tidak lagi menjadi pilihan favicon pertama; panduan
Google saat ini mencantumkan PNG/ICO dan format raster lain sebagai format
pencarian yang didukung. File SVG dan ikon ukuran lain tetap tersedia sebagai
aset, sementara manifest memakai PNG 192/512 dan apple-touch-icon memakai PNG 180.
Logo organisasi memakai ImageObject PNG 512 × 512; nama WebSite adalah TapQR
dengan alternatif Tap QR dan tapqr.id.
Gambar Open Graph landing tetap memakai ilustrasi hero, bukan favicon.
Setelah deploy, minta crawling ulang beranda lewat URL Inspection Search Console.
Google memilih waktu pemrosesan dan tampilan favicon; perubahan tidak instan.
Pemeriksaan produksi 3 November 2026: apex mengarah ke www, root mengarah ke `/id`,
halaman akhir HTTP 200/index, PNG 96 HTTP 200/image/png (juga dengan user-agent
Googlebot-Image), ukuran dan byte sama dengan aset lokal, serta robots mengizinkan
akses. Ini pemeriksaan akses publik, bukan bukti Google telah mengambil ikon.
Tiga hari tanpa ikon belum membuktikan kegagalan: dokumentasi Google menyebut
beberapa hari hingga beberapa minggu dan tidak menjamin penayangan favicon.
Setelah deploy, inspeksi URL `https://www.tapqr.id/` dan halaman akhirnya `/id`
di Search Console, lalu minta pengindeksan ulang. Jangan mengganti URL ikon
berulang kali atau menambahkan query timestamp untuk memaksa pembaruan.

## Fokus pencarian landing page

Judul dan section produk menargetkan papan Google Review serta kartu NFC.
Deskripsi dan FAQ membahas kebutuhan UMKM Pekanbaru, Kerinci, dan Duri,
cara pesan, perbedaan NFC/QR, serta pilihan papan NFC sesuai anggaran. Istilah
"murah" dijelaskan dengan harga nyata Rp69.000/unit (belum ongkir), tanpa klaim
termurah. Jika harga akrilik berubah, perbarui pricing, metadata ID/EN, dan FAQ
harga dalam perubahan yang sama. Tidak ada meta keywords atau halaman kota
duplikat. Pantau kueri, impresi, klik, dan CTR di Search Console setelah deploy;
keyword yang ditargetkan bukan klaim volume pencarian atau jaminan posisi.

Judul landing secara khusus menargetkan "Papan Google Review Pekanbaru".
Heading produk dan FAQ menjelaskan produk, cara memesan untuk usaha di Pekanbaru,
serta kebutuhan tautan outlet yang benar. Panduan Google Review memuat contoh
alur kafe di Pekanbaru yang diberi label sebagai ilustrasi, bukan studi kasus
pelanggan. Kerinci dan Duri tetap dicakup pada deskripsi/cara pemesanan. Tidak ada
alamat cabang, kantor lokal, hasil pelanggan, atau klaim peringkat yang dibuat-buat.
Setelah deploy, gunakan URL Inspection untuk `/id` dan panduan Google Review,
lalu pantau kueri "google review pekanbaru" dan "papan google review pekanbaru"
di Search Console. Tidak muncul pada satu pencarian bukan bukti keyword hilang.

## Membaca keyword di Search Console

Pemeriksaan publik 5 November 2026: `/id` mengembalikan HTTP 200, title
"Papan Google Review Pekanbaru & Kartu NFC | TapQR", robots index/follow,
dan canonical `https://www.tapqr.id/id`. Keyword sudah tersedia di produksi;
ini bukan bukti posisi atau status pengindeksan di akun Search Console.

Properti URL-prefix `https://www.tapqr.id/id/` hanya mencakup URL dengan awalan
tersebut; beranda canonical `/id` tanpa slash terakhir berada di luar awalan itu.
Gunakan properti Domain `tapqr.id` (verifikasi DNS), atau URL-prefix
`https://www.tapqr.id/` (mencakup kedua bahasa), lalu inspeksi canonical `/id`.
Jangan mengganti canonical atau menambah slash hanya untuk menyesuaikan laporan.

Tabel Queries melaporkan pencarian yang benar-benar menghasilkan tayangan/klik
untuk cakupan properti dan filter laporan, bukan daftar keyword yang ditanam.
Sebagian kueri disembunyikan untuk privasi. "No data" saja belum membuktikan
keyword hilang, halaman tidak terindeks, maupun kesalahan teknis tertentu.
Periksa properti, filter, total impresi, dan hasil URL Inspection terlebih dahulu.

Penguatan konten 5 November menambahkan konteks produk pada paragraf hero,
fitur NFC + QR, kartu PVC, serta jawaban tentang QR code ulasan Google Maps.
Section produk menautkan panduan Google Review dalam locale yang sama. Istilah
utama tetap papan Google Review, kartu NFC Google Review, papan akrilik NFC,
dan QR ulasan Google Maps; wilayah Pekanbaru, Kerinci, dan Duri tetap dijelaskan
sebagai tujuan pemesanan, bukan lokasi cabang yang belum diverifikasi.

Setelah deploy, minta pengindeksan `/id` dan pantau perubahan impresi/klik per
kueri produk di properti yang mencakup seluruh situs. Catat tanggal deploy agar
perbandingan periode jelas. Jangan menganggap penambahan kata menjamin ranking.

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

## Promo tampilan November 2026

Landing page menampilkan PVC Rp70.000 (normal Rp79.000) dan akrilik Rp50.000
(normal Rp69.000) pada 1–30 November 2026 WIB. Harga lama dicoret; periode dan
pengecualian ongkir tampil pada kartu harga ID/EN. Perhitungan periode berada di
`src/lib/order-promotion.ts`; setelah periode berakhir, render berikutnya kembali
ke harga normal. JSON-LD memakai harga tampilan yang sama dengan masa berlaku.
FAQ menyebut harga normal dan mengarahkan pembaca ke promo pada bagian harga.

Ini hanya promo tampilan sesuai keputusan pemilik: tidak ada kuota 10 unit,
reservasi, perubahan transaksi, pencatatan pembayaran, atau perubahan database.
Harga akhir tetap disepakati melalui WhatsApp sebelum pembayaran.

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
- [Favicon Google](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [Sitemap Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Versi bahasa/hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Robots meta/noindex](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization)

- [Cakupan properti Search Console](https://support.google.com/webmasters/answer/34592)
- [Laporan Performance](https://support.google.com/webmasters/answer/7576553)
- [Meta tags yang didukung Google](https://developers.google.com/search/docs/crawling-indexing/special-tags)

## Fokus bahasa Indonesia dan status canonical (10 November 2026)

Indonesia tetap bahasa default (`/` → `/id`), termasuk `x-default`. Versi `/en`
tetap dapat diindeks dan memiliki canonical ke dirinya; jangan mengarahkan
canonical Inggris ke Indonesia karena kontennya memang diterjemahkan.
Judul utama Indonesia menggunakan “Ulasan Google”, dengan istilah produk
“Papan Google Review” tetap tersedia secara alami dalam deskripsi produk.
Query Search Console adalah kata yang dipakai pencari saat situs tampil;
query berbahasa Inggris bukan daftar keyword yang kita pasang dalam metadata.
Bahasa query tidak dapat dipaksa dengan mengulang keyword atau meta keywords.

Audit produksi menemukan `https://tapqr.id/id` masih merespons 200 dengan
canonical `https://www.tapqr.id/id`. URL apex ini dapat wajar dilaporkan sebagai
“Alternate page with proper canonical tag”. Root apex mengalihkan ke `/id`,
sehingga “Page with redirect” juga wajar untuk URL tersebut.
`vercel.json` kini menyatukan host apex ke `www` dengan redirect permanen 308:
root langsung ke `https://www.tapqr.id/id`, path lain dipertahankan. Query
string diteruskan oleh Vercel, termasuk parameter aktivasi kartu dan kampanye.
Aturan hanya mencocokkan host `tapqr.id`, bukan `www`, localhost, atau preview.

Sesudah deploy, periksa pengalihan root, `/id`, `/en`, URL kartu lama, serta
query seperti `?cardId=...` dan `?utm_source=tiktok`. Ini aturan CDN Vercel;
build lokal tidak menjalankan kondisi host tersebut. Pada URL Inspection,
periksa `https://www.tapqr.id/id`: status 200, boleh diindeks, canonical pilihan
pengguna dan Google mengarah ke URL itu. Kirim sitemap domain `www` dan minta
pengindeksan URL utama, bukan URL yang sengaja mengalihkan. Status URL alias
boleh tetap tercatat sebagai redirect/alternate setelah Google merayapi ulang.
