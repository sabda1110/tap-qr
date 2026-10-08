import { adminDashboardId } from "./admin-dashboard-id";
export const id = {
  outletProfile: {
    welcome: "Terhubung dengan kami melalui tautan berikut.",
    linksLabel: "Tautan outlet",
    empty: "Belum ada tautan yang tersedia. Silakan kembali lagi nanti.",
    unavailable: "Profil outlet tidak tersedia",
    unavailableDescription:
      "Outlet ini belum tersedia atau sedang dinonaktifkan.",
    error: "Profil belum dapat dimuat",
    errorDescription: "Silakan muat ulang halaman beberapa saat lagi.",
    poweredBy: "Didukung oleh",
    channels: {
      google_review: "Beri Ulasan di Google",
      whatsapp: "Hubungi WhatsApp",
      instagram: "Instagram",
      tiktok: "TikTok",
      facebook: "Facebook",
      custom: "Buka tautan",
    },
  },
  header: {
    brandHomeLabel: "Beranda TapQR",
    mainNavigationLabel: "Navigasi utama",
    features: "Fitur",
    pricing: "Harga",
    testimonials: "Testimoni",
    login: "Masuk",
    register: "Daftar",
    languageLabel: "Pilih bahasa",
    openMenu: "Buka menu navigasi",
    closeMenu: "Tutup menu navigasi",
  },
  auth: {
    backHome: "Kembali ke beranda",
    languageLabel: "Pilih bahasa",
    google: "Lanjutkan dengan Google",
    divider: "atau gunakan email",
    nameLabel: "Nama lengkap",
    namePlaceholder: "Masukkan nama lengkap",
    emailLabel: "Email",
    emailPlaceholder: "nama@bisnisanda.com",
    passwordLabel: "Kata sandi",
    passwordPlaceholder: "Minimal 8 karakter",
    confirmPasswordLabel: "Ulangi kata sandi",
    confirmPasswordPlaceholder: "Masukkan kembali kata sandi",
    validation: {
      nameMin: "Nama minimal 2 karakter.",
      email: "Masukkan alamat email yang valid.",
      passwordMin: "Kata sandi minimal 8 karakter.",
      passwordsMismatch: "Kata sandi belum sama.",
    },
    errors: {
      emailInUse: "Email ini sudah terdaftar. Silakan masuk ke akun Anda.",
      googleCancelled: "Proses masuk dengan Google dibatalkan.",
      invalidCredential: "Email atau kata sandi tidak sesuai.",
      unavailable: "Autentikasi belum dapat diproses. Coba lagi beberapa saat.",
      weakPassword: "Kata sandi terlalu lemah. Gunakan setidaknya 8 karakter.",
    },
    login: {
      kicker: "Selamat datang kembali",
      title: "Masuk ke TapQR",
      description:
        "Kelola tautan, pantau setiap tap, dan bantu bisnis Anda mendapatkan lebih banyak review.",
      submit: "Masuk",
      switchPrompt: "Belum punya akun?",
      switchAction: "Daftar sekarang",
      showcaseKicker: "Satu tap, dampak nyata",
      showcaseTitle: "Hubungkan pelanggan dengan bisnis Anda.",
      showcaseDescription:
        "Satu halaman ringkas untuk Google Review, WhatsApp, WiFi, menu, dan kanal penting lainnya.",
      benefits: [
        "Siap dipakai dalam hitungan menit",
        "Tautan dapat diubah kapan saja",
      ],
    },
    register: {
      kicker: "Mulai bersama TapQR",
      title: "Buat akun baru",
      description:
        "Siapkan pengalaman tap dan scan pertama untuk bisnis Anda tanpa proses yang rumit.",
      submit: "Buat akun",
      switchPrompt: "Sudah punya akun?",
      switchAction: "Masuk ke akun",
      showcaseKicker: "Dibuat untuk UMKM",
      showcaseTitle: "Ubah setiap kunjungan menjadi koneksi baru.",
      showcaseDescription:
        "Permudah pelanggan menemukan bisnis, meninggalkan review, dan kembali terhubung setelah transaksi.",
      benefits: [
        "QR dan NFC dalam satu pengalaman",
        "Insight tap dan scan yang mudah dipahami",
      ],
    },
  },
  cardClaim: {
    title: "Aktifkan kartu TapQR",
    description:
      "Selesaikan dua langkah singkat agar kartu siap dipakai pelanggan.",
    step: "Langkah {current} dari 2",
    steps: {
      outlet: "Buat atau pilih outlet",
      links: "Tautkan & konfigurasi kartu",
    },
    newOutlet: "Buat outlet baru",
    existingOutlet: "Pilih outlet yang sudah ada",
    selectOutlet: "Pilih outlet",
    noOutlets:
      "Belum ada outlet yang terdaftar. Buat outlet baru untuk melanjutkan.",
    outletDescription:
      "Pilih outlet yang akan menggunakan kartu ini, atau buat outlet baru terlebih dahulu.",
    linksDescription:
      "Masukkan Google Place ID untuk tombol review, lalu tambahkan tautan sosial bila diperlukan.",
    next: "Lanjut ke langkah 2",
    back: "Kembali ke langkah 1",
    card: "ID kartu TapQR",
    name: "Nama outlet",
    slug: "Alamat profil outlet",
    help: "Gunakan huruf kecil, angka, dan tanda hubung.",
    save: "Klaim & aktifkan kartu",
    saving: "Menyimpan…",
    cancel: "Tutup",
    success: "Outlet berhasil ditambahkan dan kartu sudah aktif.",
    error: "Tidak dapat menyimpan. Periksa kartu dan coba lagi.",
    slugError: "Alamat profil sudah digunakan. Pilih alamat lain.",
    invalid:
      "Lengkapi data outlet, ID kartu, dan minimal satu tautan yang valid.",
    outletInvalid:
      "Lengkapi nama outlet, alamat profil, dan alamat operasional.",
    outletRequired: "Pilih outlet untuk melanjutkan.",
    placeIdGuide: {
      quick: "Cari Place ID bisnis Anda melalui",
      googleDocs: "panduan Google",
      tutorial: "Atau lihat tutorial TapQR lengkap",
    },
    scanner: {
      action: "Scan QR kartu",
      title: "Arahkan kamera ke QR kartu",
      description: "ID kartu akan terisi otomatis setelah QR terdeteksi.",
      stop: "Hentikan scanner",
      unsupported: "Scanner QR belum didukung oleh browser ini.",
      denied: "Kamera tidak dapat digunakan. Izinkan akses kamera lalu coba lagi.",
      invalid: "QR ini bukan kartu TapQR yang valid.",
    },
    copy: {
      title: "Duplikat tautan dari kartu lain",
      description: "Pilih kartu sumber lalu salin tautan yang ingin digunakan kembali.",
      outlet: "Outlet sumber",
      card: "Kartu sumber",
      select: "Pilih sumber",
      loading: "Memuat kartu...",
      error: "Kartu sumber belum dapat dimuat.",
      empty: "Belum ada kartu aktif pada outlet ini.",
      noLinks: "Kartu sumber belum memiliki tautan.",
      action: "Salin tautan pilihan",
      copied: "Tautan berhasil disalin.",
      tooMany: "Maksimal 20 tautan per kartu.",
    },
    outlets: "Outlet Anda",
    profile: "Lihat profil outlet",
  },
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
  userDashboard: {
    kicker: "Dashboard bisnis",
    greeting: "Halo",
    description:
      "Siapkan TapQR Anda, lalu bantu pelanggan menemukan tautan yang tepat dalam satu tap atau scan.",
    sidebar: {
      dashboard: "Dashboard",
      logout: "Keluar",
      navigationLabel: "Navigasi dashboard",
      qrGenerator: "Buat QR",
    },
    startCard: {
      title: "Mulai siapkan pengalaman pertama Anda",
      description:
        "Buat profil bisnis dan pilih tujuan utama agar media QR atau NFC siap digunakan pelanggan.",
      action: "Siapkan bisnis",
    },
    statusCards: {
      mediaTitle: "Media TapQR",
      media:
        "Belum ada QR atau NFC yang terhubung. Anda dapat menambahkannya setelah profil bisnis siap.",
      profileTitle: "Profil akun",
      profile:
        "Akun Anda sudah aktif. Berikutnya, lengkapi profil bisnis untuk mulai menggunakan TapQR.",
    },
  },
  adminDashboard: adminDashboardId,
  qrGenerator: {
    kicker: "Generator QR",
    title: "Buat QR untuk tautan Anda",
    inputLabel: "Tautan tujuan",
    inputPlaceholder: "https://contoh.com/menu",
    invalidUrl:
      "Masukkan tautan lengkap yang dimulai dengan http:// atau https://.",
    generate: "Buat QR",
    previewTitle: "Preview QR",
    emptyPreview: "Masukkan tautan lalu buat QR Anda.",
    previewAlt: "Kode QR untuk tautan bisnis Anda",
    download: "Unduh PNG",
  },
  home: {
    titleStart: "Satu Tap, Lebih Banyak",
    titleAccent: "Review Google",
    titleEnd: "& Pelanggan Kembali",
    description:
      "Bantu pelanggan memberi ulasan Google, terhubung ke WiFi, membuka WhatsApp, melihat menu, dan mengikuti media sosial Anda—semuanya dalam satu tap atau scan.",
    getStarted: "Mulai Gratis",
    tryDemo: "Lihat cara kerjanya",
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
        "Mulai dengan QR yang Anda cetak sendiri atau pilih media siap pakai untuk langsung ditempatkan di meja dan kasir.",
    },
    selfPrint: {
      name: "QR Mandiri",
      badge: "",
      description: "File QR siap cetak untuk Anda produksi sendiri.",
      price: "Rp5.000",
      priceDetail: "/ unit",
      features: [
        "File QR siap cetak",
        "Desain dengan identitas bisnis",
        "Tujuan tautan dapat diperbarui",
      ],
      cta: "Pilih QR Mandiri",
    },
    qrBoard: {
      name: "Papan QR",
      badge: "Paling Populer",
      description: "Papan QR siap pakai yang dicetak oleh tim TapQR.",
      price: "Rp10.000",
      priceDetail: "/ unit",
      features: [
        "Papan QR siap dipasang",
        "Dicetak oleh tim TapQR",
        "Tujuan tautan dapat diperbarui",
      ],
      cta: "Pilih Papan QR",
    },
    nfcBundle: {
      name: "NFC + Papan QR",
      badge: "Paling Lengkap",
      description: "Pengalaman tap NFC dan scan QR dalam satu media.",
      price: "Rp20.000",
      priceDetail: "/ unit",
      features: [
        "Tap NFC dan scan QR",
        "Papan QR siap dipasang",
        "Cocok untuk meja dan kasir",
      ],
      cta: "Pilih Paket NFC",
    },
    note: "Harga media satu kali bayar per unit. Biaya pengiriman dan layanan dashboard lanjutan dapat dihitung terpisah.",
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
