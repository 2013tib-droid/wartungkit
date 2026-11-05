# Warung Kantor

Dashboard penjualan + arus kas untuk warung camilan kantor. Satu file `index.html`, tanpa server, tanpa internet.

## Cara pakai
1. Buka `index.html` di browser (HP/laptop), atau aktifkan GitHub Pages (Settings → Pages → branch ini, folder root).
2. **Arus Kas** → catat *Modal awal* (uang yang kamu siapkan untuk usaha).
3. **Belanja Shopee** → tiap kali belanja mingguan, isi qty (pcs) dan subtotal per produk, plus ongkir / biaya layanan / voucher. Stok & modal per pcs otomatis terhitung.
4. **Jual** → ketuk produk yang terjual (ketuk lama / klik kanan untuk mengurangi), lalu *Simpan penjualan*. Bisa dicatat per transaksi atau direkap di akhir hari.
5. **Dashboard** → omzet, laba kotor, kas masuk/keluar, saldo, nilai stok, produk terlaris, dan saran restock untuk belanja minggu depan.
6. **Produk & Stok** → ubah harga, tambah produk, *Opname* kalau stok fisik beda.

## Catatan
- Data tersimpan di browser (localStorage). Rutin **Data → Unduh cadangan** dan pakai *Pulihkan* untuk pindah perangkat.
- Modal per pcs = rata-rata dari semua belanja, sudah termasuk porsi ongkir/biaya dan dikurangi voucher.
