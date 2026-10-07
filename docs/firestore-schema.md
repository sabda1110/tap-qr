# Firestore schema TapQR

Schema ini adalah kontrak data proyek. Semua akses aplikasi berjalan melalui Firebase Admin pada server function.

## Koleksi utama

| Koleksi | Field utama |
| --- | --- |
| `users/{uid}` | `role` (`owner`/`admin`), nama, email, telepon, status, waktu dibuat/diubah |
| `outlets/{outletId}` | `ownerId`, nama, slug, `logoUrl`, alamat, kota, provinsi, telepon, status, waktu dibuat/diubah |
| `cards/{cardId}` | ID kartu, material (`acrylic`/`pvc`), status klaim, owner/outlet, konfigurasi, NFC, status aktif, waktu dibuat/diubah |
| `scanEvents/{eventId}` | `cardId`, event, sumber QR/NFC, waktu, user agent. Koleksi ini dipakai saat analitik dibuat. |

## Outlet dan logo

Schema TypeScript outlet adalah `OutletRecord` di
`src/lib/firebase/firestore-schema.ts`. `logoUrl` berisi URL HTTPS Cloudinary atau
`null` jika logo tidak dipilih. Dokumen lama tanpa field ini tetap dapat dibaca.
Upload gambar menggunakan server function yang memeriksa akses admin dan fungsi
reusable `uploadCloudinaryImage`. Kredensial disimpan hanya di server pada
`CLOUDINARY_ENV=cloudinary://API_KEY:API_SECRET@CLOUD_NAME`.
Format JPG/PNG/WebP dibatasi 2 MB dan logo diperkecil maksimal 512 × 512 piksel.
URL disimpan pada outlet saat aktivasi berhasil dan menjadi logo profil publik;
`config.social.avatarUrl` kartu tetap menjadi fallback untuk data lama.
Tombol hapus logo menghapus pilihan dari form, bukan aset Cloudinary.

## Kartu

Kartu baru selalu memiliki `claimStatus: "unclaimed"`, `ownerId: null`, `outletId: null`, `isEnabled: true`, dan konfigurasi Google/social kosong. Master kartu menambah field `material` agar inventaris PVC dan akrilik dapat dibedakan.

`cardId` dibuat acak dengan entropi 128-bit, misalnya `TQR-7B83...`, sehingga tidak dapat ditebak dari urutan kartu lain. Setiap kartu juga memiliki token klaim acak 256-bit. Token tersebut nantinya menjadi isi QR/NFC untuk proses claim; Firestore hanya menyimpan hash SHA-256-nya pada `claim.claimTokenHash`.

`config.social.links` menyimpan `id`, tipe, label, URL, status aktif, dan urutan. `claim.claimTokenHash` hanya menyimpan hash token klaim; token mentah tidak disimpan di Firestore.

Aktivasi Sosmed oleh admin membuat akun Firebase Authentication dengan role `owner`, profil `users/{uid}`, dan outlet baru. Password awal default `12345678` dapat diubah sebelum submit dan tidak disimpan di Firestore. Kartu diklaim dengan `ownerId`, `outletId`, waktu klaim, serta UID admin. Hash token klaim dihapus setelah kartu digunakan.

`config.social.links` memuat semua tautan pilihan admin; `order` mengikuti urutan drag-and-drop. Google Review menggunakan Place ID pilihan autocomplete dan URL resmi `https://search.google.com/local/writereview?placeid=...`. Nomor WhatsApp dikonversi menjadi URL `wa.me`. Konfigurasi NFC direset menjadi `tapqr`, tanpa mengklaim bahwa NFC fisik telah ditulis.

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

## Akses

`admin` dapat membuat, melihat, dan menghapus master kartu. `owner` adalah pengguna bisnis biasa. Ubah dokumen `users/{uid}.role` menjadi `admin` untuk memberi akses admin.
