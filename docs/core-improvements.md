# Perbaikan checkout, analitik, dan performa

## Pilihan media dari pricing

CTA PVC dan akrilik membawa `material` melalui search URL yang divalidasi
`checkoutSearchSchema`. Redirect tamu ke checkout owner mempertahankan pilihan.
Form pembelian baru memakai pilihan tersebut; form edit tetap memakai data order.
URL tanpa pilihan atau dengan nilai tidak valid menggunakan default akrilik.
Perubahan query material mereset form pembelian, bukan mengubah order tersimpan.

## Gambar marketing

Empat sumber PNG fitur dipertahankan. Landing page memakai WebP transparan pada
lebar 520 dan 1040 piksel dengan `srcSet`, `sizes`, lazy loading, decoding async,
serta dimensi intrinsik untuk mengurangi pergeseran layout. Encode memakai
`cwebp -q 84 -m 6 -exact -alpha_q 100 -metadata none` agar warna tepi transparan
tetap terjaga. Perubahan ini tidak mengganti ilustrasi.

## Validasi

`npm run test:core` menjalankan suite pesanan serta regresi pilihan material,
deduplikasi/batas analitik, kondisi statistik gagal, dan isolasi query outlet.
Firestore pada pengujian diganti mock; pengujian tidak menulis data produksi.
TypeScript dan build tetap harus diperiksa setelah perubahan.

Pemeriksaan manual: CTA PVC/akrilik sebagai tamu dan owner, perubahan query pada
route pembelian, tampilan gambar di desktop/mobile, serta coba ulang statistik
admin ketika koneksi pulih. Deployment TTL dilakukan bersama konfigurasi database.
