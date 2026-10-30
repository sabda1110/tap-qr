# Booking konsultasi TapQR

Booking memakai Firebase Admin dan Firestore yang sudah ada. Pengunjung hanya
memilih slot yang dibuat admin, tanpa akun; admin mengelola melalui
`/id/dashboard/admin/consultations`. Semua waktu disimpan sebagai ISO UTC dan
ditampilkan dalam zona `Asia/Jakarta` dengan label WIB.
Pada landing page, akses booking berada di pertanyaan konsultasi pada FAQ;
tidak ada tombol konsultasi di hero/header atau section promosi terpisah.

## Konfigurasi server

Isi variabel berikut di `.env.local` lokal dan pengaturan environment deployment.
Nama dan contoh kosong tersedia di [`.env.example`](../.env.example).
File `.env` dan `.env.*` sudah diabaikan Git, kecuali `.env.example`.

| Variabel | Isi |
| --- | --- |
| `ADMIN_WHATSAPP` | Nomor admin format `62…`, tanpa `+` atau spasi |
| `ADMIN_EMAIL` | Satu alamat email admin penerima notifikasi |
| `RESEND_API_KEY` | API key Resend dengan izin mengirim email |
| `EMAIL_FROM` | Email pengirim; default `onboarding@resend.dev` untuk pengujian |
| `TELEGRAM_BOT_TOKEN` | Token bot dari BotFather, hanya disimpan di server |
| `TELEGRAM_CHAT_ID` | ID chat pribadi atau grup admin yang menerima pesan |
| `CONSULTATION_APP_URL` | Origin aplikasi, misalnya `https://domain-anda.com` |
| `CRON_SECRET` | Secret acak minimal 32 karakter, buat melalui password manager |

Konfigurasi Firebase Admin proyek tetap diperlukan. `CONSULTATION_APP_URL`
menerima HTTPS; HTTP hanya diizinkan untuk localhost/127.0.0.1 saat pengembangan.
Tidak ada variabel notifikasi yang memakai awalan `VITE_`.

1. Buat bot melalui BotFather dan mulai percakapan dengan bot tersebut. Untuk
   grup, tambahkan bot ke grup admin. Dapatkan chat ID dari update resmi bot,
   tanpa mempublikasikan token atau respons yang berisi data pribadi.
2. Buat API key di Resend dan isi email admin. Domain `resend.dev` untuk tes
   hanya dapat mengirim ke alamat akun Resend sendiri. Untuk alamat lain,
   verifikasi domain pengirim dan ubah `EMAIL_FROM`.
3. Isi origin aplikasi dan secret scheduler. Restart proses lokal atau deploy
   ulang setelah environment berubah.
4. Terapkan indeks pada `firestore.indexes.json` ke proyek Firebase yang sama.
   Outbox memerlukan indeks `status` + `nextAttemptAt`. Ikuti konfigurasi
   deployment Firebase repository; jangan mengubah rules menjadi akses publik.
5. Login dengan akun ber-role `admin`, buka menu konsultasi, buat jadwal,
   kemudian lakukan booking dari halaman publik untuk menguji konfigurasi.

Dokumentasi provider: [Telegram Bot API](https://core.telegram.org/bots/api#sendmessage),
[Resend Send Email](https://resend.com/docs/api-reference/emails/send-email), dan
[batas domain pengujian Resend](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).

## Membuka jadwal di dashboard

Klik **Buka jadwal** di bagian atas dashboard, lalu ikuti tiga langkah:

1. Pilih satu atau beberapa tanggal langsung di kalender.
2. Klik jam mulai yang diinginkan, atau gunakan pilihan cepat 10:00, 11:00,
   13:00, dan 14:00. Jam akhir ditampilkan sesuai durasi pengaturan.
3. Tinjau tanggal/jam lengkap. Pengulangan opsional mencakup 2, 4, atau 8 minggu
   termasuk minggu awal. Jadwal yang sudah ada, melewati batas waktu, atau di
   luar satu tahun ditandai dan harus diperbaiki sebelum disimpan.

Jam yang dipilih berlaku untuk semua tanggal pilihan. Untuk jam berbeda pada
tanggal berbeda, buat jadwal terpisah. Kalender utama hanya untuk melihat dan
mengelola jadwal tersimpan; pengaturan durasi tetap berada di tab Pengaturan.

## Menghapus beberapa jadwal

Pada tab jadwal admin, **Hapus beberapa jadwal** membuka daftar lintas tanggal
dengan checkbox, jam, dan status booking. Pilih semua mengambil maksimal 50
jadwal yang dapat dihapus. Penghapusan satuan mengikuti aturan yang sama.

- Slot kosong boleh dihapus. Slot yang memiliki booking `menunggu` boleh dihapus;
  booking menjadi `dibatalkan_otomatis` dengan alasan `slotDeletedByAdmin`.
- Booking `dikonfirmasi` melindungi slot dari penghapusan. Jika satu slot dalam
  pilihan sudah dikonfirmasi atau datanya berubah/tidak konsisten, seluruh
  transaksi ditolak tanpa penghapusan sebagian. Status tidak diketahui di UI
  juga dilindungi; server tetap menjadi pemeriksaan terakhir.
- Pembatalan, kenaikan revision, pelepasan lock slot dan kuota nomor WhatsApp,
  pembuatan outbox pembatalan, serta penghapusan slot dilakukan atomik. Riwayat
  booking dan event notifikasi tetap disimpan. Kuota beberapa booking pada nomor
  yang sama diperbarui bersama agar booking lain tidak terhapus dari kuota.
- Customer melihat status/alasan baru melalui tautan pribadinya. Pengiriman
  WhatsApp ke customer tetap manual; notifikasi admin memakai outbox yang ada.

## Alur dan aturan

Halaman publik `/$locale/consultation` memakai dua langkah:

1. **Pilih jadwal**: pilih tanggal tersedia lewat Select shadcn, pilih jam,
   periksa ringkasan, lalu tekan
   **Lanjut isi data**. Memilih jam belum mengunci slot atau membuat booking.
2. **Isi data diri**: ringkasan tanggal/jam tetap terlihat. Pengunjung dapat
   kembali mengganti jadwal tanpa kehilangan isian selama halaman tetap terbuka.
   Booking baru dibuat setelah form dikirim dan tetap memerlukan konfirmasi admin.

Ketersediaan tetap diperbarui setiap 25 detik. Jika slot pilihan tidak lagi
tersedia, pengunjung kembali memilih jadwal; isian form tetap dipertahankan.
Refresh yang gagal memblokir pengiriman sampai ketersediaan berhasil dimuat lagi.

- Default: durasi 30 menit, tenggat konfirmasi 2 jam sebelum mulai, batas pesan
  3 jam sebelum mulai, maksimal 3 booking aktif per nomor WhatsApp.
- Batas pemesanan harus lebih besar daripada tenggat konfirmasi. Pada default,
  pembatalan otomatis terjadi saat slot sudah tidak bisa dipesan; statusnya
  menjadi `ditutup`, bukan kembali bisa dipilih.
- Slot dibuat per tanggal/jam manual; menyalin minggu menambahkan slot terpisah.
  Pengunjung tidak dapat membuat slot sendiri atau memesan di luar batas waktu.
- Transaksi Firestore mengunci slot, booking aktif, dan kuota nomor bersama.
  Pembatalan/jadwal ulang melepaskan slot lama jika masih bisa dipesan.
- Status dan pembatalan publik memakai token acak terpisah. Simpan tautan pribadi
  yang tampil setelah booking; kode booking tidak memberi akses status sendiri.
- `.ics` dapat diunduh setelah admin mengonfirmasi. Pelanggan tidak menerima
  email atau WhatsApp otomatis; tombol WhatsApp membuka percakapan untuk dikirim
  sendiri. Admin memberi kabar kepada pelanggan secara manual.

Setelah status dikonfirmasi, detail booking admin menampilkan tombol **Kirim
konfirmasi ke WhatsApp** dengan template nama, kode, tanggal, dan rentang jam WIB.
Admin tetap menekan Kirim di WhatsApp; membuka tombol bukan bukti pesan terkirim.
Pesan tidak menyertakan token, hash, atau tautan pribadi pelanggan. Customer
menyimpan tautan pribadinya dari halaman selesai booking. Halaman status mengecek
setiap 25 detik dan menampilkan toast sukses saat berubah dari menunggu menjadi
dikonfirmasi. Ketika halaman ditutup, situs tidak mengirim notifikasi latar;
admin perlu mengirim kabar manual melalui WhatsApp.

## Pengiriman notifikasi

Transaksi booking juga membuat dokumen outbox `consultationNotifications`.
Penyimpanan booking tidak bergantung pada Telegram maupun Resend. Setiap event
baru, batal, dan jadwal ulang mengirim Telegram + email; pengingat 6 jam/1 jam
sebelum tenggat hanya mengirim Telegram. Pengingat yang sudah lewat ketika
booking dibuat atau dijadwal ulang dilewati; pengingat booking yang sudah tidak
menunggu, berubah revisi, atau melewati tenggat dibuang.

Dispatcher memiliki lease per event agar dua worker tidak mengirim bersamaan.
Status terkirim disimpan per kanal, sehingga retry hanya mengirim kanal yang
belum berhasil. Dashboard menampilkan “Notifikasi belum terkirim” selama masih
ada event pending, dan tombol kirim ulang melewati jeda retry. Scheduler mencoba
ulang dengan jeda bertahap hingga satu jam. Kekurangan konfigurasi tetap menjadi
pending; tidak dianggap berhasil. Log hanya berisi kanal dan kategori kegagalan.

Telegram dikirim sebagai teks biasa tanpa `parse_mode`, email sebagai plain text.
Token status/batal, hash token, kredensial, dan body respons provider tidak pernah
dimasukkan ke pesan atau log. Tautan dashboard dibentuk dari origin server yang
terkonfigurasi, bukan header permintaan pengguna.

Outbox memakai pengiriman *at least once*. Jika provider menerima pesan lalu
proses berhenti sebelum status tersimpan, Telegram dapat terkirim ulang karena
tidak menyediakan idempotency key untuk `sendMessage`. Resend memakai key tetap
per event dengan [masa deduplikasi 24 jam](https://resend.com/docs/dashboard/emails/idempotency-keys).
Status terkirim lokal mencegah retry normal setelah sukses; kegagalan ambigu
lebih dari 24 jam juga dapat menghasilkan duplikat email.

## Scheduler setiap lima menit

Endpoint tersedia di `/api/consultations/cron`, menerima GET atau POST dengan
header `Authorization: Bearer <CRON_SECRET>`. Permintaan tanpa secret yang cocok
mendapat 401. Respons tidak berisi detail booking atau data pelanggan.
Endpoint menjalankan pemeliharaan tenggat, antrean pengingat, dan outbox.

Scheduler belum otomatis didaftarkan ke layanan hosting. Daftarkan tugas dengan
jadwal `*/5 * * * *`, URL HTTPS endpoint, metode POST, serta header Authorization
yang disimpan sebagai secret pada penyedia scheduler. Jangan taruh secret di URL.
Gunakan scheduler HTTP yang mendukung custom header, misalnya
[cron-job.org](https://cron-job.org/en/faq/), atau cron pada server sendiri.

Vercel Hobby hanya mengizinkan cron sekali sehari, sehingga tidak memenuhi
interval lima menit. Gunakan scheduler eksternal, atau Vercel Pro dengan entri
`crons` pada `vercel.json` dan jadwal di atas. Vercel mengirim `CRON_SECRET`
sebagai Bearer header secara otomatis. Rujukan:
[batas cron Vercel](https://vercel.com/docs/cron-jobs/usage-and-pricing) dan
[pengamanan cron](https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs).

Tanpa scheduler, pemeriksaan saat slot/dashboard dimuat tetap memperbarui status.
Namun pengingat dan pembatalan tidak dijamin berjalan ketika tidak ada kunjungan.
Aktifkan scheduler untuk menjalankan perubahan meskipun situs sedang sepi.

## Menguji scheduler

Jalankan aplikasi lokal seperti biasa menggunakan `npm run dev`, atau gunakan
deployment pengujian. Pastikan `CONSULTATION_APP_URL` dan `CRON_SECRET` tersedia
di shell lokal Anda; nilainya harus sama dengan konfigurasi server. Jangan
mengaktifkan shell tracing (`set -x`) saat menjalankan perintah ini.

```sh
curl --fail-with-body --silent --show-error --request POST \
  "${CONSULTATION_APP_URL}/api/consultations/cron" \
  --header "Authorization: Bearer ${CRON_SECRET}"
```

Hasil yang diharapkan adalah `{"ok":true}`; hasil ini berarti proses pemeliharaan
selesai, bukan jaminan kedua provider telah menerima semua pesan. Periksa penanda
notifikasi pada dashboard. Menjalankan endpoint ini dapat mengirim notifikasi
nyata apabila kredensial provider sudah diisi.

1. Tanpa header atau dengan secret salah: harus 401 dan tidak memproses antrean.
2. Buat booking di proyek pengujian, konfirmasi sebelum tenggat, jalankan
   scheduler berulang: status tetap dikonfirmasi dan tidak dibatalkan otomatis.
3. Pada fixture/proyek pengujian, buat booking menunggu dengan tenggat lewat.
   Scheduler harus membatalkannya hanya sekali serta memperbarui slot dan kuota.
4. Uji fixture pengingat tepat 6 jam dan 1 jam sebelum tenggat. Panggilan ulang
   tidak boleh membuat event pengingat baru untuk revisi booking yang sama.
5. Kosongkan kredensial provider pada deployment pengujian, kirim booking:
   booking harus tersimpan dengan penanda notifikasi belum terkirim. Isi kembali
   kredensial, restart, lalu gunakan tombol kirim ulang di dashboard.
6. Kirim dua permintaan booking pada slot yang sama secara bersamaan: hanya
   satu booking boleh berhasil. Jalankan pula pengujian otomatis repository.

Gunakan proyek Firebase pengujian/emulator untuk fixture tenggat; jangan mengubah
jam server atau dokumen produksi hanya untuk mempercepat uji coba.

## Kontrak Firestore

Semua koleksi diakses melalui Firebase Admin dalam server function. Firestore
client tetap ditolak rules. Semua endpoint admin memanggil `requireAdmin()`.

| Koleksi/dokumen | Kontrak |
| --- | --- |
| `consultationSettings/default` | Empat pengaturan angka sesuai default di atas; divalidasi Zod sebelum disimpan |
| `consultationSlots/{YYYYMMDD-HHmm}` | `date` WIB, `startAt`/`endAt` ISO UTC, `status`, `bookingId` nullable, `createdAt` |
| `consultationBookings/{sha256(statusToken)}` | Identitas/kontak seperlunya, kode, slot, status, tenggat, alasan, waktu, revision, hash token status/batal, flag baru/notifikasi/pengingat |
| `consultationSlotLocks/{slotId}` | Satu `bookingId` aktif per slot; dibuat/dihapus bersama transaksi booking |
| `consultationPhoneLocks/{sha256(whatsapp)}` | Daftar `activeIds` untuk membatasi booking menunggu/dikonfirmasi lintas slot secara atomik |
| `consultationNotifications/{bookingId-event-revision}` | Snapshot event server-only, hasil per kanal, status, lease worker, jumlah percobaan, waktu retry |
| `consultationRateLimits/{hash(ip-window)}` | Maksimal 15 percobaan buat/batal per IP dalam jendela 15 menit; hanya hash, hitungan, TTL 24 jam |

Firestore tidak menyediakan partial unique index SQL. Keunikan tanggal/jam
dijaga ID slot deterministik dan `transaction.create`; keunikan booking aktif
per slot dijaga dokumen lock deterministik di transaksi yang sama. Transaksi
juga memeriksa slot tersedia, cutoff, dan kuota nomor sebelum menulis apa pun.
ID dokumen lock tidak pernah dijadikan autentikasi publik.

Browser menghasilkan dua token independen 256-bit memakai `crypto.getRandomValues`.
Hanya hash token tersimpan. Token status berada pada tautan privat; token batal
ada di fragmen URL agar tidak masuk request URL/log HTTP. Pembacaan status dan
pembatalan dilakukan melalui POST; respons publik tidak memuat nomor, catatan,
hash token, maupun data booking orang lain. Token bukan kode booking.

Deadline disalin saat booking dibuat atau dijadwal ulang; penggantian pengaturan
tidak menggeser deadline booking lama. `remindersStartAt` mencatat waktu jadwal
terakhir dipilih agar pengingat yang sudah lewat tidak dikirim saat reschedule.
Konfirmasi dan kedaluwarsa membaca/menulis booking dalam transaksi yang sama,
sehingga perubahan status yang bersaing harus diperiksa ulang saat retry.

Deploy indeks dan TTL melalui `firebase deploy --only firestore:indexes` dari
proyek Firebase yang benar. Tunggu indeks berstatus aktif sebelum uji end-to-end.
Jika indeks gabungan belum aktif, pembacaan booking menunggu dan outbox memakai
filter satu field lalu mengurutkan hasil di server sebelum membatasi jumlah.
Fallback tetap memproses tenggat, tetapi membaca lebih banyak dokumen; deploy
indeks tetap dianjurkan. Error izin/koneksi tidak disamarkan sebagai data kosong.
Tidak ada deploy konfigurasi atau penulisan data produksi otomatis oleh fitur ini.
