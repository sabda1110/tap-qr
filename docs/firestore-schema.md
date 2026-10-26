# Firestore schema TapQR

Schema ini adalah kontrak data proyek. Semua akses aplikasi berjalan melalui Firebase Admin pada server function.

## Koleksi utama

| Koleksi | Field utama |
| --- | --- |
| `users/{uid}` | `role` (`owner`/`admin`), nama, email, telepon, status, waktu dibuat/diubah |
| `outlets/{outletId}` | `ownerId`, nama, slug, `logoUrl`, alamat, telepon, status, konfigurasi profil publik opsional, waktu dibuat/diubah |
| `cards/{cardId}` | ID kartu, material (`acrylic`/`pvc`), status klaim, owner/outlet, konfigurasi, NFC, status aktif, waktu dibuat/diubah |
| `scanEvents/{eventId}` | `cardId`, event, sumber QR/NFC, waktu, user agent. Koleksi ini dipakai saat analitik dibuat. |
| `orders/{sha256(token)}` | kode pesanan, ownerId opsional, kontak/alamat penerima, produk, material, tema, jumlah, status, pengiriman, riwayat, waktu ISO UTC |
| `orderRateLimits/{hash}` | hitungan pembuatan pesanan per IP/email per 15 menit, `expiresAt` untuk TTL |
| `analyticsRateLimits/{hash}` | batas event publik per IP/menit dan deduplikasi browser/event, `expiresAt` untuk TTL; tidak menyimpan IP atau ID browser mentah |
| `orders/{orderId}/events/{eventId}` | aksi pengelolaan, timestamp ISO UTC, UID/nama pelaku, alasan, perubahan field before/after; hanya endpoint admin |

## Outlet dan logo

Schema TypeScript outlet adalah `OutletRecord` di
`src/lib/firebase/firestore-schema.ts`. `logoUrl` berisi URL HTTPS Cloudinary atau
`null` jika logo tidak dipilih. Dokumen lama tanpa field ini tetap dapat dibaca.
Upload gambar menggunakan server function yang memeriksa akses admin untuk form
admin atau sesi pengguna untuk klaim kartu di dashboard user, serta fungsi
reusable `uploadCloudinaryImage`. Kredensial disimpan hanya di server pada
`CLOUDINARY_ENV=cloudinary://API_KEY:API_SECRET@CLOUD_NAME`.
Format JPG/PNG/WebP dibatasi 2 MB dan logo diperkecil maksimal 512 × 512 piksel.
URL disimpan pada outlet saat aktivasi berhasil dan menjadi logo profil publik;
`config.social.avatarUrl` kartu tetap menjadi fallback untuk data lama.
Tombol hapus logo menghapus pilihan dari form, bukan aset Cloudinary.

## Kartu

Kartu baru selalu memiliki `claimStatus: "unclaimed"`, `ownerId: null`, `outletId: null`, `isEnabled: true`, dan konfigurasi Google/social kosong. Master kartu menambah field `material` agar inventaris PVC dan akrilik dapat dibedakan. Status produksi fisik disimpan terpisah pada `print.status` (`unprinted`/`printed`), `print.printedAt`, dan `print.printedBy`; dokumen lama tanpa field `print` dianggap belum dicetak. Hanya kartu belum diklaim yang dapat diubah status cetaknya dari master kartu.

`cardId` dibuat acak dengan entropi 128-bit, misalnya `TQR-7B83...`, sehingga tidak dapat ditebak dari urutan kartu lain. Setiap kartu juga memiliki token klaim acak 256-bit. Token tersebut nantinya menjadi isi QR/NFC untuk proses claim; Firestore hanya menyimpan hash SHA-256-nya pada `claim.claimTokenHash`.

`config.social.links` menyimpan `id`, tipe, label, URL, status aktif, dan urutan.
Tautan WhatsApp dapat memiliki field opsional `message` yang menyimpan template
pesan pembuka per kartu; URL `wa.me` juga memuat parameter `text` yang sudah
di-encode. Dokumen lama tanpa `message` tetap valid. `claim.claimTokenHash` hanya
menyimpan hash token klaim; token mentah tidak disimpan di Firestore.

Aktivasi Sosmed oleh admin membuat akun Firebase Authentication dengan role `owner`, profil `users/{uid}`, dan outlet baru. Password awal default `12345678` dapat diubah sebelum submit dan tidak disimpan di Firestore. Kartu diklaim dengan `ownerId`, `outletId`, waktu klaim, serta UID admin. Hash token klaim dihapus setelah kartu digunakan.

`config.social.links` memuat semua tautan pilihan admin; `order` mengikuti urutan drag-and-drop. Google Review menggunakan Place ID dan URL resmi `https://search.google.com/local/writereview?placeid=...`. Nomor WhatsApp dikonversi menjadi URL `wa.me`; username Instagram dan TikTok dikonversi menjadi URL profil resminya. Konfigurasi NFC direset menjadi `tapqr`, tanpa mengklaim bahwa NFC fisik telah ditulis.

`outletSlugs/{slug}` memesan slug unik dalam transaksi yang sama dengan pembuatan profil, outlet, dan pembaruan kartu. Jika transaksi gagal, akun Authentication yang baru dibuat dibatalkan. Email yang sudah terdaftar tidak digunakan ulang atau ditimpa.

## Pengelolaan outlet admin

Tautan dimiliki masing-masing kartu pada `cards/{cardId}.config.social.links`.
Satu outlet dapat memiliki kartu dengan kombinasi sosmed berbeda. Detail outlet
mengambil daftar tautan setiap kartu dan ringkasan kanal dari seluruh kartunya.
Edit informasi outlet hanya memperbarui outlet dan reservasi slug.
Edit logo menggunakan komponen upload Cloudinary yang sama dengan aktivasi.
Logo baru atau penghapusan pilihan diterapkan ke `outlets.logoUrl` setelah
menyimpan form informasi outlet; membatalkan form mempertahankan logo sebelumnya.
Field logo yang tidak dikirim tidak mengubah nilai yang sudah tersimpan.
Edit sosmed memerlukan ID outlet dan ID dokumen kartu; transaksi memeriksa kartu sudah diklaim
serta terhubung ke outlet tersebut, lalu hanya memperbarui konfigurasi kartu itu.
Tautan, urutan, status aktif, dan konfigurasi Google dapat diubah per kartu.
Field `outlets.links` yang mungkin tersimpan dari implementasi sebelumnya tidak
dibaca atau dijadikan sumber konfigurasi. Tidak ada sinkronisasi tautan antar kartu.
Password, akun pemilik, dan URL NFC fisik tidak diubah oleh fitur edit ini.

## Pengelolaan outlet pemilik

Dashboard `/$locale/dashboard/user` memuat outlet dan kartu melalui server
function GET, dengan query `ownerId` dari sesi pengguna. Respons hanya berisi
informasi outlet dan konfigurasi tautan untuk pengelolaan; token klaim dan
konfigurasi NFC tidak dikirim ke browser.
Pemilik dapat memperbarui informasi, logo, slug, dan status outlet, serta tautan
masing-masing kartu. Transaksi edit outlet memeriksa kepemilikan outlet;
transaksi edit kartu memeriksa kepemilikan outlet dan kartu, hubungan outlet,
dan status klaim sebelum menulis. Endpoint admin tetap memakai guard admin.
Menambah outlet baru menggunakan alur klaim kartu yang sudah tersedia.

Pemilik juga dapat mengelola `outlets.publicProfile.highlights` melalui endpoint
khusus owner. Maksimal terdapat tiga highlight per outlet, judul maksimal 24
karakter, dan setiap highlight berisi satu sampai lima gambar berurutan. Setiap
gambar menyimpan ID acak, URL HTTPS Cloudinary, serta `publicId` untuk pembersihan
aset saat gambar dihapus. Editor browser menerima sumber JPG/PNG/WebP maksimal
10 MB, menampilkan preview 9:16, dan menghasilkan JPEG 1080 × 1920 maksimal
2 MB sebelum upload. Mode awal mempertahankan seluruh gambar dengan latar blur,
termasuk untuk sumber landscape; zoom dan posisi dapat diubah owner sebelum
upload. Server tetap memvalidasi file hasil, kepemilikan outlet, serta prefix
`publicId`; admin tidak memiliki endpoint pengelolaan galeri ini.

## Tambah outlet dan duplikasi

Admin dapat membuat outlet tambahan untuk owner aktif yang sudah terdaftar,
tanpa membuat atau mengganti akun dan password owner. Form memakai data outlet,
logo Cloudinary, dan ID kartu stok pertama. Transaksi memeriksa owner aktif,
slug unik, dan kartu belum diklaim sebelum membuat outlet, reservasi slug, dan
mengklaim kartu. Kegagalan validasi tidak menghasilkan outlet atau klaim sebagian.

Duplikasi memilih outlet sumber milik owner yang sama, kartu sumber, lalu tautan
individual. Tautan yang dipilih disalin ke draft kartu baru dengan ID tautan baru,
label, tujuan, dan status aktif yang sama. Urutan disimpan ulang untuk kartu baru.
Admin dapat mengubah salinan sebelum menyimpan. Tidak ada ID sumber atau relasi
sinkronisasi yang disimpan; mengedit sumber maupun salinan tidak mengubah yang lain.
Konfigurasi verifikasi Google, token klaim, NFC, dan identitas kartu tidak disalin.

## Profil outlet publik

Route `/$locale/p/$id` menerima ID dokumen outlet atau slug. Server mengambil
kartu berdasarkan `ownerId` outlet, lalu hanya menggunakan kartu yang terhubung
ke outlet tersebut, sudah diklaim, dan aktif. Tautan aktif digabung berdasarkan
urutan kartu yang stabil, dengan URL duplikat dihapus dan Google Review sebagai
tindakan utama. Data akun, token klaim, dan konfigurasi NFC tidak dikirim ke publik.
Kunjungan halaman mencatat `profile_view` melalui server function POST ke
`scanEvents`, dengan `business_id`/`outletId`, timestamp, `cardId: null`, dan
`source: "direct"`. Event ini adalah kunjungan profil, bukan bukti scan QR/NFC
atau ulasan yang telah dikirim.

Field opsional `outlets.publicProfile` menyimpan presentasi link-in-bio dalam
satu objek: preset `theme` (`coffee`, `barbershop`, atau `general`), `tagline`,
`greeting`, ringkasan `hours`, dan array `highlights`. Respons publik highlight
hanya memuat ID, judul, dan URL gambar; `publicId` Cloudinary tidak dikirim.
Jika belum tersedia, profil memakai tema dan copy bawaan serta tidak menebak
status buka/tutup. Klik tautan publik dicatat
sebagai `link_click` dengan kanal tujuan; event ini bukan bukti bahwa pelanggan
menyelesaikan review atau tindakan di situs tujuan.

Pembukaan highlight dicatat ke `scanEvents` sebagai `highlight_open`, dengan
`business_id`/`outletId`, ID acak highlight, `cardId: null`, timestamp, dan
`source: "public_profile"`. Event tidak menyimpan judul, URL gambar, identitas
pelanggan, atau data sensitif lainnya.

## Akses

`admin` dapat membuat, melihat, dan menghapus master kartu. `owner` adalah pengguna bisnis biasa. Ubah dokumen `users/{uid}.role` menjadi `admin` untuk memberi akses admin.

## Pemesanan kartu

Pesanan tamu/owner disimpan terpisah dari inventaris dan akun. Kontrak kontak,
token pelacakan, akses owner/admin, transisi status, indeks, dan konfirmasi
WhatsApp dijelaskan di [Pemesanan kartu manual](manual-card-orders.md).
Form pesanan tidak menerima atau menyimpan payload/password WiFi.
Pembayaran manual, produksi, pembatalan, revision, dan arsip juga disimpan pada
pesanan. Tidak ada penghapusan transaksi; perubahan dan event audit berjalan
dalam transaksi yang sama. Owner hanya mengubah pesanan miliknya yang belum
dibayar/dikonfirmasi/produksi. Nilai default menjaga dokumen lama dapat dibaca.

## Studio cetak WiFi

Studio cetak admin membedakan tab Sosmed dan WiFi melalui search URL `studio`.
Tab WiFi menerima satu payload `WIFI:...` per baris, dengan validasi WPA, WEP,
atau jaringan tanpa password (`nopass`). QR menyimpan payload masukan secara
langsung, termasuk escape karakter khusus, tanpa URL perantara TapQR.
Cetak massal mendukung salinan per jaringan, maksimal 100 kartu per pekerjaan.
Nama jaringan diambil dari field `S` untuk tampilan kartu; password tidak dicetak
sebagai teks. Tema WiFi menggunakan copy koneksi WiFi, bukan ajakan review.
Semua desain WiFi menyediakan penanda Tap NFC di samping QR; penanda ini tidak
menulis atau memverifikasi isi tag fisik. Penulisan NFC dilakukan terpisah.
Pilihan tema mencakup Monster, Mono Brutal, Natural Bold, Coffee Shop,
Barbershop, dan Kraken Neon, dengan tampilan yang sama pada satuan dan massal.

Draft dan QR hanya berada di state lokal halaman. Alur ini tidak membuat
dokumen Firestore, tidak mencatat kredensial di analitik, dan tidak mengubah
status cetak inventaris kartu. Tidak ada perubahan kontrak koleksi kartu atau
outlet untuk fitur ini.

## Klaim mandiri melalui URL kartu

Route `/$locale/$cardId` memeriksa kartu aktif di server. Kartu `unclaimed`
membawa `cardId` ke login/registrasi dan dashboard melalui query URL. Dashboard
membuka popup tambah outlet dan tautan; penyimpanan memerlukan sesi autentikasi.
Pembuatan outlet, reservasi slug, dan klaim kartu berjalan dalam satu transaksi
agar klaim bersamaan tidak menimpa pemilik. Form minimal meminta nama, slug,
alamat operasional, dan setidaknya satu tautan aktif; logo bersifat opsional.
Jika pengguna sudah memiliki outlet aktif, mereka dapat memilih outlet tersebut
di langkah pertama. Transaksi memverifikasi `ownerId` outlet sama dengan sesi
pengguna sebelum menghubungkan kartu; outlet dan reservasi slug tidak dibuat
ulang. Wizard memiliki tiga langkah: Pilih bisnis, Pilih tautan, dan Isi detail.
Penyimpanan di akhir wizard membuat outlet baru (jika dipilih) serta menyimpan
konfigurasi Google Place ID dan tautan sosial pada kartu yang sedang diklaim.
Pemilik dapat memilih kartu sumber dari outlet miliknya untuk menyalin tautan
pilihan ke draft kartu baru. Server memeriksa kepemilikan outlet sumber; salinan
menerima ID tautan baru dan tidak terhubung dengan kartu asal.
Klaim mandiri menggunakan ID acak kartu sebagai akses klaim sesuai alur URL;
token klaim terpisah tidak diwajibkan pada alur ini, dan hash dihapus saat klaim.

Kartu `claimed` memakai tautan aktif milik kartu tersebut: satu URL HTTP/HTTPS
unik diarahkan langsung, sedangkan nol atau banyak URL menampilkan profil pada
URL kartu yang sama. Nama, logo, tema, dan highlight berasal dari outlet;
tautan hanya berasal dari kartu yang diakses, setelah memeriksa owner, outlet,
status klaim, dan status aktif. Jangan redirect ke profil outlet gabungan
karena konteks kartu akan hilang. Route `/$locale/p/$id` tetap menjadi profil
umum yang menggabungkan tautan kartu outlet. Tampilan kartu mencatat
`card_visit` saja, tanpa menambahkan `profile_view` langsung.
Kartu nonaktif, outlet nonaktif, dan kartu tidak ditemukan tidak diarahkan.
Kunjungan route mencatat `card_visit`, `cardId`, `business_id`/`outletId`, serta
timestamp di `scanEvents`. Sumber `unknown` digunakan karena URL tidak membedakan
QR, NFC, dan kunjungan langsung; event bukan bukti review terkirim. Prefetch
route tidak mencatat kunjungan.

## Perlindungan dan pembacaan analitik

Endpoint POST event publik menerapkan batas 120 event diterima per IP per menit
dan deduplikasi kombinasi browser, target, jenis event, serta kanal/highlight
selama lima detik. Cookie anonim HTTP-only `tapqr_analytics` berlaku satu hari;
browser yang berbeda tetap dibedakan saat memakai WiFi yang sama. Dokumen limiter
hanya menyimpan hash kunci, hitungan/waktu, dan `expiresAt` satu hari. Kebijakan
TTL `analyticsRateLimits.expiresAt` tersedia di `firestore.indexes.json` dan harus
diaktifkan saat konfigurasi Firestore dideploy. Batas ini mengurangi spam event,
bukan verifikasi bahwa tap, klik, atau review sungguhan telah terjadi.

Jika limiter atau pencatatan gagal, event dilewati dan navigasi tetap berjalan.
Query profil publik hanya mengambil kartu dengan `outletId` terkait, kemudian
tetap memeriksa owner, status klaim, dan status aktif. Pencatatan kunjungan profil
tidak memuat ulang koleksi kartu. Jika hitungan atau daftar outlet analitik admin
gagal dimuat, respons statistik bernilai `null`; UI menampilkan kondisi tidak
tersedia dan tombol coba lagi, bukan angka nol yang menyerupai data valid.
