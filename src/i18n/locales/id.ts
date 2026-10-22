import { adminDashboardId } from "./admin-dashboard-id";
import { authId } from "./auth-id";
import { cardClaimId, userDashboardId } from "./user-dashboard-id";
import { outletProfileId } from "./outlet-profile-id";
import { ordersId } from "./orders-id";
import { landingFaqId } from "./landing-details-id";
import { productShowcaseId } from "./product-showcase-id";
export const id = {
  productShowcase: productShowcaseId,
  faq: landingFaqId,
  orders: ordersId,
  outletProfile: outletProfileId,
  header: {
    brandHomeLabel: "Beranda TapQR",
    mainNavigationLabel: "Navigasi utama",
    features: "Fitur",
    pricing: "Harga",
    testimonials: "Testimoni",
    login: "Masuk",
    register: "Daftar",
    buy: "Beli kartu",
    checkOrder: "Cek pesanan",
    languageLabel: "Pilih bahasa",
    openMenu: "Buka menu navigasi",
    closeMenu: "Tutup menu navigasi",
  },
  auth: authId,
  cardClaim: cardClaimId,
  googlePlaceIdTutorial: {
    title: "Cara menemukan Google Place ID",
    description:
      "Gunakan Place ID agar tombol Google Review di kartu TapQR mengarah ke profil bisnis yang tepat.",
    steps: [
      {
        title: "Buka Place ID Finder",
        description: "Buka alat resmi Google di tab baru.",
      },
      {
        title: "Cari bisnis Anda",
        description:
          "Ketik nama bisnis dan alamat operasional hingga pin lokasi yang benar muncul.",
      },
      {
        title: "Salin Place ID",
        description:
          "Klik lokasi bisnis, lalu salin kode Place ID yang diawali ChIJ.",
      },
      {
        title: "Tempel di TapQR",
        description:
          "Kembali ke langkah klaim kartu, tempel kode tersebut pada kolom Google Place ID, lalu aktifkan kartu.",
      },
    ],
    googleDocs: "Buka Place ID Finder Google",
    backHome: "Kembali ke beranda",
  },
  userDashboard: userDashboardId,
  adminDashboard: adminDashboardId,
  accountSettings: {
    kicker: "Pengaturan akun",
    title: "Kelola akun Anda",
    description: "Periksa informasi akun dan perbarui keamanan login Anda.",
    profileTitle: "Informasi akun",
    name: "Nama",
    email: "Email",
    loginMethod: "Metode login",
    passwordLogin: "Email dan kata sandi",
    googleLogin: "Google",
    passwordTitle: "Ganti kata sandi",
    passwordDescription:
      "Masukkan kata sandi saat ini untuk memastikan akun ini milik Anda.",
    currentPassword: "Kata sandi saat ini",
    newPassword: "Kata sandi baru",
    confirmPassword: "Ulangi kata sandi baru",
    passwordPlaceholder: "Minimal 8 karakter",
    savePassword: "Simpan kata sandi baru",
    saving: "Menyimpan…",
    success: "Kata sandi berhasil diperbarui.",
    passwordMin: "Kata sandi baru minimal 8 karakter.",
    passwordMismatch: "Kata sandi baru belum sama.",
    wrongPassword: "Kata sandi saat ini tidak sesuai.",
    samePassword: "Gunakan kata sandi baru yang berbeda.",
    error: "Kata sandi belum dapat diperbarui. Coba lagi.",
    googlePasswordTitle: "Kata sandi dikelola oleh Google",
    googlePasswordDescription:
      "Akun ini masuk melalui Google. Ubah kata sandi melalui pengaturan Akun Google Anda.",
  },
  home: {
    titleStart: "Satu Tap, Lebih Banyak",
    titleAccent: "Review Google",
    titleEnd: "& Pelanggan Kembali",
    description:
      "Bantu pelanggan memberi ulasan Google, terhubung ke WiFi, membuka WhatsApp, melihat menu, dan mengikuti media sosial Anda—semuanya dalam satu tap atau scan.",
    getStarted: "Pilih Kartu TapQR",
    tryDemo: "Lihat fitur TapQR",
    illustrationAlt:
      "Ilustrasi pelanggan terhubung dengan bisnis melalui perangkat digital",
  },
  features: {
    heading: {
      kicker: "Fitur Utama",
      titleStart: "Semua yang bisnis Anda butuhkan untuk",
      titleAccent: "mengubah satu tap",
      titleEnd: "menjadi pelanggan setia",
    },
    reviewGrowth: {
      eyebrow: "REPUTASI",
      title: "Perbanyak Review Google",
      description:
        "Arahkan pelanggan yang puas langsung ke halaman ulasan Anda. Proses yang singkat membantu bisnis mendapatkan lebih banyak review tanpa membuat pelanggan kebingungan.",
      imageAlt:
        "Pelanggan memberi ulasan setelah melakukan tap pada kartu TapQR di sebuah kafe",
    },
    customerHub: {
      eyebrow: "KONEKSI",
      title: "Satu Tap ke Semua Kanal",
      description:
        "Satukan WiFi, WhatsApp, menu, lokasi, dan media sosial dalam satu pengalaman. Pelanggan cukup tap atau scan untuk menemukan tindakan yang mereka butuhkan.",
      imageAlt:
        "Ponsel yang menghubungkan pelanggan ke WiFi, pesan, menu, lokasi, dan media sosial",
    },
    flexibleNfcQr: {
      eyebrow: "FLEKSIBILITAS",
      title: "Ubah Tujuan Tanpa Cetak Ulang",
      description:
        "Perbarui tautan dan tujuan TapQR kapan saja dari dashboard. Kartu NFC dan QR yang sama tetap bisa dipakai saat promo, menu, atau kebutuhan bisnis berubah.",
      imageAlt:
        "Pemilik bisnis memperbarui tujuan kartu NFC dan QR melalui ponsel",
    },
    scanAnalytics: {
      eyebrow: "INSIGHT",
      title: "Pahami Setiap Tap dan Scan",
      description:
        "Lihat bagaimana pelanggan berinteraksi dengan TapQR, kanal yang paling sering dibuka, dan tren aktivitas yang membantu Anda mengambil keputusan lebih tepat.",
      imageAlt:
        "Pemilik bisnis melihat grafik analitik tap dan scan pada dashboard TapQR",
    },
  },
  pricing: {
    heading: {
      kicker: "Harga Sederhana",
      titleStart: "Pilih media TapQR",
      titleAccent: "sesuai kebutuhan",
      titleEnd: "bisnis Anda",
      description:
        "Semua media sudah termasuk NFC dan QR. Pilih bahan yang cocok, atau ambil paket lengkap dengan Google Review dan landing page.",
    },
    pvcCard: {
      name: "Kartu PVC",
      badge: "",
      description: "Kartu PVC dengan NFC dan QR, ringan dan mudah dibawa atau ditempel.",
      price: "Rp79.000",
      priceDetail: "/ unit",
      features: [
        "Tap NFC dan scan QR dalam satu kartu",
        "Desain dengan identitas bisnis",
        "Tujuan tautan dapat diperbarui",
      ],
      cta: "Pilih Kartu PVC",
    },
    acrylicBoard: {
      name: "Papan Akrilik",
      badge: "Paling Populer",
      description: "Papan akrilik berdiri dengan NFC dan QR, siap dipasang di meja dan kasir.",
      price: "Rp69.000",
      priceDetail: "/ unit",
      features: [
        "Tap NFC dan scan QR dalam satu papan",
        "Akrilik kokoh dan siap pasang",
        "Tujuan tautan dapat diperbarui",
      ],
      cta: "Pilih Papan Akrilik",
    },
    businessBundle: {
      name: "Paket Bisnis",
      badge: "Paling Lengkap",
      description: "Papan akrilik NFC + QR, ditambah setup Google Review dan landing page untuk bisnis Anda.",
      price: "Rp499.000",
      priceDetail: "/ paket",
      features: [
        "Papan akrilik NFC + QR",
        "Setup Google Business Profile dan link review",
        "Landing page bisnis (revisi 2 kali)",
      ],
      cta: "Pilih Paket Bisnis",
      note: "Domain dibayar terpisah (±Rp200-300 rb/tahun), kami bantu pilih dan daftarkan.",
      whatsappMessage:
        "Halo TapQR, saya tertarik membeli Paket Bisnis seharga Rp499.000.\n\nNama: \nNama bisnis: \nJenis usaha: \nKota: \n\nSaya membutuhkan:\n- Papan akrilik NFC + QR\n- Setup Google Business Profile dan link review\n- Landing page bisnis (revisi 2 kali)\n\nPilihan domain:\n[ ] Saya sudah memiliki domain\n[ ] Saya ingin dibantu memilih dan mendaftarkan domain\n[ ] Saya belum membutuhkan domain\n\nMohon informasi langkah pemesanan selanjutnya. Terima kasih.",
    },
    note: "Butuh domain sekalian? Paket Bisnis + Domain mulai Rp799.000. Hubungi kami.",
  },
  testimonials: {
    heading: {
      kicker: "Cerita Pelanggan",
      titleStart: "Pengalaman bisnis yang",
      titleAccent: "tumbuh bersama",
      titleEnd: "TapQR",
    },
    ratingLabel: "5 dari 5 bintang",
    coffeeShop: {
      quote:
        "Sekarang pelanggan yang puas langsung tahu harus klik apa. Proses meminta review jadi terasa lebih natural dan tidak mengganggu antrean di kasir.",
      name: "Rina A.",
      role: "Pemilik Kedai Kopi",
      initials: "RA",
    },
    barbershop: {
      quote:
        "Satu kartu di meja sudah cukup untuk mengarahkan pelanggan ke Google Review dan WhatsApp. Tim kami juga tidak perlu menjelaskan langkah yang panjang.",
      name: "Bagus P.",
      role: "Pemilik Barbershop",
      initials: "BP",
    },
    laundry: {
      quote:
        "Saat promo berubah, tautannya bisa langsung kami perbarui tanpa mencetak media baru. Praktis untuk bisnis kecil yang perlu bergerak cepat.",
      name: "Dewi L.",
      role: "Pemilik Laundry",
      initials: "DL",
    },
  },
  footer: {
    brandHomeLabel: "Kembali ke beranda TapQR",
    tagline:
      "Satu tap untuk membantu UMKM mendapatkan lebih banyak review, terhubung dengan pelanggan, dan bertumbuh lebih cerdas.",
    navigationLabel: "Navigasi footer",
    navigationTitle: "Jelajahi",
    faq: "Pertanyaan umum",
    home: "Beranda",
    features: "Fitur",
    pricing: "Harga",
    testimonials: "Testimoni",
    ctaTitle: "Siap membuat setiap tap lebih berarti?",
    ctaDescription:
      "Pilih media TapQR yang sesuai dan mulai hubungkan pelanggan dengan bisnis Anda.",
    ctaLabel: "Lihat pilihan paket",
    rights: "Hak cipta dilindungi.",
    backToTop: "Kembali ke atas",
  },
};
