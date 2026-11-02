# Desain Layout & Database: Add-on Digital Membership

Dokumen ini adalah cetak biru teknis perancangan antarmuka (UI/UX) dan arsitektur database (Firestore) untuk fitur Digital Membership & Loyalty Stamp TapQR.

---

## BAGIAN 1: DESAIN DATABASE (FIRESTORE SCHEMA)

Mengikuti standar `docs/firestore-schema.md`: Semua operasi database dilakukan melalui Server Function TanStack Start dan Firebase Admin SDK.

### 1. Ekstensi Koleksi `outlets/{outletId}`

Menambahkan field konfigurasi add-on membership pada outlet:

```typescript
// Path: outlets/{outletId}
interface OutletRecordAddonMembership {
  addons?: {
    membership?: {
      enabled: boolean; // Entitlement add-on aktif/tidak
      activatedAt: string; // ISO UTC
      expiresAt?: string | null; // Masa berlaku add-on outlet, bukan member
      cashierPinSalt: string; // Salt acak (16 bytes hex)
      cashierPinHash: string; // SHA-256(pin + cashierPinSalt + SERVER_SECRET)
      cashierSessionVersion: number; // Naik +1 saat ganti PIN (invalidasi sesi massal)
      loyaltyReward?: {
        targetVisits: number; // Misal: 5 atau 10 kunjungan
        rewardTitle: string; // Misal: "Gratis 1 Kopi Americano"
        stampExpiryValue: number; // Batas sejak stempel terakhir
        stampExpiryUnit: "day" | "month";
        dailyStampLimit: number; // Maksimum stempel per pelanggan per tanggal WIB
      };
    };
  };
}
```

### 2. Subkoleksi `outlets/{outletId}/members/{memberId}`

Menyimpan data member per outlet:

```typescript
// Path: outlets/{outletId}/members/{memberId}
// ID Dokumen: MBR-xxxxxxxx (acak 128-bit)
interface MemberDocument {
  id: string; // MBR-xxxx
  tokenHash: string; // SHA-256 dari memberToken (token di URL pelanggan)
  name: string; // Nama pelanggan (maks 40 karakter)
  phone: string; // Nomor HP normalisasi (+62812...)
  status: "active" | "suspended";
  totalVisits: number; // Total kunjungan seumur hidup
  currentStamps: number; // Progres stempel saat ini (0 s.d. targetVisits)
  stampDayKey: string; // YYYY-MM-DD WIB untuk limit harian
  stampDayCount: number; // Jumlah stempel pada stampDayKey
  totalRewardsClaimed: number; // Berapa kali sudah menukarkan reward
  registeredAt: string; // ISO UTC
  registeredByUid: string; // UID owner atau "cashier-session"
  lastVisitedAt: string | null; // ISO UTC
  notes?: string; // Catatan kasir opsional
  updatedAt: string; // ISO UTC
}
```

### 3. Subkoleksi Riwayat `outlets/{outletId}/members/{memberId}/logs/{logId}`

Mencatat audit trail setiap aktivitas member:

```typescript
// Path: outlets/{outletId}/members/{memberId}/logs/{logId}
interface MemberActivityLog {
  id: string; // LOG-xxxx
  event:
    | "registered"
    | "stamp_added"
    | "reward_claimed"
    | "extended"
    | "status_changed";
  timestamp: string; // ISO UTC
  actor: "owner" | "cashier";
  actorUid: string;
  details: {
    previousStamps?: number;
    newStamps?: number;
    rewardTitle?: string;
    note?: string;
  };
}
```

### 4. Koleksi Rate Limit Kasir `cashierRateLimits/{outletId}_{ipHash}`

Mencegah brute-force PIN kasir (TTL 15 menit):

- Field: `attempts` (number, maks 5), `lockedUntil` (ISO UTC atau null), `expiresAt` (Firestore Timestamp TTL).

---

## BAGIAN 2: DESAIN LAYOUT & UI (ATOMIC DESIGN)

Semua desain visual mengikuti gaya **Brutalism TapQR**: garis batas hitam tebal (`border-2 border-black`), bayangan solid kontras (`shadow-[4px_4px_0px_#000]`), sudut tajam/rounded-none, warna kontras tinggi, dan tipografi tegas.

### A. Layar Customer: Digital Member Card (`/$locale/m/$memberToken`)

Halaman publik mobile-first untuk pelanggan (tanpa login):

```
+------------------------------------------+
|  [Logo] KAFE KOPI KITA                   |
|  Jl. Melati No. 12, Jakarta              |
+------------------------------------------+
| +--------------------------------------+ |
| |  KARTU MEMBER DIGITAL   [● AKTIF]    | |
| |                                      | |
| |  NAMA: BUDI SANTOSO                  | |
| |  ID: MBR-9821                        | |
| |  BERLAKU: SEUMUR HIDUP               | |
| |                                      | |
| |  [ PROGRES STEMPEL REWARD ]          | |
| |  +----+ +----+ +----+ +----+ +----+  | |
| |  | ★1 | | ★2 | | ★3 | | ★4 | |  5 |  | |  <-- Lingkaran stempel (1-4 terisi)
| |  +----+ +----+ +----+ +----+ +----+  | |
| |  "1 stempel lagi dapat Gratis Kopi!" | |
| |                                      | |
| |         +------------------+         | |
| |         |   [QR CODE]      |         | |  <-- QR Code unik untuk discan kasir
| |         +------------------+         | |
| |         Tunjukkan QR ini ke kasir    | |
| +--------------------------------------+ |
|                                          |
| [ 📥 DOWNLOAD KARTU (PNG KE GALERI) ]   |  <-- Tombol utama: simpan gambar
|                                          |
| [ ⭐ Beri Ulasan di Google ]             |  <-- Tautan Google Review resmi
+------------------------------------------+
```

- **Fungsi Download PNG**: Menggunakan `html-to-image` / Canvas untuk mengekspor blok kartu menjadi gambar PNG 1080x1350px beresolusi tinggi langsung ke galeri HP pelanggan.

---

### B. Layar Kasir: Modal Registrasi Member Baru

Ditampilkan di layar tablet/PC kasir setelah input form member:

```
+-------------------------------------------------------+
|  PENDAFTARAN MEMBER BERHASIL!                    [ X ]|
+-------------------------------------------------------+
|                                                       |
|  Nama: Budi Santoso (0812-xxxx-5678)                  |
|  Status: Aktif                                        |
|                                                       |
|             +-------------------------+               |
|             |                         |               |
|             |     [ QR CODE BESAR ]   |               |  <-- Ditunjukkan ke pelanggan
|             |                         |               |
|             +-------------------------+               |
|                                                       |
|       "Arahkan kamera HP Anda ke QR ini               |
|         untuk mengunduh kartu member"                 |
|                                                       |
|  [ Selesai / Layar Kasir ]   [ 🔄 Tampilkan Ulang ]   |
+-------------------------------------------------------+
```

---

### C. Layar Kasir: Scanner & Verifikasi Kunjungan (`/$locale/cashier/$outletId`)

Layar kerja kasir untuk memvalidasi QR pelanggan:

```
+-------------------------------------------------------+
| KASIR SCANNER - KAFE KOPI KITA             [Shift Aktif]
+-------------------------------------------------------+
|                                                       |
|         +---------------------------+                 |
|         |                           |                 |
|         |     [ KAMERA SCANNER ]    |                 |  <-- Viewfinder Web QR
|         |                           |                 |
|         +---------------------------+                 |
|         Arahkan kamera ke QR kartu pelanggan          |
|                                                       |
+-------------------------------------------------------+
| HASIL SCAN:                                           |
|                                                       |
| [ ● VALID: MEMBER AKTIF ]  (Budi Santoso)             |
| Total Kunjungan: 4x                                   |
|                                                       |
| Progres Stempel: [ ★ ] [ ★ ] [ ★ ] [ ★ ] [ ○ ] (4/5)  |
|                                                       |
| +---------------------------------------------------+ |
| |  [ +1 STEMPEL KUNJUNGAN ] (Sekali Klik)           | |  <-- Aksi utama kasir
| +---------------------------------------------------+ |
| (Jika 5/5, berubah jadi: [ 🎁 KLAIM REWARD: GRATIS KOPI ])
+-------------------------------------------------------+
```

---

### D. Layar Owner: Dashboard Membership (`/dashboard/user/membership`)

Menu baru di dashboard owner khusus untuk outlet yang memiliki addon:

1. **Header & Metrik**:
   - Total Member Aktif
   - Total Kunjungan Tercatat
   - Total Hadiah Ditukarkan
2. **Tab Navigasi**:
   - **Daftar Member**: Tabel nama, nomor HP, progres stempel, aksi (detail riwayat, edit, tampilkan ulang QR).
   - **Mode Kasir & PIN**: Input/Ubah PIN kasir 6-digit, tombol salin tautan kasir, tombol "Keluarkan Semua Sesi Kasir".
   - **Pengaturan Program**: Target jumlah stempel, nama hadiah, masa hangus sejak stempel terakhir, dan limit stempel harian per pelanggan.
