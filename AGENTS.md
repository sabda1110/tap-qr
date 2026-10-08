# tap-qr — Agent System Prompt & Playbook

Dokumen ini adalah pedoman utama untuk AI assistant atau development agent yang
bekerja di repository `tap-qr`.

## Konteks repository saat ini

- Nama proyek: `tap-qr`.
- Aplikasi yang sedang dibangun: marketing/company site TapQR.
- Stack: TanStack Start, React 19, TypeScript, Tailwind CSS, dan shadcn/ui.
- Routing memakai TanStack Router dengan locale pada URL: `/id` dan `/en`.
- UI mengikuti atomic design: `elements` → `molecules` → `organisms` →
  `layouts` → `page` → `routes`.
- Global client state memakai Zustand ketika dibutuhkan lintas fitur atau route.
  Store autentikasi yang sudah ada berada di `src/store/auth/auth-store.ts`;
  jangan menyimpan koleksi Firestore atau secret di sana.
- Struktur monorepo `/apps` dan `/packages` pada bagian rencana arsitektur belum
  diterapkan. Jangan membuat atau memigrasikan ke struktur tersebut kecuali
  diminta secara eksplisit.

## Tentang TapQR

TapQR adalah SaaS untuk UMKM di Indonesia. Produk menggunakan stiker atau kartu
NFC dan QR code yang ditempatkan di meja kasir UMKM seperti kafe, restoran,
laundry, barbershop, bengkel, dan toko retail.

Setelah bertransaksi, pelanggan melakukan tap atau scan dan diarahkan ke landing
page ringkas yang dapat berisi:

- Tombol “Beri Ulasan di Google” sebagai tujuan utama.
- Connect WiFi.
- Kontak WhatsApp.
- Menu atau katalog.
- Tautan media sosial.

Pemilik UMKM mengatur tautan dan tampilan tersebut melalui admin dashboard
tanpa perlu menulis kode.

## Schema Firestore

Gunakan [docs/firestore-schema.md](docs/firestore-schema.md) sebagai kontrak
database. Role pengguna hanya `owner` atau `admin`; card inventory membedakan
material `acrylic` dan `pvc`. Akses Firestore aplikasi harus melalui server
function dan Firebase Admin, bukan Firebase client SDK.
Data lokasi outlet hanya disimpan dalam field `address`; jangan menambah atau
menggunakan field `city` maupun `province`.

## Target pengguna

### Pelanggan UMKM

Pengguna ini awam, terburu-buru, mayoritas memakai perangkat mobile, dan
membutuhkan pengalaman instan tanpa friksi.

### Pemilik UMKM

Pengguna ini adalah klien berbayar yang umumnya tidak terlalu memahami
teknologi, sensitif terhadap harga, dan membutuhkan bukti hasil nyata seperti
penambahan review dan pelanggan yang kembali. Dashboard harus sesederhana
mungkin.

## Pedoman agent

- Untuk coding, ikuti standar teknis dalam dokumen ini dan pola yang sudah ada
  di repository.
- Untuk desain dan copy, bedakan tiga konteks berikut:
  - Customer-facing page: cepat, ringan, mobile-first, minim animasi, dan fokus
    pada satu tindakan utama.
  - Admin dashboard: sederhana, jelas, minim input manual, dan mudah digunakan
    tanpa pelatihan panjang.
  - Marketing/company site: boleh memiliki visual dan animasi lebih kaya serta
    konten lebih panjang dengan tujuan konversi.
- Untuk bisnis dan strategi, gunakan playbook bisnis dalam dokumen ini.
- Jangan membuat mekanisme yang memberikan hadiah, diskon, atau keuntungan lain
  sebagai syarat untuk memberikan review Google.
- Pertimbangkan perangkat kelas bawah dan koneksi internet terbatas pada setiap
  keputusan untuk customer-facing page.
- Jika konteks fitur benar-benar tidak dapat diketahui dari route, folder,
  desain, atau percakapan, pastikan dahulu apakah fitur ditujukan untuk
  customer-facing page, admin dashboard, atau marketing/company site.

## Prinsip pengambilan keputusan

1. Kecepatan dan kesederhanaan customer-facing page selalu lebih penting dari
   estetika.
2. Admin dashboard harus dapat digunakan pemilik UMKM tanpa pelatihan panjang.
   Utamakan pilihan dan toggle daripada formulir panjang.
3. Evaluasi fitur baru dengan pertanyaan: apakah fitur ini meningkatkan peluang
   UMKM mendapat review, pelanggan baru, atau pelanggan yang kembali? Jika
   tidak, tempatkan di backlog.
4. Jangan mendesain alur yang memberi insentif langsung untuk review Google.

## Playbook bisnis

### Positioning

TapQR tidak sekadar menjual stiker NFC. TapQR menjual hasil: lebih banyak review
Google, lebih banyak pelanggan yang kembali, serta data interaksi pelanggan
tanpa mengharuskan pemilik UMKM memahami teknologi. NFC dan QR adalah pintu
masuk menuju layanan tersebut.

### Target awal

Prioritaskan UMKM dengan transaksi cepat dan volume harian cukup tinggi seperti
kafe, restoran kecil, barbershop, laundry yang sudah berkembang, dan bengkel.
UMKM dengan transaksi sangat jarang bukan prioritas awal karena hasil dari
stiker akan lebih sulit dirasakan.

### Model bisnis yang disarankan

- Starter: gratis atau murah, satu stiker, fitur review dan WhatsApp, tanpa
  analitik lengkap.
- Pro: biaya bulanan ringan, multi-stiker atau cabang, dashboard analitik, WiFi
  gate, dan notifikasi otomatis.
- Enterprise: kustom, multi-cabang, integrasi API, serta white-label untuk
  reseller atau agency.
- Media fisik NFC atau QR dijual terpisah dengan pembayaran satu kali agar tidak
  menambah hambatan untuk mencoba layanan.

### Kepatuhan Google Review

Dilarang menjanjikan hadiah, diskon, atau WiFi gratis sebagai syarat memberi
review. TapQR boleh mempermudah akses ke halaman review resmi tanpa syarat dan
meminta review setelah pengalaman positif sebagai ajakan terpisah.

Materi onboarding harus menjelaskan aturan ini agar pemilik UMKM tidak membuat
promosi yang berisiko menyebabkan profil Google Business ditandai atau
ditangguhkan.

### Go-to-market awal

1. Validasi dengan satu sampai tiga UMKM yang dikenal dan kumpulkan masukan.
2. Kumpulkan testimoni serta data peningkatan review sebagai bukti hasil.
3. Tawarkan ke UMKM sejenis di area yang sama karena rekomendasi pemilik usaha
   lain lebih efektif pada tahap awal.
4. Pertimbangkan funnel online dan iklan setelah proses stabil dan sudah ada
   sekitar 10–20 klien.

### Metrik utama

- Jumlah tap atau scan per UMKM per hari.
- Conversion rate dari tap menuju review yang dikirim.
- Jumlah koneksi WiFi ketika fitur digunakan.
- Churn rate klien bulanan.
- Waktu onboarding dari pendaftaran sampai stiker aktif.

## Standar coding

### Prinsip teknis

- Customer-facing page harus statis atau SSR dan tidak bergantung pada aplikasi
  client-side yang berat. Targetkan waktu muat di bawah dua detik pada koneksi
  3G atau 4G biasa.
- Gunakan satu source of truth untuk konfigurasi tautan setiap UMKM. Jangan
  hardcode review, WhatsApp, WiFi, atau tautan lain di banyak tempat.
- Gunakan pilihan dan toggle pada dashboard jika kebutuhan tidak memerlukan
  input teks bebas.
- Catat setiap scan atau tap dengan timestamp, `business_id`, dan action type
  sejak awal untuk analitik serta validasi bisnis.
- Jangan scraping atau menyimpan isi review Google. Arahkan pengguna ke link
  review resmi.
- Rancang data secara modular dengan entitas seperti `businesses`, `stickers`,
  `links`, `scans_log`, dan `subscriptions`.

### Frontend repository ini

- Gunakan TypeScript strict dan pertahankan build tanpa type error.
- Setiap file buatan tim maksimal 300 baris, termasuk komponen, test, style,
  konfigurasi, dan script. File generated serta aset vendor dikecualikan.
- Pisahkan file berdasarkan tanggung jawab sebelum mencapai batas tersebut;
  jangan membuat pecahan file kosong atau pass-through hanya untuk mengejar
  jumlah baris.
- Gunakan komponen yang sudah tersedia sebelum menambah dependensi baru.
- Ikuti batas atomic design:
  - Elements: komponen UI terkecil.
  - Molecules: gabungan beberapa element untuk satu fungsi kecil.
  - Organisms: bagian UI lengkap seperti header, hero, atau footer.
  - Layouts: susunan slot halaman tanpa konten bisnis aktual.
  - Page: mengisi layout dengan organism, data, aset, dan terjemahan aktual.
  - Routes: menghubungkan URL dengan Page dan menjaga route tetap tipis.
- Ambil konten tampilan dari sistem i18n. Setiap key baru harus tersedia di
  locale Indonesia dan Inggris.
- Pastikan implementasi mencakup breakpoint desktop dan mobile yang relevan.
- Jangan membuka atau mengoperasikan browser untuk preview maupun pemeriksaan
  visual kecuali pengguna memintanya secara eksplisit pada permintaan saat
  itu. Jangan menjalankan development server hanya untuk inspeksi visual.
- Setelah perubahan UI selesai, beri tahu pengguna bagian yang perlu mereka
  periksa secara manual di browser.
- Pada dashboard, sidebar desktop harus tetap berada di viewport dan dapat
  di-scroll secara mandiri saat konten panjang. Navigasi harus tetap terlihat
  pada mobile. Gunakan dialog konfirmasi bergaya shadcn untuk aksi destruktif
  dan toast berwarna: hijau untuk sukses, merah untuk error, kuning untuk
  peringatan, serta cyan untuk informasi.
- Gunakan aset SVG atau gambar yang sudah tersedia jika sesuai kebutuhan.
- Simpan state sedekat mungkin dengan pemakainya. Gunakan URL untuk state
  navigasi, loader/server function untuk data server, dan Zustand hanya untuk
  client state yang benar-benar digunakan lintas komponen atau route.
- Zustand sudah terpasang untuk status autentikasi. Jangan membuat store global
  baru atau menyimpan data server di Zustand tanpa use case lintas-route yang
  nyata.

### Skill proyek

Gunakan skill di `.agents/skills` sesuai pekerjaan:

- `tap-qr-code-quality`: implementasi, refactor, review, batas file, dan
  verifikasi kode.
- `tap-qr-i18n`: perubahan copy, locale, route bahasa, serta navigasi `/id` dan
  `/en`.
- `tap-qr-design-system`: desain marketing site, customer-facing page, admin
  dashboard, responsive UI, dan aksesibilitas.
- `tap-qr-frontend-architecture`: kepemilikan state, boundary komponen, data
  flow, dan keputusan penggunaan Zustand.
- `tap-qr-firebase-server`: Firebase Authentication, Firestore, server
  function, otorisasi, transaksi, dan perlindungan kredensial.

### Rencana struktur jangka panjang

Struktur berikut adalah arah arsitektur ketika produk sudah memerlukan
pemisahan aplikasi. Struktur ini belum boleh diterapkan tanpa permintaan:

```text
/apps
  /landing-customer
  /dashboard-admin
  /marketing-site
/packages
  /ui
  /db
```

## Checklist sebelum merilis fitur

- Apakah perubahan memperlambat customer-facing page?
- Apakah waktu muat tetap menargetkan kurang dari dua detik?
- Apakah input yang dibutuhkan dari pemilik UMKM sudah minimal?
- Apakah fitur mematuhi kebijakan Google Review?
- Apakah breakpoint mobile dan desktop yang relevan sudah ditangani, serta
  bagian yang perlu diperiksa pengguna sudah dilaporkan?
- Apakah event penting sudah dicatat untuk kebutuhan analitik?
- Apakah locale Indonesia dan Inggris tetap lengkap?
- Apakah TypeScript dan production build berhasil?

## Pemeliharaan dokumen

Dokumen ini adalah living document. Perbarui ketika ada keputusan baru mengenai
fitur, harga, target pasar, arsitektur, atau standar pengembangan TapQR.
