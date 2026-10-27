# Pemesanan kartu manual

## Alur pembeli

`/$locale/order` tersedia tanpa login. Pemesan mengisi nama penerima, email,
telepon/WhatsApp, provinsi, kota/kabupaten, kecamatan, kelurahan/desa,
alamat rumah/jalan berupa teks bebas, pilihan Sosmed atau WiFi, bahan akrilik/PVC,
tema Studio Cetak, serta jumlah 1–100. Contoh tema tidak berisi QR aktif.
Harga dan ongkir belum dihitung otomatis; keduanya disepakati dengan admin.

Katalog tema Sosmed memakai satu sumber di `src/lib/print-themes.ts` untuk
Studio Cetak dan pembelian tamu/owner. PVC memiliki tambahan Signal, Orbit,
dan Studio pada ukuran horizontal 86 × 54 mm. Akrilik memiliki tambahan
Sunrise, Arch, dan Mosaic pada kanvas portrait. Semua tema lama tetap tersedia.
Koleksi monster menambahkan Monster Mango (oranye), Monster Boba (teal), dan
Monster Ziggy (kuning), masing-masing dengan desain akrilik serta PVC.
Monster Gym memakai komposisi keluarga monster: latar putih, badge maskot gym,
bintang, pita barbel, sudut pelat beban, serta NFC bulat dan QR berbingkai hitam
untuk PVC horizontal dan akrilik portrait. Pilihannya tersedia di order tamu,
pembelian owner, serta Studio Cetak melalui katalog yang sama.
Ilustrasi karakter dan aksen monster dapat disembunyikan melalui toggle Studio.
Pilihan baru difilter berdasarkan bahan, dan mengganti bahan mengembalikan
tema yang tidak cocok ke tema awal. Server menolak pasangan tema/bahan yang
tidak sesuai. Preview pembelian, cetak satuan, dan massal memakai renderer
yang sama agar komposisi desain konsisten sampai hasil cetak.

Submit menyimpan pesanan `on_progress` dan membuka halaman pelacakan.
Pembeli harus menekan tombol WhatsApp dan mengirim pesan yang telah diisi
kode serta ringkasan pesanan. Menekan submit tidak mengirim chat atau email.
Pesanan tetap masuk daftar admin meskipun pembeli belum mengirim chat.

Menu Cek pesanan menerima nomor HP yang dipakai saat memesan tanpa login.
Nomor `08...`, `628...`, atau `+62...` dinormalisasi ke bentuk internasional.
Request memakai POST agar nomor tidak masuk URL. Hasil berisi kode, produk,
bahan, tema, jumlah, tanggal, status, serta kurir/resi setelah dikirim atau
selesai, dengan pagination 20 pesanan.
Pencarian dibatasi 15 kali per IP dalam jendela 15 menit dan hanya menggunakan
nomor persis, tanpa pencarian prefix. Nomor HP bukan bukti kepemilikan akun.

Tautan `/$locale/orders/$token` tetap tersedia untuk resi. Pencarian nomor HP
tidak mengembalikan token, kontak, alamat, riwayat admin, atau akses akun. Belum tersedia
pengiriman email/SMS atau pemulihan tautan otomatis. Kode `TQO-...` membantu
admin mencocokkan chat, bukan kunci akses privat.

Pesanan dari sesi owner langsung terhubung dengan UID sesi dan muncul di
`/$locale/dashboard/user/orders`. Dashboard owner memiliki tombol Beli kartu.
Form dan endpoint penghubung pesanan tamu telah dihapus untuk menyederhanakan
alur. Pesanan tamu tetap dicek melalui nomor HP atau tautan pribadi, dan tidak
otomatis dihubungkan berdasarkan email. Pesanan yang sudah terhubung tetap ada.

Pembelian owner berada di `/$locale/dashboard/user/buy` dengan navigasi akun
yang tetap terlihat. Submit owner memakai endpoint yang mewajibkan sesi owner;
sesi yang berakhir tidak boleh membuat pesanan sebagai tamu. Setelah berhasil,
pengguna kembali ke Pesanan saya dengan pesanan baru dan tombol WhatsApp.
Owner yang membuka halaman order publik diarahkan ke checkout dashboard.

## Halaman panduan: dari membeli sampai aktivasi

Halaman publik `/$locale/tutorial/activation` menjelaskan empat tahap untuk
pembeli kartu Sosmed / Google Review. Tutorial tidak ditampilkan penuh pada
landing; tautan Cara aktivasi pada header, footer, pertanyaan FAQ, dan navigasi
dashboard owner (desktop/mobile) membukanya di tab baru. Halaman tetap bisa
diakses sebelum maupun setelah login, tanpa memuat data akun atau pesanan.

Panduan menggunakan peta empat pos dengan pion yang bergerak berurutan menuju
pos pilihan. Hover/fokus menampilkan ringkasan; klik/tap menampilkan petunjuk
lengkap. Tombol Sebelumnya, Lanjut, dan Ulangi peta menyediakan alternatif
navigasi. Pilihan tahap hanya state lokal, bukan status pesanan atau aktivasi.
Mobile menyediakan tautan menuju panel petunjuk di bawah peta; animasi mengikuti
preferensi reduced motion dan tooltip dapat ditutup dengan Escape.

1. Beli kartu tanpa akun, lanjutkan ke WhatsApp, kirim pesan, dan sepakati
   harga, ongkir, pembayaran, serta pengiriman dengan admin.
2. Setelah kartu diterima, scan QR kartu yang belum aktif dan buat akun atau
   masuk. ID kartu terbawa ke dashboard dan panduan aktivasi terbuka otomatis.
3. Pada Pilih bisnis, buat outlet dengan nama, slug, alamat, dan logo opsional,
   atau pilih outlet terdaftar. Klik Lanjut untuk memilih tautan.
4. Pilih minimal satu tautan, lengkapi detail tujuan serta ID kartu, lalu tekan
   Aktifkan kartu. Outlet baru dan klaim disimpan bersamaan. Uji scan/tap setelahnya.

Empat tahap ini berbeda dari tiga langkah di dalam wizard aktivasi:
Pilih bisnis → Pilih tautan → Isi detail. Dari dashboard, pengguna juga dapat
menekan Aktifkan kartu dan mengisi ID atau memindai QR pada langkah Isi detail.
Pesanan tamu tetap dicek dengan nomor HP atau tautan pribadi setelah mendaftar.
Kartu WiFi memiliki konfigurasi jaringan terpisah yang dikoordinasikan dengan admin.
Copy panduan berada di `src/i18n/locales/getting-started-{id,en}.ts`.

## Alur admin

`/$locale/dashboard/admin/orders` menampilkan 20 pesanan per halaman,
dalam tabel ID transaksi, WhatsApp/telepon, status, dan aksi Detail/Hapus,
dengan filter status dan pencarian kode lengkap. Detail membuka dialog berisi
pemesan, pengiriman, tombol edit/pengelolaan, serta riwayat perubahan. Hapus
meminta konfirmasi dan mengarsipkan transaksi selesai/dibatalkan; transaksi
aktif harus dibatalkan atau diselesaikan dahulu. Tidak ada hapus permanen.
Tabel dapat di-scroll horizontal pada mobile, sedangkan isi dialog di-scroll
terpisah dengan tombol tutup pada footer. Admin mencocokkan kode dengan
chat WhatsApp, menyepakati harga/ongkir/pembayaran, kemudian memperbarui status:

1. `on_progress`: tercatat, menunggu koordinasi WhatsApp.
2. `confirmed`: admin telah mengonfirmasi kesepakatan dan menyiapkan kartu.
3. `shipped`: kurir dan nomor resi wajib diisi; pembayaran dan produksi sudah dicatat.
4. `completed`: admin sudah mendapatkan konfirmasi barang diterima.

Status `cancelled` mengakhiri pesanan sebelum pengiriman. Semua perubahan
memeriksa `revision` dan otorisasi dalam transaksi. Tidak ada hapus permanen;
admin dapat mengarsipkan dan mengembalikan transaksi selesai/dibatalkan.
Filter Arsip hanya mengubah daftar admin; pesanan tetap terlihat bagi owner
serta pada pelacakan publik yang sesuai.

Owner dapat edit/batal hanya saat `on_progress`, belum dibayar, dan produksi
belum dimulai. Edit menggunakan halaman dashboard terpisah; pembatalan meminta
alasan dan konfirmasi. Setelah dikonfirmasi atau dibayar, owner meminta perubahan
melalui WhatsApp. Tamu mendapat tombol permintaan edit/pembatalan di hasil
pencarian nomor HP dan halaman pelacakan, tanpa mendaftar akun.

Admin dapat mengedit pesanan sebelum dikirim dan produksi dimulai, termasuk
pesanan dikonfirmasi/dibayar, dengan alasan wajib. Perubahan harga/selisih
pembayaran disepakati manual di WhatsApp. Admin mencatat `unpaid` → `paid` setelah
memeriksa transfer, dan `paid` → `refunded` hanya setelah pengembalian selesai
sebelum pengiriman. Pembatalan berbayar ditolak sampai refund dicatat. Tidak
ada integrasi bank, refund otomatis, kurir, atau notifikasi otomatis.

Produksi dimulai setelah konfirmasi dan pembayaran, tidak dapat direset.
Setelah pengiriman, admin hanya boleh mengoreksi kurir/resi dengan alasan;
pembatalan dan pengeditan kartu/alamat dikunci. Transaksi selesai tidak diedit.
Admin membaca 20 perubahan terbaru melalui Riwayat perubahan: waktu, pelaku,
alasan, serta nilai sebelum/sesudah; seluruh event tetap disimpan di Firestore.

Pesanan menyimpan pilihan tema yang sama dengan Studio Cetak. Admin memakai
Studio Cetak untuk produksi setelah konfirmasi. Pemesanan tidak membuat akun,
outlet, stok, atau klaim kartu. Pengaturan kartu Sosmed memakai alur aktivasi/
klaim yang ada. Form pesanan WiFi tidak menerima payload maupun password WiFi;
draft produksi WiFi tetap lokal di Studio Cetak sesuai kontrak proyek.

## Data dan akses

Kontrak TypeScript berada di `src/server/orders/order.types.ts`. Pesanan
menyimpan `name`, `email`, `phone`, `address`, `product` (`social`/`wifi`),
`material` (`acrylic`/`pvc`), `theme`, `quantity`, `code`, `ownerId`, `status`,
`shippingRegion` (`province`, `city`, `district`, `village`), `carrier`,
`trackingNumber`, `createdAt`, `updatedAt`, dan `history`.
Pengelolaan menambahkan `paymentStatus`, `productionStarted`, `revision`,
`archived`, dan `cancellationReason`. Dokumen lama memakai default belum dibayar,
produksi belum dimulai, revision 0, dan belum diarsipkan; admin harus mencatat
pembayaran lama berdasarkan bukti nyata, tanpa menebak dari status pengiriman.
Audit tersimpan di `orders/{id}/events/{eventId}` dan tidak dikirim ke publik.
Wilayah wajib pada pesanan baru, sedangkan pesanan lama tanpa wilayah tetap
dapat dibaca. Field wilayah ini hanya milik pesanan, bukan outlet.
Waktu memakai ISO UTC, dengan tampilan WIB yang konsisten.

Token dibuat memakai Web Crypto 256-bit. ID dokumen adalah SHA-256 token;
token mentah hanya berada pada tautan milik pembeli dan state halaman.
Mengulang request dengan token dan draft yang sama mengembalikan pesanan lama,
sehingga gangguan jaringan tidak membuat pesanan ganda.

Endpoint token privat mengembalikan produk, tema, bahan, jumlah, kode, status,
kurir/resi, dan riwayat waktu. Endpoint nomor HP mengembalikan ringkasan terbatas
dengan kurir/resi untuk pesanan dikirim/selesai. Kontak, alamat, ownerId, dan UID admin hanya
tersedia melalui endpoint yang memeriksa sesi dan kepemilikan/admin.
Halaman pribadi memakai noindex, no-referrer, dan respons data no-store.
Tidak ada event analitik untuk formulir atau token pelacakan.

Pembuatan dibatasi lima pesanan per IP dan per email dalam jendela 15 menit.
Identifier rate limit disimpan sebagai hash; dokumen TTL tidak berisi email/IP
mentah. Aturan Firestore tetap menolak akses client; semua operasi melalui
server function dan Firebase Admin.

## Konfigurasi dan verifikasi

- Isi `ORDER_WHATSAPP_NUMBER` di `.env.local` dan environment deployment,
  menggunakan format internasional, contoh `6281234567890`. Nomor `08...`
  dinormalisasi ke `62...`. Nomor ini ditampilkan pada tautan WhatsApp pembeli,
  tetapi tidak dibaca melalui `VITE_` env. Tanpa nomor valid, submit dinonaktifkan.
- Deploy `firestore.indexes.json` untuk query owner/status/nomor HP/urutan waktu dan TTL
  `orderRateLimits.expiresAt`. Tidak diperlukan perubahan rules client.
  Pencarian nomor HP memiliki fallback jika indeks komposit belum tersedia:
  query equality memakai indeks otomatis, tetap maksimal 21 dokumen per request.
  Dalam fallback, pagination mengikuti ID dokumen dan tanggal diurutkan per
  halaman; urutan terbaru lintas halaman berlaku setelah indeks komposit siap.
  Daftar pesanan owner/admin juga memiliki fallback indeks tunggal. Query owner
  tetap memfilter UID di Firestore; filter status tambahan dilakukan di server
  dengan maksimal 101 dokumen dibaca per request. Cursor mengikuti dokumen
  terakhir yang diperiksa agar pagination tidak melewatkan hasil tersaring.
  Urutan tanggal pada fallback berlaku per halaman sampai indeks tersedia.
- Jalankan `npm run test:orders`, `npx tsc --noEmit`, dan `npm run build`.
- Test memakai mock transaksi tanpa menulis Firestore produksi. Verifikasi
  integrasi manual setelah env dan indeks tersedia: pesan sebagai tamu/owner,
  ulang submit setelah gangguan jaringan, cek lewat nomor HP, buka tautan pribadi,
  cocokkan kode WhatsApp, lalu jalankan status hingga selesai.
- Periksa formulir, pilihan tema, navigasi mobile/desktop, dan halaman resi di
  browser. Agent tidak menjalankan browser/dev server untuk inspeksi visual.
