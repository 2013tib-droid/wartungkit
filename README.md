# Warung Kantor

Dashboard penjualan + arus kas untuk warung camilan kantor. Bisa dipakai offline (buka `index.html`), atau di-online-kan di Vercel supaya HP dan laptop memakai data yang sama.

## Cara pakai
1. Buka alamat Vercel-mu (lihat di bawah), atau buka `index.html` langsung kalau cukup di satu perangkat.
2. **Arus Kas** → catat *Modal awal* (uang yang kamu siapkan untuk usaha).
3. **Belanja Shopee** → tiap kali belanja mingguan, isi qty (pcs) dan subtotal per produk, plus ongkir / biaya layanan / voucher. Stok & modal per pcs otomatis terhitung.
4. **Jual** → ketuk produk yang terjual (ketuk lama / klik kanan untuk mengurangi), lalu *Simpan penjualan*. Bisa dicatat per transaksi atau direkap di akhir hari.
5. **Dashboard** → omzet, laba kotor, kas masuk/keluar, saldo, nilai stok, produk terlaris, dan saran restock untuk belanja minggu depan.
6. **Produk & Stok** → ubah harga, tambah produk, *Opname* kalau stok fisik beda.

## Catatan
- Data selalu tersimpan juga di perangkat, jadi tetap bisa mencatat saat sinyal hilang; begitu online lagi otomatis tersinkron.
- Tetap rutin **Data → Unduh cadangan** sebagai jaga-jaga.
- Modal per pcs = rata-rata dari semua belanja, sudah termasuk porsi ongkir/biaya dan dikurangi voucher.

## Online di Vercel (gratis)

Yang dipakai: **Vercel Hobby** (hosting) + **Upstash Redis free** (database, lewat Vercel Marketplace).

1. Daftar di <https://vercel.com> pakai akun GitHub.
2. **Add New → Project** → pilih repo `wartungkit` → *Framework Preset*: **Other** → **Deploy**.
3. Di halaman project: tab **Storage** → **Create Database** → pilih **Upstash** (Redis) → paket **Free** → hubungkan ke project ini. Variabel `KV_REST_API_URL` dan `KV_REST_API_TOKEN` akan terisi otomatis.
4. **Settings → Environment Variables** → tambah `WARUNG_PIN` = kata sandi pilihanmu (minimal 8 karakter, jangan cuma angka pendek).
5. Tab **Deployments** → titik tiga di deploy terakhir → **Redeploy** (supaya variabel baru terbaca).
6. Buka `https://<nama-project>.vercel.app` di HP **dan** laptop → menu **Data** → masukkan PIN → **Sambungkan**.
   Perangkat yang sudah punya data akan mengunggah datanya; perangkat yang masih kosong akan mengambil data online.
7. Di HP: menu browser → **Tambahkan ke Layar Utama** supaya terasa seperti aplikasi.

Cara kerja: semua data disimpan sebagai satu dokumen di Redis (`api/data.js`). Tiap perubahan dikirim otomatis
dan perangkat lain menarik data setiap ±20 detik. Kalau dua perangkat mencatat bersamaan, catatannya digabung,
tidak ada yang hilang.
