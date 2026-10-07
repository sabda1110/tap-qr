import { outletsId } from "./outlets-id";
import { outletCreateId } from "./outlet-create-id";
import { activationPreviewId } from "./activation-preview-id";
import { activationOnboardingId } from "./activation-onboarding-id";

export const adminDashboardId = {
  outletCreate: outletCreateId,
  outlets: outletsId,
  sidebar: {
    outlets: "Outlet",
    cards: "Master kartu",
    activation: "Aktivasi QR",
    openMenu: "Buka menu dashboard",
    closeMenu: "Tutup menu dashboard",
    logout: "Keluar",
    navigationLabel: "Navigasi admin",
    roleLabel: "Administrator",
  },
  cards: {
    kicker: "Master kartu",
    title: "Kelola inventaris kartu TapQR",
    description:
      "Generate kartu baru, cari kartu yang sudah dibuat, dan kelola stok dari satu tempat.",
    searchLabel: "Cari ID kartu",
    searchPlaceholder: "Contoh: TQR-000001",
    searchAction: "Cari",
    generateAction: "Generate kartu",
    generatorTitle: "Generate kartu baru",
    quantityLabel: "Jumlah kartu",
    materialLabel: "Material kartu",
    acrylic: "Akrilik",
    pvc: "PVC",
    generateSubmit: "Generate sekarang",
    cancel: "Batal",
    table: {
      cardId: "ID kartu",
      material: "Material",
      claimStatus: "Status klaim",
      enabled: "Status",
      action: "Aksi",
    },
    unclaimed: "Belum diklaim",
    claimed: "Sudah diklaim",
    enabled: "Aktif",
    disabled: "Nonaktif",
    delete: "Hapus",
    selectedCount: "{count} kartu dipilih",
    deleteSelected: "Hapus yang dipilih",
    deleteAllUnused: "Hapus semua belum digunakan",
    selectAll: "Pilih semua kartu belum diklaim di halaman ini",
    selectCard: "Pilih kartu",
    confirmDeleteSelected:
      "Hapus kartu yang dipilih? Kartu yang sudah digunakan akan tetap aman.",
    confirmDeleteAllUnused:
      "Hapus semua kartu yang belum digunakan? Kartu yang sudah diklaim akan tetap aman.",
    deleteSelectedTitle: "Hapus kartu terpilih?",
    deleteAllUnusedTitle: "Hapus semua kartu belum digunakan?",
    deleteSuccess: "Kartu berhasil dihapus.",
    deleteNoop: "Tidak ada kartu yang dapat dihapus.",
    empty: "Belum ada kartu yang cocok.",
    previous: "Sebelumnya",
    next: "Berikutnya",
    loading: "Memuat kartu...",
    requestError: "Kartu belum dapat diproses. Coba lagi.",
    generated: "Kartu baru berhasil dibuat.",
  },
  activation: {
    preview: activationPreviewId,
    onboarding: activationOnboardingId,
    kicker: "Aktivasi QR",
    title: "Aktifkan kartu untuk satu tujuan langsung",
    description:
      "Hubungkan kartu TapQR ke Google Review atau satu tautan sosial tanpa membuat outlet terlebih dahulu.",
    social: {
      title: "Pilih tujuan kartu",
      description:
        "Pilih satu tujuan yang akan dibuka pelanggan saat melakukan scan atau tap.",
    },
    channels: {
      google_review: {
        title: "Google Review",
        description: "Arahkan pelanggan ke halaman ulasan Google.",
      },
      whatsapp: {
        title: "WhatsApp",
        description: "Buka chat WhatsApp bisnis secara langsung.",
      },
      instagram: {
        title: "Instagram",
        description: "Arahkan ke profil atau konten Instagram.",
      },
      tiktok: {
        title: "TikTok",
        description: "Arahkan ke profil atau konten TikTok.",
      },
      custom: {
        title: "Tautan lain",
        description: "Gunakan tautan lengkap untuk tujuan kustom.",
      },
    },
    cardIdLabel: "ID kartu",
    cardIdPlaceholder: "Contoh: TQR-7B83...",
    cardIdHelp: "Masukkan ID dari menu Master kartu.",
    destinations: {
      google_review: {
        label: "Tautan Google Review",
        placeholder: "https://g.page/.../review",
        helpText: "Gunakan tautan review resmi dari Google Business Profile.",
      },
      whatsapp: {
        label: "Nomor WhatsApp",
        placeholder: "628123456789",
        helpText: "Gunakan format nomor Indonesia, misalnya 628123456789.",
      },
      instagram: {
        label: "Tautan Instagram",
        placeholder: "https://instagram.com/namabisnis",
        helpText: "Masukkan tautan profil atau konten Instagram.",
      },
      tiktok: {
        label: "Tautan TikTok",
        placeholder: "https://tiktok.com/@namabisnis",
        helpText: "Masukkan tautan profil atau konten TikTok.",
      },
      custom: {
        label: "Tautan tujuan",
        placeholder: "https://...",
        helpText: "Masukkan tautan lengkap yang diawali http:// atau https://.",
      },
    },
    googleSearch: {
      label: "Cari bisnis di Google",
      placeholder: "Ketik nama bisnis atau lokasi",
      helpText:
        "Pilih bisnis dari hasil pencarian agar Place ID dan tautan review resmi dibuat otomatis.",
      searching: "Mencari...",
      resultsLabel: "Hasil pencarian bisnis Google",
      error:
        "Pencarian Google belum dapat digunakan. Periksa konfigurasi Google Places API.",
    },
    submit: "Aktifkan QR",
    submitting: "Mengaktifkan...",
    success: "Kartu berhasil diaktifkan.",
    requestError:
      "Kartu belum dapat diaktifkan. Pastikan ID kartu tersedia dan belum terhubung ke bisnis.",
    validation: {
      cardId: "Masukkan ID kartu yang valid.",
      destinationUrl: "Masukkan tautan lengkap yang valid.",
    },
    direct: {
      title: "Tanpa outlet",
      description:
        "Aktivasi ini membuat kartu bekerja langsung untuk satu tujuan, sehingga tidak memerlukan profil outlet atau pemilik bisnis.",
      points: [
        "Satu kartu untuk satu tujuan utama",
        "Tautan dapat diperbarui saat diperlukan",
        "Siap dipakai untuk QR maupun NFC",
      ],
    },
  },
};
