# Product Requirement Document (PRD): Add-on Digital Membership & Verifikasi QR

## 1. Ringkasan Eksekutif & Value Proposition

- **Nama Fitur**: TapQR Membership & Loyalty Add-on.
- **Kategori**: Add-on Berbayar / Pro Feature (Hanya untuk Owner dengan addon aktif).
- **Tujuan**: Membantu UMKM (kafe, barbershop, car wash, laundry, klinik) mengelola keanggotaan pelanggan secara digital tanpa aplikasi native, menggantikan kartu cap fisik/kertas, serta meningkatkan *repeat customer* (pelanggan kembali).
- **Prinsip**: Cepat di kasir (< 15 detik registrasi, < 3 detik scan verifikasi), tanpa unduh aplikasi, mobile-first, dan offline-friendly untuk pelanggan.

---

## 2. Problem Statement & Target Persona

### Permasalahan
1. **Kartu Member Fisik Kerap Hilang/Lupa**: Pelanggan enggan membawa kartu fisik atau kartu stempel kertas.
2. **Biaya Cetak & Rentan Fraud**: UMKM harus mencetak kartu baru berulang kali dan sulit memverifikasi masa aktif/keaslian.
3. **Antrean Kasir Rentan Macet**: Sistem loyalty yang rumit (input data panjang/unduh aplikasi) membuat kasir lambat dan pelanggan menolak daftar.

### Persona Pengguna
1. **Pelanggan UMKM**: Ingin praktis, cepat, tanpa instalasi aplikasi, bisa unduh kartu ke galeri foto HP, dan tidak butuh kuota internet saat kunjungan berikutnya (cukup buka foto QR).
2. **Staff / Kasir**: Butuh pendaftaran kilat di layar kasir (cukup nama & no. HP), QR langsung muncul di layar untuk discan pelanggan, dan proses verifikasi scan cepat < 3 detik.
3. **Owner UMKM**: Mengontrol hak akses kasir, memantau data member aktif & retensi, tanpa biaya kirim pesan/API pihak ketiga.

---

## 3. Scope & Feature Entitlement ("Hanya Owner Tertentu")

Fitur ini tidak aktif secara default untuk semua akun.
- **Kontrol Hak Akses**: Diatur pada level `outlets/{outletId}.addons.membership.enabled = true`.
- **Aktivasi Add-on**: Diberikan oleh Super Admin TapQR berdasarkan paket langganan Pro / Enterprise / Add-on bulanan.
- **Role Kasir/Staff**: Staff kasir tidak menggunakan akun email/password owner. Owner dapat mengaktifkan **"Mode Kasir / Scanner Kasir"** dengan PIN 4-6 digit atau tautan akses kasir khusus outlet tersebut.

---

## 4. User Journey & Alur Kerja (Zero-WhatsApp & Download Gambar)

```
[Staff di Layar Kasir]            [Pelanggan di Depan Kasir]          [Sistem / DB]
        |                                    |                              |
1. Input Nama & No. HP                       |                              |
2. Klik "Daftarkan" ------------------------------------------------------> Simpan data member &
        |                                                                   generate token acak
3. Modal Layar Kasir                         |                              |
   Tampilkan QR Member Baru                  |                              |
        |                                    |                              |
        +-----> Pelanggan Scan QR Kasir ----->                              |
                dengan Kamera HP             |                              |
                                             v                              |
                                  [Buka Halaman Web Kartu]                  |
                                  - Tampil Kartu Member Digital             |
                                  - Status: AKTIF                           |
                                             |                              |
                                  [Klik: Download Kartu (PNG)]              |
                                  - Kartu tersimpan di Galeri Foto HP       |
                                  - Berisi QR unik member                   |
                                             |                              |
---------------------------------------------+---------------------------------------------
[Kunjungan Berikutnya]                       |                              |
Pelanggan buka Galeri Foto HP                |                              |
& tunjukkan QR ke Kasir <--------------------+                              |
        |                                                                   |
4. Staff Scan QR Pelanggan                                                  |
   (via Scanner Kasir) ---------------------------------------------------> Validasi Token & Progres
        |                                                                   |
5. Tampil Status: VALID                                                     |
   - Progres Stempel Kunjungan (misal: 4/5)                                 |
   - Tombol "+1 Stempel Kunjungan" (jika belum capai target)                |
   - Tombol "Klaim Hadiah & Reset" (jika target tercapai) ----------------> Catat Log Aktivitas
```

---

## 5. Spesifikasi Fungsional

### A. Pendaftaran Member Baru (Sisi Kasir / Staff)
- Form super ringkas pada dashboard kasir:
  - **Nama Pelanggan** (Wajib, teks bebas, maks 40 karakter).
  - **Nomor HP** (Wajib, format Indonesia normalisasi `+62`/`08`, berfungsi sebagai identifikasi unik & pencarian cadangan).
  - **Catatan Opsional** (Tipe kendaraan / preferensi pelanggan, maks 100 karakter).
- Pendaftaran yang berhasil otomatis memberi stempel dan kunjungan pertama (`1/target`).
- Waktu input kasir: ditargetkan selesai dalam **< 15 detik**.
- Setelah form disimpan:
  - Layar kasir langsung menampilkan **Modal QR Code Akses Member** berukuran besar dan jelas.
  - Staff mengarahkan pelanggan: *"Silakan scan QR di layar untuk simpan kartu member Anda"*.
  - **Nol Dependensi WhatsApp**: Kasir tidak perlu membuka WhatsApp Web, tidak butuh kirim chat, tidak perlu pulsa SMS/WA.
  - Sediakan tombol "Cari / Tampilkan Ulang QR" di kasir berdasarkan No. HP jika suatu saat pelanggan tidak sengaja menghapus foto kartunya.

### B. Digital Member Card & Stamp Progress (Sisi Pelanggan)
- Akses via web mobile: `/$locale/m/$memberToken` (Responsif, bobot halaman < 100 KB, muat < 1.5 detik).
- Tampilan mengikuti tema brutalism TapQR:
  - Header: Logo outlet & Nama Bisnis.
  - Kartu Member Virtual: Nama Pelanggan, Nomor Member (`MBR-XXXX`), dan badge status aktif.
  - **Indikator Stempel Digital (Digital Stamp Card)**:
    - Menampilkan kotak/lingkaran stempel progres (contoh: `4 / 5 Kunjungan`).
    - Keterangan reward menarik (contoh: *"Kumpulkan 5 stempel untuk Gratis 1 Kopi"*).
    - Status badge: *"Siap Ditukarkan!"* jika target stempel telah tercapai.
  - QR Code member yang siap discan kasir saat kunjungan berikutnya.
  - **Fitur Utama: Tombol "Download Kartu Digital (PNG)"**:
    - Satu klik langsung merender kartu member beresolusi tajam (format `.png`) yang berisi identitas, QR code, dan info member.
    - File otomatis tersimpan ke **Galeri Foto / Unduhan HP** pelanggan.
    - **Offline-Friendly**: Saat kunjungan berikutnya, pelanggan **tidak butuh kuota internet/sinyal**, cukup membuka foto kartu dari galeri untuk discan kasir.
  - Opsi Tambahan: Tombol "Simpan Bookmark / Add to Home Screen".
  - Section Bawah: Tombol resmi "Beri Ulasan di Google" (tanpa syarat insentif langsung, sesuai kepatuhan Google Review).

### C. Verifikasi Scan & Manajemen Stempel (Sisi Kasir / Staff)
- Akses kasir: `/$locale/cashier/$outletId` melalui PIN permanen milik outlet.
- Fitur kamera pemindai (HTML5 Web QR Scanner) yang responsif:
  - Scan QR member pelanggan (bisa scan langsung dari foto galeri HP pelanggan atau layar web).
  - Dalam < 1 detik menampilkan popup/layar:
    - **Status Validitas**: Hijau (VALID / AKTIF) atau merah (DINONAKTIFKAN/TIDAK TERDAFTAR).
    - Nama pelanggan, nomor HP (disamarkan `0812****1234`), total kunjungan, dan progres stempel saat ini (misal: `Stempel: 4/5`).
    - **Aksi Cepat Kasir**:
      - Jika belum mencapai target stempel: Tombol **[+1 Stempel Kunjungan]** (sekali klik langsung menambah stempel & catat riwayat).
      - Jika target stempel tercapai (misal 5/5): Layar menampilkan banner hijau mencolok **"HADIAH SIAP DITUKARKAN: [Nama Hadiah]"** dengan tombol **[Klaim Hadiah & Reset Stempel]**.
      - Penambahan stempel dibatasi per pelanggan per tanggal WIB sesuai `dailyStampLimit`.
      - Progres yang tidak mendapat stempel baru selama batas hari/bulan owner akan hangus dan kembali ke 0.

### D. Manajemen Member (Sisi Dashboard Owner)
- Menu `Membership` di dashboard owner (hanya muncul jika addon aktif):
  - Ringkasan: Total Member Aktif, Total Stempel Diberikan, Total Hadiah Ditukarkan.
  - Tabel Daftar Member: Nama, No. HP, progres stempel, total kunjungan, terakhir berkunjung, dan aksi pengelolaan.
  - Pengaturan Membership:
    - Aturan Program Stempel: Target kunjungan (misal 5 atau 10) & Judul Hadiah (misal *"Gratis 1 Minuman / Diskon 20%"*).
    - Setting PIN Kasir untuk scanner.

---

## 6. Desain Data & Kontrak Firestore

Mengikuti pola subkoleksi per outlet agar query terlindungi dan terisolasi:

### 1. `outlets/{outletId}` (Penambahan field)
```typescript
addons?: {
  membership?: {
    enabled: boolean;            // Flag entitlement (hanya owner tertentu)
    activatedAt: string;         // ISO UTC
    expiresAt?: string | null;   // Masa berlaku add-on outlet, bukan member
    cashierPinHash?: string;     // SHA-256 PIN scanner kasir
    loyaltyReward?: {
      targetVisits: number;       // misal 5 atau 10
      rewardTitle: string;        // misal "Gratis 1 Kopi" / "Diskon 20%"
      stampExpiryValue: number;   // jumlah hari/bulan sejak stempel terakhir
      stampExpiryUnit: "day" | "month";
      dailyStampLimit: number;    // maksimum stempel per pelanggan per tanggal WIB
    };
  };
};
```

### 2. `outlets/{outletId}/members/{memberId}`
```typescript
interface MemberRecord {
  id: string;                    // MBR-xxxxxxxx (acak 128-bit)
  tokenHash: string;             // SHA-256 dari memberToken (token diakses pelanggan)
  name: string;
  phone: string;                 // +62812...
  status: "active" | "suspended";
  registeredAt: string;          // ISO UTC
  registeredByUid: string;       // UID owner/staff
  lastVisitedAt: string | null;
  totalVisits: number;
  currentStamps: number;         // progres stempel berjalan (0 s.d. targetVisits)
  stampDayKey: string;           // YYYY-MM-DD dalam WIB
  stampDayCount: number;         // stempel yang diberikan pada stampDayKey
  totalRewardsClaimed: number;   // total hadiah yang pernah ditukarkan
  notes?: string;
  updatedAt: string;
}
```

### 3. `outlets/{outletId}/members/{memberId}/logs/{logId}`
- Menyimpan riwayat: `event: "registered" | "verified" | "stamp_added" | "reward_claimed" | "extended" | "status_changed"`, `timestamp`, `recordedByUid`, `details`.

---

## 7. Keamanan & Kepatuhan

1. **Privasi & Keamanan Token Member**:
   - Token di URL publik (`memberToken`) dibuat dengan entropi tinggi 256-bit acak.
   - Database hanya menyimpan hash SHA-256 (`tokenHash`), sehingga token akses kartu tidak dapat ditebak (*unpredictable*).

2. **Keamanan PIN Kasir & Pencegahan Brute-Force**:
   - **Anti Brute-Force Rate Limiting**: Percobaan input PIN kasir dibatasi maksimal 5 kali berturut-turut. Jika gagal 5 kali, akses scanner outlet dikunci otomatis selama 15 menit (pencatatan via server rate-limit TTL).
   - **Salted Hashing**: PIN 6-digit disimpan dalam bentuk hash dengan *salt* unik (`sha256(outletId + pin + SERVER_SECRET)`), mencegah serangan *rainbow table*.
   - **Prinsip Hak Akses Terkecil (*Least Privilege*)**: Sesi kasir terisolasi murni untuk menu scanner (registrasi, scan validasi, tambah stempel, klaim reward). Sesi ini tidak dapat mengakses omzet, data keuangan, pengaturan akun owner, atau data sensitif lainnya.
   - **Masa Aktif Sesi Shift**: Sesi login kasir berlaku tepat 24 jam via secure HTTP-only cookie, sedangkan PIN dan link kasir tetap permanen sampai owner mengubah konfigurasi terkait.
   - **Invalidasi Seketika (*One-Click Revoke*)**: Jika owner mengganti PIN di dashboard, seluruh sesi kasir yang sedang aktif otomatis hangus dan wajib autentikasi ulang.

3. **Perlindungan Data Pelanggan**:
   - Halaman publik kartu member pelanggan hanya menampilkan nama depan/nama panggilan dan nomor member. Nomor HP tidak ditampilkan penuh (disamarkan `0812****1234`) untuk mencegah pencurian data kontak atau *profiling* publik.

4. **Kepatuhan Kebijakan Google Review**:
   - Kartu member digital memuat tautan resmi "Beri Ulasan di Google" untuk mendongkrak reputasi UMKM.
   - **Dilarang Keras**: Mengaitkan perolehan stempel atau hadiah dengan syarat kewajiban memberikan rating/ulasan bintang 5 di Google.

---

## 8. Metrik Keberhasilan (Success Metrics)

1. **Kecepatan Operasional**: Kasir dapat menyelesaikan registrasi dalam ≤ 15 detik dan validasi QR dalam ≤ 3 detik.
2. **Retensi Pelanggan**: Terjadi peningkatan rasio kunjungan ulang (*repeat visits*) pada outlet yang mengaktifkan addon sebesar minimal 20% dalam 2 bulan.
3. **Adopsi Add-on**: Minimal 15% outlet aktif meng-upgrade ke paket dengan addon membership.
